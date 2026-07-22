import mongoose from "mongoose";
import { validationResult } from "express-validator";
import medicalRecordModel from "../models/medicalRecordModel.js";
import patientModel from "../models/patientModel.js";
import doctorModel from "../models/doctorModel.js";

const resolveScopedFilters = async (req) => {
  const filters = {};

  if (req.user.role === "patient") {
    const patient = await patientModel.findOne({ patientID: req.user.id }).select("_id");
    if (!patient) {
      return { error: { status: 404, message: "Patient profile not found" } };
    }

    filters.patientID = patient._id;
  }

  if (req.user.role === "doctor") {
    const doctor = await doctorModel.findOne({ doctorID: req.user.id }).select("_id");
    if (!doctor) {
      return { error: { status: 404, message: "Doctor profile not found" } };
    }

    filters.doctorID = doctor._id;
  }

  return { filters };
};

const getMedicalRecords = async (req, res) => {
  try {
    const { filters, error } = await resolveScopedFilters(req);
    if (error) {
      return res.status(error.status).json({
        success: false,
        message: error.message,
      });
    }

    if (req.query.patientID && mongoose.Types.ObjectId.isValid(req.query.patientID)) {
      filters.patientID = req.query.patientID;
    }

    const records = await medicalRecordModel
      .find(filters)
      .populate("patientID", "name age gender phone")
      .populate("doctorID", "name specialization department")
      .sort({ visitDate: -1 });

    return res.status(200).json({
      success: true,
      message: "Medical records retrieved successfully",
      data: records,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch medical records",
      error: error.message,
    });
  }
};

const getMedicalRecordById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid medical record ID",
    });
  }

  try {
    const { filters, error } = await resolveScopedFilters(req);
    if (error) {
      return res.status(error.status).json({
        success: false,
        message: error.message,
      });
    }

    const record = await medicalRecordModel
      .findOne({ _id: id, ...filters })
      .populate("patientID", "name age gender phone")
      .populate("doctorID", "name specialization department");

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Medical record not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Medical record retrieved successfully",
      data: record,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch medical record",
      error: error.message,
    });
  }
};

const createMedicalRecord = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((err) => err.msg),
    });
  }

  try {
    const payload = { ...req.body };

    if (req.user.role === "doctor") {
      const doctor = await doctorModel.findOne({ doctorID: req.user.id }).select("_id");
      if (!doctor) {
        return res.status(404).json({
          success: false,
          message: "Doctor profile not found",
        });
      }

      payload.doctorID = doctor._id;
    }

    const record = await medicalRecordModel.create(payload);
    return res.status(201).json({
      success: true,
      message: "Medical record created successfully",
      data: record,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Failed to create medical record",
      error: error.message,
    });
  }
};

const updateMedicalRecord = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((err) => err.msg),
    });
  }

  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid medical record ID",
    });
  }

  try {
    const { filters, error } = await resolveScopedFilters(req);
    if (error) {
      return res.status(error.status).json({
        success: false,
        message: error.message,
      });
    }

    const record = await medicalRecordModel.findOneAndUpdate(
      { _id: id, ...filters },
      req.body,
      { new: true, runValidators: true }
    );

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Medical record not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Medical record updated successfully",
      data: record,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Failed to update medical record",
      error: error.message,
    });
  }
};

const deleteMedicalRecord = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid medical record ID",
    });
  }

  try {
    const record = await medicalRecordModel.findByIdAndDelete(id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Medical record not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Medical record deleted successfully",
      data: record,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete medical record",
      error: error.message,
    });
  }
};

export {
  getMedicalRecords,
  getMedicalRecordById,
  createMedicalRecord,
  updateMedicalRecord,
  deleteMedicalRecord,
};