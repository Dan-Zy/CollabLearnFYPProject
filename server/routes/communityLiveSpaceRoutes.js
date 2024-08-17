import express from "express";
import { verifyToken } from "../middlewares/authorization.js";
import createEventCommunity from "../controllers/communityLiveSpaceControllers/createEventCommunity.js";
import { getCommunityLiveSpaces } from "../controllers/communityLiveSpaceControllers/getCommunityEvents.js";
import joinCommunityEvent from "../controllers/communityLiveSpaceControllers/joinCommunityEvent.js";


const router = express.Router();

router.post("/createEventCommunity/:communityId", verifyToken, createEventCommunity);

router.get("/getCommunityEvents/:communityId", verifyToken, getCommunityLiveSpaces);

router.put("/joinCommunityEvent/:eventId", verifyToken, joinCommunityEvent);

export default router;