import express from "express";
import { body } from "express-validator";
import { verifyToken, adminOnly } from "../middlewares/authMiddleware.js";
import { createRateLimitMiddleware } from "../middlewares/rateLimitMiddleware.js";
import {
  addPatient,
  deletePatient,
  getAllPatients,
  getPatient,
  updatePatient,
} from "../controllers/patientController.js";

import {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import {
  addDoctor,
  getAllDoctors,
  getDoctor,
  updateDoctor,
  deleteDoctor,
} from "../controllers/doctorController.js";
import {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} from "../controllers/servicesController.js";
import { getAllTransactions } from "../controllers/paymentController.js";
import {
  createAppointment,
  getAllAppointments,
  getAppointment,
  updateAppointment,
} from "../controllers/appointmentController.js";

const router = express.Router();

// Create rate limit middleware for admin operations
const adminRateLimit = createRateLimitMiddleware({
  identifier: "user",
  envKey: "RATE_LIMIT_ADMIN",
});

const patientCreateValidation = [
  body("patientID")
    .isMongoId()
    .withMessage("patientID must be a valid user id")
    .notEmpty()
    .withMessage("patientID is required"),
  body("name")
    .isString()
    .withMessage("Name must be a string")
    .notEmpty()
    .withMessage("Name is required"),

  body("age")
    .isInt({ min: 1 })
    .withMessage("Age must be a positive integer")
    .notEmpty()
    .withMessage("Age is required"),

  body("gender")
    .isIn(["Male", "Female"])
    .withMessage("Gender must be 'Male' or 'Female'")
    .notEmpty()
    .withMessage("Gender is required"),

  body("phone")
    .isString()
    .withMessage("Phone must be a string of digits")
    .matches(/^\d+$/)
    .withMessage("Phone must contain only numbers")
    .isLength({ min: 10, max: 10 })
    .withMessage("Phone number must not exceed 10 digits")
    .notEmpty()
    .withMessage("Phone number is required"),

  body("description")
    .isString()
    .withMessage("Description must be a string")
    .notEmpty()
    .withMessage("Description is required"),
];

const patientUpdateValidation = [
  body("name")
    .isString()
    .withMessage("Name must be a string")
    .notEmpty()
    .withMessage("Name is required"),

  body("age")
    .isInt({ min: 1 })
    .withMessage("Age must be a positive integer")
    .notEmpty()
    .withMessage("Age is required"),

  body("gender")
    .isIn(["Male", "Female"])
    .withMessage("Gender must be 'Male' or 'Female'")
    .notEmpty()
    .withMessage("Gender is required"),

  body("phone")
    .isString()
    .withMessage("Phone must be a string of digits")
    .matches(/^\d+$/)
    .withMessage("Phone must contain only numbers")
    .isLength({ min: 10, max: 10 })
    .withMessage("Phone number must not exceed 10 digits")
    .notEmpty()
    .withMessage("Phone number is required"),

  body("description")
    .isString()
    .withMessage("Description must be a string")
    .notEmpty()
    .withMessage("Description is required"),
];

const userValidation = [
  body("name").optional().isString().withMessage("Name must be a string"),
  body("email").optional().isEmail().withMessage("Invalid email"),
];

const doctorCreateValidation = [
  body("doctorID")
    .isMongoId()
    .withMessage("doctorID must be a valid user id")
    .notEmpty()
    .withMessage("doctorID is required"),
  body("name")
    .isString()
    .withMessage("Name must be a string")
    .notEmpty()
    .withMessage("Name is required"),
  body("specialization")
    .isString()
    .withMessage("Specialization must be a string")
    .notEmpty()
    .withMessage("Specialization is required"),
  body("phone")
    .isString()
    .withMessage("Phone must be a string of digits")
    .matches(/^\d+$/)
    .withMessage("Phone must contain only numbers")
    .isLength({ min: 10, max: 10 })
    .withMessage("Phone number must not exceed 10 digits")
    .notEmpty()
    .withMessage("Phone number is required"),
  body("gender")
    .isString()
    .isIn(["Male", "Female"])
    .withMessage("Gender must be either Male or Female"),
  body("age")
    .isInt({ min: 1, max: 120 })
    .withMessage("Age must be a positive integer"),
  body("status")
    .isString()
    .isIn(["Active", "Away"])
    .withMessage("status should be Active or Away"),
];

const doctorUpdateValidation = [
  body("name")
    .isString()
    .withMessage("Name must be a string")
    .notEmpty()
    .withMessage("Name is required"),
  body("specialization")
    .isString()
    .withMessage("Specialization must be a string")
    .notEmpty()
    .withMessage("Specialization is required"),
  body("phone")
    .isString()
    .withMessage("Phone must be a string of digits")
    .matches(/^\d+$/)
    .withMessage("Phone must contain only numbers")
    .isLength({ min: 10, max: 10 })
    .withMessage("Phone number must not exceed 10 digits")
    .notEmpty()
    .withMessage("Phone number is required"),
  body("gender")
    .isString()
    .isIn(["Male", "Female"])
    .withMessage("Gender must be either Male or Female"),
  body("age")
    .isInt({ min: 1, max: 120 })
    .withMessage("Age must be a positive integer"),
  body("status")
    .isString()
    .isIn(["Active", "Away"])
    .withMessage("status should be Active or Away"),
];

//Verify Admin
router.get(
  "/verify",
  verifyToken,
  adminOnly,
  adminRateLimit,
  async (req, res) => {
    return res.status(200).json({
      success: true,
      message: "Verified Admin",
    });
  }
);

//Patient Routes
router.get("/patients", verifyToken, adminOnly, adminRateLimit, getAllPatients);

router.get("/patients/:id", verifyToken, adminOnly, adminRateLimit, getPatient);

router.post(
  "/patients",
  verifyToken,
  adminOnly,
  adminRateLimit,
  patientCreateValidation,
  addPatient
);

router.put(
  "/patients/:id",
  verifyToken,
  adminOnly,
  adminRateLimit,
  patientUpdateValidation,
  updatePatient
);

router.delete(
  "/patients/:id",
  verifyToken,
  adminOnly,
  adminRateLimit,
  deletePatient
);

//User Routes
router.get("/users", verifyToken, adminOnly, adminRateLimit, getAllUsers);

router.get("/users/:id", verifyToken, adminOnly, adminRateLimit, getUser);

router.put(
  "/users/:id",
  verifyToken,
  adminOnly,
  adminRateLimit,
  userValidation,
  updateUser
);

router.delete("/users/:id", verifyToken, adminOnly, adminRateLimit, deleteUser);

//Doctor Routes
router.get("/doctors", verifyToken, adminOnly, adminRateLimit, getAllDoctors);

router.get("/doctors/:id", verifyToken, adminOnly, adminRateLimit, getDoctor);

router.post(
  "/doctors",
  verifyToken,
  adminOnly,
  adminRateLimit,
  doctorCreateValidation,
  addDoctor
);

router.put(
  "/doctors/:id",
  verifyToken,
  adminOnly,
  adminRateLimit,
  doctorUpdateValidation,
  updateDoctor
);

router.delete(
  "/doctors/:id",
  verifyToken,
  adminOnly,
  adminRateLimit,
  deleteDoctor
);

//Services Routes
router.get("/services", verifyToken, adminOnly, adminRateLimit, getAllServices);

router.get(
  "/services/:id",
  verifyToken,
  adminOnly,
  adminRateLimit,
  getServiceById
);

router.post("/services", verifyToken, adminOnly, adminRateLimit, createService);

router.put("/services", verifyToken, adminOnly, adminRateLimit, updateService);

router.delete(
  "/services",
  verifyToken,
  adminOnly,
  adminRateLimit,
  deleteService
);

//Transaction Routes
router.get(
  "/payment",
  verifyToken,
  adminOnly,
  adminRateLimit,
  getAllTransactions
);

//Appointment Routes
router.get(
  "/appointments",
  verifyToken,
  adminOnly,
  adminRateLimit,
  getAllAppointments
);

router.get(
  "/appointments/:id",
  verifyToken,
  adminOnly,
  adminRateLimit,
  getAppointment
);

router.post(
  "/appointments",
  verifyToken,
  adminOnly,
  adminRateLimit,
  createAppointment
);

router.put(
  "/appointments/:id",
  verifyToken,
  adminOnly,
  adminRateLimit,
  updateAppointment
);

export default router;
