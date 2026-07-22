import express from "express";
import { body } from "express-validator";
import { verifyToken, adminOnly } from "../middlewares/authMiddleware.js";
import { cacheUserRole } from "../middlewares/cacheMiddleware.js";
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
  cancelAppointment,
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
  cacheUserRole,
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
router.get("/patients", verifyToken, cacheUserRole, adminOnly, adminRateLimit, getAllPatients);

router.get("/patients/:id", verifyToken, cacheUserRole, adminOnly, adminRateLimit, getPatient);

router.post(
  "/patients",
  verifyToken,
  cacheUserRole,
  adminOnly,
  adminRateLimit,
  patientCreateValidation,
  addPatient
);

router.put(
  "/patients/:id",
  verifyToken,
  cacheUserRole,
  adminOnly,
  adminRateLimit,
  patientUpdateValidation,
  updatePatient
);

router.delete(
  "/patients/:id",
  verifyToken,
  cacheUserRole,
  adminOnly,
  adminRateLimit,
  deletePatient
);

//User Routes
router.get("/users", verifyToken, cacheUserRole, adminOnly, adminRateLimit, getAllUsers);

router.get("/users/:id", verifyToken, cacheUserRole, adminOnly, adminRateLimit, getUser);

router.put(
  "/users/:id",
  verifyToken,
  cacheUserRole,
  adminOnly,
  adminRateLimit,
  userValidation,
  updateUser
);

router.delete("/users/:id", verifyToken, cacheUserRole, adminOnly, adminRateLimit, deleteUser);

//Doctor Routes
router.get("/doctors", verifyToken, cacheUserRole, adminOnly, adminRateLimit, getAllDoctors);

router.get("/doctors/:id", verifyToken, cacheUserRole, adminOnly, adminRateLimit, getDoctor);

router.post(
  "/doctors",
  verifyToken,
  cacheUserRole,
  adminOnly,
  adminRateLimit,
  doctorCreateValidation,
  addDoctor
);

router.put(
  "/doctors/:id",
  verifyToken,
  cacheUserRole,
  adminOnly,
  adminRateLimit,
  doctorUpdateValidation,
  updateDoctor
);

router.delete(
  "/doctors/:id",
  verifyToken,
  cacheUserRole,
  adminOnly,
  adminRateLimit,
  deleteDoctor
);

//Services Routes
router.get("/services", verifyToken, cacheUserRole, adminOnly, adminRateLimit, getAllServices);

router.get(
  "/services/:id",
  verifyToken,
  cacheUserRole,
  adminOnly,
  adminRateLimit,
  getServiceById
);

router.post("/services", verifyToken, cacheUserRole, adminOnly, adminRateLimit, createService);

router.put("/services/:id", verifyToken, cacheUserRole, adminOnly, adminRateLimit, updateService);

router.delete(
  "/services/:id",
  verifyToken,
  cacheUserRole,
  adminOnly,
  adminRateLimit,
  deleteService
);

//Transaction Routes
router.get(
  "/payment",
  verifyToken,
  cacheUserRole,
  adminOnly,
  adminRateLimit,
  getAllTransactions
);

//Appointment Routes
router.get(
  "/appointments",
  verifyToken,
  cacheUserRole,
  adminOnly,
  adminRateLimit,
  getAllAppointments
);

router.get(
  "/appointments/:id",
  verifyToken,
  cacheUserRole,
  adminOnly,
  adminRateLimit,
  getAppointment
);

router.post(
  "/appointments",
  verifyToken,
  cacheUserRole,
  adminOnly,
  adminRateLimit,
  createAppointment
);

router.put(
  "/appointments/:id",
  verifyToken,
  cacheUserRole,
  adminOnly,
  adminRateLimit,
  updateAppointment
);

router.post(
  "/appointments/:id/cancel",
  verifyToken,
  cacheUserRole,
  adminOnly,
  adminRateLimit,
  cancelAppointment
);

export default router;
