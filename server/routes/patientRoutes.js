import express from "express";
import {
  upsertSelfPatient,
  getSelfPatient,
} from "../controllers/patientController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { body } from "express-validator";
import { getAllDoctors } from "../controllers/doctorController.js";

const router = express.Router();

const validation = [
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
    .isNumeric()
    .withMessage("Phone must be a number")
    .notEmpty()
    .withMessage("Phone number is required"),

  body("description")
    .isString()
    .withMessage("Description must be a string")
    .notEmpty()
    .withMessage("Description is required"),
];

//User Routes
router.post("/", verifyToken, validation, upsertSelfPatient);

router.get("/", verifyToken, getSelfPatient);

export default router;
