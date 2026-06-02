import mongoose from "mongoose";
import servicesModel from "../models/servicesModel.js";

// GET all services
export const getAllServices = async (req, res) => {
  try {
    const services = await servicesModel.find();
    res.status(200).json({
      success: true,
      message: "All services retrieved",
      data: services,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch services",
      error: error.message,
    });
  }
};

// GET a single service by ID
export const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid service ID",
      });
    }

    const service = await servicesModel.findById(id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Service retrieved",
      data: service,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch service",
      error: error.message,
    });
  }
};

// CREATE a new service
export const createService = async (req, res) => {
  try {
    const newService = new servicesModel(req.body);
    const savedService = await newService.save();
    res.status(201).json({
      success: true,
      message: "Service created successfully",
      data: savedService,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to create service",
      error: error.message,
    });
  }
};

// UPDATE a service by ID
export const updateService = async (req, res) => {
  try {
    const updatedService = await servicesModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedService) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Service updated successfully",
      data: updatedService,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to update service",
      error: error.message,
    });
  }
};

// DELETE a service by ID
export const deleteService = async (req, res) => {
  try {
    const deletedService = await servicesModel.findByIdAndDelete(req.params.id);
    if (!deletedService) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Service deleted successfully",
      data: deletedService,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete service",
      error: error.message,
    });
  }
};
