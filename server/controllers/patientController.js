import mongoose from "mongoose";
import patientModel from "../models/patientModel.js";
import appointmentModel from "../models/appointmentModel.js";
import authModel from "../models/authModel.js";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import { cache } from "../utils/cache.js";

//Patient Routes
const upsertSelfPatient = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ success: false, errors: errors.array().map((e) => e.msg) });
  }

  const patientID = req.user.id;

  try {
    let patient = await patientModel.findOneAndUpdate({ patientID }, req.body, {
      new: true,
    });
    let isNewPatient = false;

    if (!patient) {
      const newPatient = new patientModel({ ...req.body, patientID });
      patient = await newPatient.save();
      isNewPatient = true;
    }

    // Invalidate cached profile/role for this user
    await cache.del(`user:${patientID}:profile`);
    await cache.del(`user:${patientID}:role`);

    // Fetch updated user to get the new role
    const updatedUser = await authModel.findById(patientID);
    if (updatedUser && updatedUser.role === "patient") {
      // Generate new token with updated role
      const newToken = jwt.sign(
        { id: updatedUser._id, role: updatedUser.role },
        process.env.JWT_SECRET,
        { expiresIn: "6h" }
      );

      if (isNewPatient) {
        return res.status(201).json({
          success: true,
          message: "Registered as new patient successfully",
          data: patient,
          token: newToken,
        });
      }

      return res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: patient,
        token: newToken,
      });
    }

    if (isNewPatient) {
      return res.status(201).json({
        success: true,
        message: "Registered as new patient successfully",
        data: patient,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: patient,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

const getSelfPatient = async (req, res) => {
  try {
    const patient = await patientModel.findOne({ patientID: req.user.id });
    if (!patient) {
      return res
        .status(404)
        .json({ success: false, message: "Patient record not found" });
    }
    return res.status(200).json({
      success: true,
      message: "Patient record found",
      data: patient,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

//Admin Routes
const addPatient = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation Failed",
      errors: errors.array().map((err) => err.msg),
    });
  }

  if (
    !req.body.patientID ||
    !mongoose.Types.ObjectId.isValid(req.body.patientID)
  ) {
    return res.status(400).json({
      success: false,
      message: "patientID (user _id) is required and must be valid",
    });
  }

  try {
    const newPatient = new patientModel(req.body);
    const saved = await newPatient.save();

    return res.status(201).json({
      success: true,
      message: "Patient Addedd successfully",
      data: saved,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to add patient",
      error: err.message,
    });
  }
};

const getAllPatients = async (req, res) => {
  try {
    const patients = await patientModel.find({});

    return res.status(200).json({
      success: true,
      message: "Successfully retrieved patients data",
      data: patients,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error retrieving data",
    });
  }
};

const getPatient = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid ID provided",
    });
  }

  try {
    const patient = await patientModel.findOne({
      patientID: id,
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Couldn't find patient",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Patient found",
      data: patient,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error retrieving patient",
    });
  }
};

const updatePatient = async (req, res) => {
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
      message: "Invalid ID provided",
    });
  }

  try {
    const updated = await patientModel.findOneAndUpdate(
      { patientID: new mongoose.Types.ObjectId(id) },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    // Invalidate cached profile/role for this patient
    await cache.del(`user:${id}:profile`);
    await cache.del(`user:${id}:role`);

    return res.status(200).json({
      success: true,
      message: "Successfully updated patient",
      data: updated,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server Error while updating",
      error: err.message,
    });
  }
};

const deletePatient = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid ID provided",
    });
  }

  try {
    const deleted = await patientModel.findOneAndDelete({
      patientID: id,
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    // Cancel future appointments for this patient
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    await appointmentModel.updateMany(
      { patientID: deleted._id, date: { $gte: today } },
      { $set: { status: "Cancelled" } }
    );

    // Invalidate cached profile/role for this patient
    await cache.del(`user:${id}:profile`);
    await cache.del(`user:${id}:role`);
    await cache.del(`user:${id}:patientId`);
    await cache.delPattern(`user:${deleted._id}:appointments:*`);

    res.status(200).json({
      success: true,
      message: "Successfully deleted patient",
    });
  } catch (err) {
    return res.status(501).json({
      success: false,
      message: "Server Error while deleting",
      error: err.message,
    });
  }
};

export {
  upsertSelfPatient,
  getSelfPatient,
  getAllPatients,
  getPatient,
  updatePatient,
  deletePatient,
  addPatient,
};
