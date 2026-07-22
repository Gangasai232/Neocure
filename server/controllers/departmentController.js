import mongoose from "mongoose";
import { validationResult } from "express-validator";
import departmentModel from "../models/departmentModel.js";

const getDepartments = async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
    const search = req.query.search?.trim();

    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { code: { $regex: search, $options: "i" } },
      ];
    }

    const [departments, total] = await Promise.all([
      departmentModel
        .find(filter)
        .populate("headDoctor", "name specialization department")
        .sort({ name: 1 })
        .skip((page - 1) * limit)
        .limit(limit),
      departmentModel.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      message: "Departments retrieved successfully",
      data: departments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch departments",
      error: error.message,
    });
  }
};

const getDepartmentById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid department ID",
    });
  }

  try {
    const department = await departmentModel
      .findById(id)
      .populate("headDoctor", "name specialization department");

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Department retrieved successfully",
      data: department,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch department",
      error: error.message,
    });
  }
};

const createDepartment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((err) => err.msg),
    });
  }

  try {
    const department = await departmentModel.create(req.body);
    return res.status(201).json({
      success: true,
      message: "Department created successfully",
      data: department,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Failed to create department",
      error: error.message,
    });
  }
};

const updateDepartment = async (req, res) => {
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
      message: "Invalid department ID",
    });
  }

  try {
    const department = await departmentModel.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Department updated successfully",
      data: department,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Failed to update department",
      error: error.message,
    });
  }
};

const deleteDepartment = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid department ID",
    });
  }

  try {
    const department = await departmentModel.findByIdAndDelete(id);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Department deleted successfully",
      data: department,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete department",
      error: error.message,
    });
  }
};

export {
  getDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
};