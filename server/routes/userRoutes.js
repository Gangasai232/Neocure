import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { getUserInfo } from "../controllers/userController.js";

const router = express.Router();

router.get("/", verifyToken, getUserInfo);

export default router;
