import appointmentModel from "../models/appointmentModel.js";
import { validationResult } from "express-validator";
import patientModel from "../models/patientModel.js";
import doctorModel from "../models/doctorModel.js";
import authModel from "../models/authModel.js";
import mongoose from "mongoose";
import { cache } from "../utils/cache.js";

const APPOINTMENT_STATUS = ["Pending", "Completed", "Rejected", "Cancelled"];

const normalizeToUtcDateOnly = (value) => {
  if (!value) return null;
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value)) {
    const datePart = value.split("T")[0];
    const [year, month, day] = datePart.split("-").map(Number);
    if (!year || !month || !day) return null;
    return new Date(Date.UTC(year, month - 1, day));
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return new Date(
    Date.UTC(parsed.getUTCFullYear(), parsed.getUTCMonth(), parsed.getUTCDate())
  );
};

const getScopedAppointmentFilter = async (user, appointmentId) => {
  const filter = { _id: appointmentId };

  if (user.role === "doctor") {
    const doctor = await doctorModel.findOne({ doctorID: user.id }).select("_id");
    if (!doctor) {
      return { error: { status: 404, message: "Doctor profile not found" } };
    }

    filter.doctorID = doctor._id;
    return { filter };
  }

  if (user.role === "patient" || user.role === "user") {
    const patient = await patientModel.findOne({ patientID: user.id }).select("_id");
    if (!patient) {
      return { error: { status: 404, message: "Patient profile not found" } };
    }

    filter.patientID = patient._id;
  }

  return { filter };
};

const invalidateAppointmentCache = async (appointment) => {
  const doctorIdStr = appointment.doctorID?.toString();
  const patientIdStr = appointment.patientID?.toString();

  if (doctorIdStr) {
    await cache.del(`doctor:${doctorIdStr}:appointments`);
  }

  if (patientIdStr) {
    await cache.delPattern(`user:${patientIdStr}:appointments:*`);
  }
};

