import express from "express";
import createCommunity from "../controllers/communityControllers/createCommunity.js";
import { verifyToken } from "../middlewares/authorization.js";
import uploadCommunityBanner from './../config/communityMulter.js';
import getCommunities from './../controllers/communityControllers/getCommunities.js';
import getCommunity from "./../controllers/communityControllers/getCommunity.js"

const router = express.Router();

// CREATE COMMUNITY
router.post("/createCommunity", verifyToken, uploadCommunityBanner.single("image"), createCommunity);

// GET COMMUNITIES
router.get("/getCommunities", verifyToken, getCommunities);

// GET COMMUNITY
router.get("/getCommunity/:communityId", verifyToken, getCommunity);


export default router;
