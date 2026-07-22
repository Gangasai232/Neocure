import express from "express";
import { body } from "express-validator";
import { verifyToken, adminOnly } from "../middlewares/authMiddleware.js";
import { cacheUserRole } from "../middlewares/cacheMiddleware.js";
import {
  getDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "../controllers/departmentController.js";

const router = express.Router();

const departmentValidation = [
  body("name").trim().notEmpty().withMessage("Department name is required"),
  body("code").optional().isString().withMessage("Code must be a string"),
  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),
  body("headDoctor")
    .optional({ nullable: true, checkFalsy: true })
    .isMongoId()
    .withMessage("headDoctor must be a valid doctor id"),
  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be boolean"),
];

router.get("/", verifyToken, cacheUserRole, getDepartments);
router.get("/:id", verifyToken, cacheUserRole, getDepartmentById);
router.post("/", verifyToken, cacheUserRole, adminOnly, departmentValidation, createDepartment);
router.put("/:id", verifyToken, cacheUserRole, adminOnly, departmentValidation, updateDepartment);
router.delete("/:id", verifyToken, cacheUserRole, adminOnly, deleteDepartment);

export default router;