const createAppointment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation Failed",
      errors: errors.array().map((err) => err.msg),
    });
  }

  const requesterUserId = req.user.id;
  const {
    doctorID: doctorDocId,
    patientID: patientUserIdFromBody,
    date: requestedDate,
    timeSlot,
  } = req.body;

  const appointmentDate = normalizeToUtcDateOnly(requestedDate);
  if (!appointmentDate) {
    return res.status(400).json({
      success: false,
      message: "Invalid appointment date",
    });
  }

  let session = null;
  let sessionOptions = {};
  try {
    session = await mongoose.startSession();
    session.startTransaction({
      readConcern: { level: "snapshot" },
      writeConcern: { w: "majority" },
    });
    sessionOptions = { session };
  } catch {
    if (session) {
      try {
        session.endSession();
      } catch (_) {}
      session = null;
    }
    sessionOptions = {};
  }

  try {
    const effectivePatientUserId =
      req.user.role === "admin" ? patientUserIdFromBody : requesterUserId;

    if (!effectivePatientUserId) {
      if (session && session.inTransaction()) {
        await session.abortTransaction();
      }
      if (session) session.endSession();
      return res.status(400).json({
        success: false,
        message: "patientID is required when booking as admin",
      });
    }

    let pat = await patientModel.findOne(
      { patientID: effectivePatientUserId },
      null,
      sessionOptions
    );

    if (!pat) {
      const user = await authModel.findById(effectivePatientUserId);
      if (user) {
        pat = new patientModel({
          patientID: user._id,
          name: user.name || "Patient",
          age: 30,
          gender: "Male",
          phone: `${Math.floor(1000000000 + Math.random() * 9000000000)}`,
          description: "Registered Patient",
        });
        await pat.save(sessionOptions);
        await authModel.findByIdAndUpdate(user._id, {
          $set: { role: "patient" },
        });
      }
    }

    if (!pat) {
      if (session && session.inTransaction()) {
        await session.abortTransaction();
      }
      if (session) session.endSession();
      return res.status(404).json({
        success: false,
        message: "Patient profile not found. Please complete your profile first.",
      });
    }
    const patientID = pat._id;

    if (!doctorDocId) {
      if (session && session.inTransaction()) {
        await session.abortTransaction();
      }
      if (session) session.endSession();
      return res.status(400).json({
        success: false,
        message: "Doctor ID is required",
      });
    }

    const doctor = await doctorModel.findById(doctorDocId, null, sessionOptions);

    if (!doctor) {
      if (session && session.inTransaction()) {
        await session.abortTransaction();
      }
      if (session) session.endSession();
      return res.status(404).json({
        success: false,
        message: "Doctor profile not found. Please refresh and try again.",
      });
    }

    if (doctor.status === "Away") {
      if (session && session.inTransaction()) {
        await session.abortTransaction();
      }
      if (session) session.endSession();
      return res.status(400).json({
        success: false,
        message: "Doctor is currently unavailable (Status: Away)",
      });
    }

    const slotConflict = await appointmentModel.findOne(
      { doctorID: doctor._id, date: appointmentDate, timeSlot },
      null,
      sessionOptions
    );
    if (slotConflict) {
      if (session && session.inTransaction()) {
        await session.abortTransaction();
      }
      if (session) session.endSession();
      return res.status(409).json({
        success: false,
        message: "This time slot is already booked for the doctor.",
      });
    }

    const existingPatientBooking = await appointmentModel.findOne(
      {
        patientID,
        doctorID: doctor._id,
        date: appointmentDate,
      },
      null,
      sessionOptions
    );

    if (existingPatientBooking) {
      if (session && session.inTransaction()) {
        await session.abortTransaction();
      }
      if (session) session.endSession();
      return res.status(409).json({
        success: false,
        message:
          "You already have an appointment with this doctor on this date.",
      });
    }

    const appointment = new appointmentModel({
      patientID,
      doctorID: doctor._id,
      date: appointmentDate,
      timeSlot,
      status: "Pending",
      reason: req.body.reason,
    });

    await appointment.save(sessionOptions);

    await cache.del(`doctor:${doctor._id}:appointments`);
    await cache.delPattern(`user:${effectivePatientUserId}:appointments:*`);

    if (session && session.inTransaction()) {
      await session.commitTransaction();
    }
    if (session) session.endSession();

    return res.status(201).json({
      success: true,
      message: "Appointment successfully booked",
    });
  } catch (err) {
    if (session && session.inTransaction()) {
      await session.abortTransaction();
    }
    if (session) session.endSession();

    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Slot was just booked by another user. Please try again.",
      });
    }

    console.error("Transaction Error:", err);
    return res.status(500).json({
      success: false,
      message: "Appointment could not be created due to a server error",
      error: err.message,
    });
  }
};

const updateAppointment = async (req, res) => {
  const { id: appointmentId } = req.params;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation Failed",
      errors: errors.array().map((err) => err.msg),
    });
  }

  if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid appointment ID",
    });
  }

  try {
    const { filter, error } = await getScopedAppointmentFilter(
      req.user,
      appointmentId
    );

    if (error) {
      return res.status(error.status).json({
        success: false,
        message: error.message,
      });
    }

    const hasScheduleUpdate = ["doctorID", "date", "timeSlot", "reason"].some(
      (field) => typeof req.body[field] !== "undefined"
    );
    const hasStatusUpdate = typeof req.body.status !== "undefined";

    if (!hasScheduleUpdate && !hasStatusUpdate) {
      return res.status(400).json({
        success: false,
        message: "No appointment changes were provided",
      });
    }

    let appointment;

    if (hasStatusUpdate) {
      if (!APPOINTMENT_STATUS.includes(req.body.status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid appointment status",
        });
      }

      if (req.user.role === "patient" && req.body.status !== "Cancelled") {
        return res.status(403).json({
          success: false,
          message: "Patients can only cancel their appointments",
        });
      }

      appointment = await appointmentModel.findOneAndUpdate(
        filter,
        { status: req.body.status },
        { new: true, runValidators: true }
      );
    } else {
      if (req.user.role === "doctor") {
        return res.status(403).json({
          success: false,
          message: "Doctors cannot reschedule appointments from this route",
        });
      }

      const currentAppointment = await appointmentModel.findOne(filter);
      if (!currentAppointment) {
        return res.status(404).json({
          success: false,
          message: "Appointment not found",
        });
      }

      let nextDoctorId = currentAppointment.doctorID;
      if (req.body.doctorID) {
        const doctor = await doctorModel.findById(req.body.doctorID);
        if (!doctor) {
          return res.status(404).json({
            success: false,
            message: "Doctor profile not found",
          });
        }

        if (doctor.status === "Away") {
          return res.status(400).json({
            success: false,
            message: "Doctor is currently unavailable (Status: Away)",
          });
        }

        nextDoctorId = doctor._id;
      }

      const nextDate = req.body.date || currentAppointment.date;
      const nextDateNormalized = normalizeToUtcDateOnly(nextDate);
      if (!nextDateNormalized) {
        return res.status(400).json({
          success: false,
          message: "Invalid appointment date",
        });
      }
      const nextTimeSlot = req.body.timeSlot || currentAppointment.timeSlot;

      const slotConflict = await appointmentModel.findOne({
        _id: { $ne: currentAppointment._id },
        doctorID: nextDoctorId,
        date: nextDateNormalized,
        timeSlot: nextTimeSlot,
      });

      if (slotConflict) {
        return res.status(409).json({
          success: false,
          message: "This time slot is already booked for the doctor.",
        });
      }

      appointment = await appointmentModel.findOneAndUpdate(
        filter,
        {
          doctorID: nextDoctorId,
          date: nextDateNormalized,
          timeSlot: nextTimeSlot,
          reason: req.body.reason || currentAppointment.reason,
        },
        { new: true, runValidators: true }
      );
    }

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    await invalidateAppointmentCache(appointment);

    return res.status(200).json({
      success: true,
      message: hasStatusUpdate
        ? "Appointment status updated"
        : "Appointment updated successfully",
      data: appointment,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error updating",
      error: err.message,
    });
  }
};

