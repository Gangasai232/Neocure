import { validationResult } from "express-validator";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import mongoose from "mongoose";
import { cache } from "../utils/cache.js";

const addDoctor = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation Failed",
      errors: errors.array().map((err) => err.msg),
    });
  }

  if (
    !req.body.doctorID ||
    !mongoose.Types.ObjectId.isValid(req.body.doctorID)
  ) {
    return res.status(400).json({
      success: false,
      message: "doctorID (user _id) is required and must be valid",
    });
  }

  try {
    const doctor = new doctorModel(req.body);
    await doctor.save();

    // Invalidate doctors list cache
    await cache.del("doctors:all");

    return res.status(201).json({
      success: true,
      message: "Doctor created successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Couldn't create doctor",
      error: err,
    });
  }
};

const getAllDoctors = async (req, res) => {
  try {
    // Try to get from cache first (TTL: 15 minutes)
    let doctors = await cache.get("doctors:all");

    if (!doctors) {
      doctors = await doctorModel.find({});
      // Cache the list
      await cache.set("doctors:all", doctors, 900); // 15 min TTL
    }
    return res.status(200).json({
      success: true,
      message: "All doctors retrieved",
      data: doctors,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err,
    });
  }
};

const getDoctor = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid ID provided",
    });
  }

  try {
    // Try to get from cache first (TTL: 10 minutes)
    let doctor = await cache.get(`doctor:${id}`);

    if (!doctor) {
      doctor = await doctorModel.findOne({ doctorID: id });
      if (doctor) {
        await cache.set(`doctor:${id}`, doctor, 600); // 10 min TTL
      }
    }

    return res.status(200).json({
      success: true,
      message: "Successfully retrieved",
      data: doctor,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Couldn't retrieve",
      error: err,
    });
  }
};

const updateDoctor = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation Failed",
      errors: errors.array().map((err) => err.msg),
    });
  }

  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid ID",
    });
  }

  try {
    const updated = await doctorModel.findOneAndUpdate(
      { doctorID: id },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    // Invalidate cache
    await cache.del(`doctor:${id}`);
    await cache.del("doctors:all");

    return res.status(200).json({
      success: true,
      message: "Updated doctor",
      data: updated,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: err,
    });
  }
};

const deleteDoctor = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid ID",
    });
  }

  try {
    const deleted = await doctorModel.findOneAndDelete({ doctorID: id });
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    // Cancel future appointments for this doctor
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    await appointmentModel.updateMany(
      { doctorID: deleted._id, date: { $gte: today } },
      { $set: { status: "Cancelled" } }
    );

    // Invalidate caches
    await cache.del(`doctor:${id}`);
    await cache.del("doctors:all");
    await cache.del(`doctor:${deleted._id}:appointments`);
    await cache.del(`user:${id}:doctorId`);
    await cache.delPattern(`user:*:appointments:*`);

    return res.status(200).json({
      success: true,
      message: "Successfully deleted",
      data: deleted,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: err,
    });
  }
};

export { addDoctor, getAllDoctors, getDoctor, updateDoctor, deleteDoctor };
