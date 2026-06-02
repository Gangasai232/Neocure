import appointmentModel from "../models/appointmentModel.js";
import { validationResult } from "express-validator";
import patientModel from "../models/patientModel.js";
import doctorModel from "../models/doctorModel.js";
import authModel from "../models/authModel.js";
import mongoose from "mongoose";
import { cache } from "../utils/cache.js";

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
    date,
    timeSlot,
  } = req.body;

  // 1. Start a Session
  const session = await mongoose.startSession();

  try {
    // 2. Start Transaction with SERIALIZABLE isolation (Snapshot)
    session.startTransaction({
      readConcern: { level: "snapshot" },
      writeConcern: { w: "majority" },
    });

    const effectivePatientUserId =
      req.user.role === "admin" ? patientUserIdFromBody : requesterUserId;

    if (!effectivePatientUserId) {
      if (session.inTransaction()) {
        await session.abortTransaction();
      }
      session.endSession();
      return res.status(400).json({
        success: false,
        message: "patientID is required when booking as admin",
      });
    }

    const pat = await patientModel
      .findOne({ patientID: effectivePatientUserId })
      .session(session);
    if (!pat) {
      throw new Error("Patient profile not found");
    }
    const patientID = pat._id;

    // Doctor Schedule Locking / Availability Check
    if (!doctorDocId) {
      if (session.inTransaction()) {
        await session.abortTransaction();
      }
      session.endSession();
      return res.status(400).json({
        success: false,
        message: "Doctor ID is required",
      });
    }

    const doctor = await doctorModel.findById(doctorDocId).session(session);

    if (!doctor) {
      console.error(
        `Doctor not found for doctorID: ${doctorDocId}, doctors collection check needed`
      );
      throw new Error(
        `Doctor profile not found for ID ${doctorDocId}. The doctor may not have created their profile yet.`
      );
    }

    if (doctor.status === "Away") {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: "Doctor is currently unavailable (Status: Away)",
      });
    }

    // Enforce one booking per doctor per timeSlot per date
    const slotConflict = await appointmentModel
      .findOne({ doctorID: doctor._id, date, timeSlot })
      .session(session);
    if (slotConflict) {
      await session.abortTransaction();
      session.endSession();
      return res.status(409).json({
        success: false,
        message: "This time slot is already booked for the doctor.",
      });
    }

    // Conflict Detection: Check if patient already booked for this doctor on same date
    const existingPatientBooking = await appointmentModel
      .findOne({
        patientID,
        doctorID: doctor._id,
        date,
      })
      .session(session);

    if (existingPatientBooking) {
      await session.abortTransaction();
      session.endSession();
      return res.status(409).json({
        success: false,
        message:
          "You already have an appointment with this doctor on this date.",
      });
    }

    // Create Appointment
    const appointment = new appointmentModel({
      patientID,
      doctorID: doctor._id,
      date,
      timeSlot,
      status: "Pending",
      reason: req.body.reason,
    });

    // Save with the session
    await appointment.save({ session });

    // Clear appointment caches for doctor and patient
    await cache.del(`doctor:${doctor._id}:appointments`);
    await cache.delPattern(`user:${effectivePatientUserId}:appointments:*`);

    // 3. Commit Transaction
    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      success: true,
      message: "Appointment successfully booked",
    });
  } catch (err) {
    // 4. Rollback on failure
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    session.endSession();

    // Check for MongoDB duplicate key error (Race condition catcher)
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
  const { id: userId } = req.user;
  const { id: appointmentId } = req.params;

  // Fetch user from DB to get current role (in case it was updated after login)
  const user = await authModel.findById(userId);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }
  const role = user.role;

  if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid appointment ID",
    });
  }

  try {
    const update = { status: req.body.status };
    const filter = { _id: appointmentId };

    if (role === "doctor") {
      const doctor = await doctorModel.findOne({ doctorID: userId });
      if (!doctor) {
        return res.status(404).json({
          success: false,
          message: "Doctor profile not found",
        });
      }
      filter.doctorID = doctor._id;
    } else if (role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const appointment = await appointmentModel.findOneAndUpdate(
      filter,
      update,
      {
        new: true,
      }
    );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // Invalidate appointment caches for doctor and patient
    const doctorIdStr = appointment.doctorID?.toString();
    const patientIdStr = appointment.patientID?.toString();
    if (doctorIdStr) {
      await cache.del(`doctor:${doctorIdStr}:appointments`);
    }
    if (patientIdStr) {
      await cache.delPattern(`user:${patientIdStr}:appointments:*`);
    }

    return res.status(200).json({
      success: true,
      message: "Appointment status updated",
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
    } else if (role === "patient") {
      // Try cached patient ObjectId
      let patientId = await cache.get(`user:${userID}:patientId`);
      if (!patientId) {
        const patient = await patientModel
          .findOne({ patientID: userID })
          .select("_id")
          .lean();
        if (!patient)
          return res.status(404).json({
            success: false,
            message: "Patient not found",
          });
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
  getAppointment,
  getAllAppointments,
};
