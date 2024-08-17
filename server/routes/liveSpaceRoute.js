import express from "express";
import { verifyToken } from "../middlewares/authorization.js";
import createEvent from '../controllers/LiveSpaceControllers/createEvent.js';
import uploadBanner from "../config/eventMulter.js";
import getEvents from "../controllers/LiveSpaceControllers/getEvents.js";
import joinEvent from "../controllers/LiveSpaceControllers/joinEvent.js";

const router = express.Router();

// Create Event
router.post("/createEvent", verifyToken, uploadBanner.single("image"), createEvent);

// Get Events
router.get("/getEvents", verifyToken, getEvents);

router.put("/joinEvent/:eventId", verifyToken, joinEvent);

export default router;