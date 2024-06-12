import express from "express";
import { verifyToken } from "../middlewares/authorization.js";
import createEvent from '../controllers/LiveSpaceControllers/createEvent.js';
import uploadBanner from "../config/eventMulter.js";

const router = express.Router();

router.post("/createEvent", verifyToken, uploadBanner.single("image"), createEvent);

export default router;