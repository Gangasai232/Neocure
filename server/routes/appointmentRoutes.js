import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { cacheUserRole } from "../middlewares/cacheMiddleware.js";
import {
  getAppointment,
  createAppointment,
  updateAppointment,
} from "../controllers/appointmentController.js";
import { body } from "express-validator";

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

const validation = [
  body("doctorID").isMongoId().withMessage("Invalid doctor ID"),
  body("date")
    .custom((value) => {
      const selectedDate = normalizeToUtcDateOnly(value);
      const now = new Date();
      const today = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
      );
      if (!selectedDate) {
        throw new Error("Invalid appointment date");
      }
      if (selectedDate < today) {
        throw new Error("Date cannot be in the past");
      }
      return true;
    }),
  body("reason")
    .isString()
    .withMessage("Reason must be a string")
    .notEmpty()
    .withMessage("Reason is required")
    .isLength({ max: 200 })
    .withMessage("Reason too long"),
  body("timeSlot")
    .isString()
    .isIn(["Morning", "Afternoon", "Evening"])
    .withMessage("Timeslot provided is invalid"),
];

const updateValidation = [
  body("doctorID").optional().isMongoId().withMessage("Invalid doctor ID"),
  body("date")
    .optional()
    .custom((value) => {
      if (!value) {
        return true;
      }

      const selectedDate = normalizeToUtcDateOnly(value);
      const now = new Date();
      const today = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
      );
      if (!selectedDate) {
        throw new Error("Invalid appointment date");
      }
      if (selectedDate < today) {
        throw new Error("Date cannot be in the past");
      }
      return true;
    }),
  body("reason")
    .optional()
    .isString()
    .withMessage("Reason must be a string")
    .isLength({ max: 200 })
    .withMessage("Reason too long"),
  body("timeSlot")
    .optional()
    .isString()
    .isIn(["Morning", "Afternoon", "Evening"])
    .withMessage("Timeslot provided is invalid"),
  body("status")
    .optional()
    .isIn(["Pending", "Completed", "Rejected", "Cancelled"])
    .withMessage("Invalid appointment status"),
];

const router = express.Router();

router.get("/", verifyToken, cacheUserRole, getAppointment);

router.post("/", verifyToken, cacheUserRole, validation, createAppointment);

router.put("/:id", verifyToken, cacheUserRole, updateValidation, updateAppointment);

export default router;
