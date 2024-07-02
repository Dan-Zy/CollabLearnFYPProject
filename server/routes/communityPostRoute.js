import express from "express";
import uploadP from "../config/postMulter.js";
import { verifyToken } from "../middlewares/authorization.js";
import { uploadCommunityPost } from "../controllers/communityPostController/uploadCommunityPost.js";

const router = express.Router();

// Upload Post
router.post("/uploadPost/:communityId", verifyToken, uploadP.fields([
    { name: 'image', maxCount: 1 },
    { name: 'document', maxCount: 1 },
    { name: 'video', maxCount: 1 }
]), uploadCommunityPost);


export default router;