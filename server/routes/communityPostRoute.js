import express from "express";
import upload from "../config/commentMulter.js";
import uploadP from "../config/postMulter.js";
import { verifyToken } from "../middlewares/authorization.js";
import { uploadCommunityPost } from "../controllers/communityPostController/uploadCommunityPost.js";
import updateCommunityPost from "../controllers/communityPostController/updateCommunityPost.js";
import deleteCommunityPost from "../controllers/communityPostController/deleteCommunityPost.js";
import getCommunityPosts from "../controllers/communityPostController/getCommunityPosts.js";
import { addComPostComment } from "../controllers/communityPostController/addComPostComment.js";
import addCommentReply from "../controllers/postControllers/addCommentReply.js";
import editComment from "../controllers/postControllers/editComment.js";
import deleteComment from "../controllers/postControllers/deleteComment.js";
import getComments from "../controllers/postControllers/getComments.js";
import getComPostComments from "../controllers/communityPostController/getComPostComments.js";
import getCommentReply from "../controllers/postControllers/getCommentReply.js";

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

// Get all Posts of as specific community by giving community id
router.get("/getCommunityPosts/:communityId", verifyToken, getCommunityPosts);



// Add comment on a community posts
router.post("/addComment/:postId", verifyToken, upload.single("image"), addComPostComment);

// Add comment reply on a communtity post's comment
router.post("/addCommentReply/:commentId", verifyToken, upload.single("image"), addCommentReply);

// Edit Comment using comment ID
router.put("/editComment/:commentId", verifyToken, upload.single("image"), editComment);

// Delete Comment using comment ID
router.delete("/deleteComment/:commentId", verifyToken, deleteComment);

// Get Comments
router.get("/getComments/:postId", verifyToken, getComPostComments);

// Get Comment's Reply
router.get("/getCommentReplies/:commentId", verifyToken, getCommentReply);


export default router;