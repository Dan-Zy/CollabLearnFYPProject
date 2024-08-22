import express from "express";
import { verifyToken } from "../middlewares/authorization.js";
import createEvent from '../controllers/LiveSpaceControllers/createEvent.js';
import uploadBanner from "../config/eventMulter.js";
import getEvents from "../controllers/LiveSpaceControllers/getEvents.js";
import joinEvent from "../controllers/LiveSpaceControllers/joinEvent.js";
import getNumberOfParticipants from "../controllers/LiveSpaceControllers/getNumberofParticipants.js";

const router = express.Router();

// Create Event
router.post("/createEvent", verifyToken, uploadBanner.single("image"), createEvent);

// Get Events
router.get("/getEvents", verifyToken, getEvents);

router.put("/joinEvent/:eventId", verifyToken, joinEvent);

router.get("/getNumberOfParticipants/:eventId", verifyToken, getNumberOfParticipants);

export default router;