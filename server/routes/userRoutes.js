import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { cacheUserProfile } from "../middlewares/cacheMiddleware.js";
import { getUserInfo } from "../controllers/userController.js";

const router = express.Router();

router.get("/", verifyToken, cacheUserProfile, getUserInfo);

export default router;
