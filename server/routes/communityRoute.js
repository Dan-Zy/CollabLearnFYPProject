import express from "express";
import createCommunity from "../controllers/communityControllers/createCommunity.js";
import { verifyToken } from "../middlewares/authorization.js";
import uploadCommunityBanner from './../config/communityMulter.js';
import getCommunities from './../controllers/communityControllers/getCommunities.js';
import getCommunity from "./../controllers/communityControllers/getCommunity.js"
import updateCommunity from "../controllers/communityControllers/updateCommunity.js";
import deleteCommunity from "../controllers/communityControllers/deleteCommunity.js";
import addMemberToCommunity from "../controllers/communityControllers/addMemberToCommunity.js";
import getCommunityMembers from "../controllers/communityControllers/getCommunityMembers.js";
import leaveCommunity from "../controllers/communityControllers/leaveCommunity.js";
import removeMemberFromCommunity from "../controllers/communityControllers/removeMember.js";

const router = express.Router();

// CREATE COMMUNITY
router.post("/createCommunity", verifyToken, uploadCommunityBanner.single("image"), createCommunity);
 
//Add Member
router.put("/addMember/:communityId", verifyToken, addMemberToCommunity);

// UPDATE COMMUNITY DETAILS
router.put("/updateCommunity/:communityId", verifyToken, uploadCommunityBanner.single("image"), updateCommunity);

// DELETE COMMUNITY
router.delete("/deleteCommunity/:communityId", verifyToken, deleteCommunity);

// GET ALL COMMUNITIES
router.get("/getCommunities", verifyToken, getCommunities);

// GET A SPECIFIC COMMUNITY BY COMMUNITY ID
router.get("/getCommunity/:communityId", verifyToken, getCommunity);

// GET COMMUNITY MEMBERS
router.get("/getCommunityMembers/:communityId", verifyToken, getCommunityMembers);

// LEAVE COMMUNITY
router.put("/leaveCommunity/:communityId", verifyToken, leaveCommunity);

// REMOVE MEMBER FROM COMMUNITY
router.put("/removeMemberFromCommunity/:communityId/:memberId", verifyToken, removeMemberFromCommunity);


export default router;
