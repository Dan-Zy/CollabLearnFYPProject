import express from "express";
import createCommunity from "../controllers/communityControllers/createCommunity.js";
import { verifyToken } from "../middlewares/authorization.js";
import uploadCommunityBanner from './../config/communityMulter.js';
import getCommunities from './../controllers/communityControllers/getCommunities.js';
import getCommunity from "./../controllers/communityControllers/getCommunity.js"
import updateCommunity from "../controllers/communityControllers/updateCommunity.js";
import deleteCommunity from "../controllers/communityControllers/deleteCommunity.js";
import addMemberToCommunity from "../controllers/communityControllers/addMemberToCommunity.js";

const router = express.Router();

// CREATE COMMUNITY
router.post("/createCommunity", verifyToken, uploadCommunityBanner.single("image"), createCommunity);
 
//Add Member
router.put("/addMember/:communityId", verifyToken, addMemberToCommunity);

// UPDATE COMMUNITY DETAILS
router.put("/updateCommunity/:communityId", verifyToken, uploadCommunityBanner.single("image"), updateCommunity);

// DELETE COMMUNITY
router.delete("/deleteCommunity/:communityId", verifyToken, deleteCommunity);

// GET COMMUNITIES
router.get("/getCommunities", verifyToken, getCommunities);

// GET COMMUNITY
router.get("/getCommunity/:communityId", verifyToken, getCommunity);


export default router;
