import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import {
  getAllServices,
  getServiceById,
} from "../controllers/servicesController.js";

const router = express.Router();

router.get("/", verifyToken, getAllServices);

router.get("/:id", verifyToken, getServiceById);

export default router;