const cancelAppointment = async (req, res) => {
  req.body.status = "Cancelled";
  return updateAppointment(req, res);
};

const getAppointment = async (req, res) => {
  const { id: userID } = req.user;
  const { id: appointmentId } = req.params;

  try {
    const role = req.user.role;

    let filter = {};

    if (role === "admin") {
      if (appointmentId && mongoose.Types.ObjectId.isValid(appointmentId)) {
        filter._id = appointmentId;
      }
    } else if (role === "doctor") {
      // Try cached doctor ObjectId
      let doctorId = await cache.get(`user:${userID}:doctorId`);
      if (!doctorId) {
        const doctor = await doctorModel
          .findOne({ doctorID: userID })
          .select("_id")
          .lean();
        if (!doctor)
          return res.status(404).json({
            success: false,
            message: "Doctor not found",
          });
        doctorId = doctor._id;
        await cache.set(`user:${userID}:doctorId`, doctorId, 600);
      }
      filter.doctorID = doctorId;
      if (appointmentId && mongoose.Types.ObjectId.isValid(appointmentId)) {
        filter._id = appointmentId;
      }
    } else if (role === "patient" || role === "user") {
      let patientId = await cache.get(`user:${userID}:patientId`);
      if (!patientId) {
        const patient = await patientModel
          .findOne({ patientID: userID })
          .select("_id")
          .lean();
        if (!patient) {
          return res.status(200).json({
            success: true,
            message: "Appointments retrieved successfully",
            data: [],
          });
        }
        patientId = patient._id;
        await cache.set(`user:${userID}:patientId`, patientId, 600);
      }
      filter.patientID = patientId;
      if (appointmentId && mongoose.Types.ObjectId.isValid(appointmentId)) {
        filter._id = appointmentId;
      }
    } else {
      return res.status(403).json({
        success: false,
        message: "Unauthorized role",
      });
    }

    const appointments = await appointmentModel
      .find(filter)
      .populate("doctorID")
      .populate("patientID");

    return res.status(200).json({
      success: true,
      message: "Appointments retrieved successfully",
      data: appointments,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error fetching appointments",
      error: err.message,
    });
  }
};

const getAllAppointments = async (req, res) => {
  try {
    const appointments = await appointmentModel
      .find({})
      .populate("patientID")
      .populate("doctorID");

    return res.status(200).json({
      success: true,
      message: "All appointments retrieved",
      data: appointments,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error fetching appointments",
      error: err,
    });
  }
};

export {
  createAppointment,
  updateAppointment,
  cancelAppointment,
  getAppointment,
  getAllAppointments,
};
