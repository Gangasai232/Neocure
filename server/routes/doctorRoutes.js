import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { cacheUserRole } from "../middlewares/cacheMiddleware.js";
import { getAllDoctors, getDoctor } from "../controllers/doctorController.js";

const router = express.Router();

router.get("/", verifyToken, cacheUserRole, getAllDoctors);

router.get("/:id", verifyToken, cacheUserRole, getDoctor);

export default router;
