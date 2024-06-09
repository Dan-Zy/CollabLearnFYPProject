import express from "express";
import { verifyToken } from "../middlewares/authorization.js";
import createEvent from '../controllers/LiveSpaceControllers/createEvent.js';

const router = express.Router();

router.post("/createEvent", verifyToken, createEvent);

export default router;