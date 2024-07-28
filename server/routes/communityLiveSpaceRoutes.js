import express from "express";
import { verifyToken } from "../middlewares/authorization.js";
import createEventCommunity from "../controllers/communityLiveSpaceControllers/createEventCommunity.js";


const router = express.Router();

router.post("/createEventCommunity/:communityId", verifyToken, createEventCommunity);


export default router;