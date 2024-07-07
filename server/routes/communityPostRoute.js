import express from "express";
import uploadP from "../config/postMulter.js";
import { verifyToken } from "../middlewares/authorization.js";
import { uploadCommunityPost } from "../controllers/communityPostController/uploadCommunityPost.js";
import updateCommunityPost from "../controllers/communityPostController/updateCommunityPost.js";
import deleteCommunityPost from "../controllers/communityPostController/deleteCommunityPost.js";

const router = express.Router();

// Upload Post
router.post("/uploadCommunityPost/:communityId", verifyToken, uploadP.fields([
    { name: 'image', maxCount: 1 },
    { name: 'document', maxCount: 1 },
    { name: 'video', maxCount: 1 }
]), uploadCommunityPost);

// Update Post
router.put("/updateCommunityPost/:postId", verifyToken , uploadP.fields([
    { name: 'image', maxCount: 1 },
    { name: 'document', maxCount: 1 },
    { name: 'video', maxCount: 1 }]), updateCommunityPost);


// Delete Post
router.delete("/deleteCommunityPost/:postId", verifyToken, deleteCommunityPost);


export default router;