import express from "express";
import { body } from "express-validator";
import {
  verifyToken,
  authorizeRoles,
  adminOnly,
} from "../middlewares/authMiddleware.js";
import { cacheUserRole } from "../middlewares/cacheMiddleware.js";
import {
  getMedicalRecords,
  getMedicalRecordById,
  createMedicalRecord,
  updateMedicalRecord,
  deleteMedicalRecord,
} from "../controllers/medicalRecordController.js";

const router = express.Router();

const medicalRecordValidation = [
  body("patientID")
    .optional()
    .isMongoId()
    .withMessage("patientID must be a valid patient id"),
  body("doctorID")
    .optional()
    .isMongoId()
    .withMessage("doctorID must be a valid doctor id"),
  body("diagnosis")
    .optional()
    .isString()
    .withMessage("Diagnosis must be a string"),
  body("treatmentPlan")
    .optional()
    .isString()
    .withMessage("Treatment plan must be a string"),
  body("notes").optional().isString().withMessage("Notes must be a string"),
  body("visitDate")
    .optional()
    .isISO8601()
    .withMessage("visitDate must be a valid date"),
];

router.get("/", verifyToken, cacheUserRole, authorizeRoles("admin", "doctor", "patient"), getMedicalRecords);
router.get("/:id", verifyToken, cacheUserRole, authorizeRoles("admin", "doctor", "patient"), getMedicalRecordById);
router.post(
  "/",
  verifyToken,
  cacheUserRole,
  authorizeRoles("admin", "doctor"),
  [
    body("patientID").isMongoId().withMessage("patientID must be a valid patient id"),
    body("diagnosis").trim().notEmpty().withMessage("Diagnosis is required"),
    ...medicalRecordValidation,
  ],
  createMedicalRecord
);
router.put("/:id", verifyToken, cacheUserRole, authorizeRoles("admin", "doctor"), medicalRecordValidation, updateMedicalRecord);
router.delete("/:id", verifyToken, cacheUserRole, adminOnly, deleteMedicalRecord);

export default router;