import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { getAllDoctors, getDoctor } from "../controllers/doctorController.js";

const router = express.Router();

router.get("/", verifyToken, getAllDoctors);

router.get("/:id", verifyToken, getDoctor);

export default router;
