import express from "express";
import { verifyToken } from "../middlewares/authorization.js";
import getAllNotifications from "../controllers/notificationControllers/getAllNotifications.js";

const router = express.Router();

router.get("/getAllNotifications", verifyToken, getAllNotifications);

export default router;