import express from "express";
import { verifyBearerToken, verifyToken } from "../middlewares/authorization.js";
import { uploadPost } from "../controllers/postControllers/uploadPost.js";
import upload from "../config/commentMulter.js";
import uploadP from "../config/postMulter.js"
import { addComment } from "../controllers/postControllers/addComment.js";
import {upvotePost, upvoteComment} from "../controllers/postControllers/upvote.js";
import { devotePost, devoteComment } from "../controllers/postControllers/devote.js";
import sharePost from "../controllers/postControllers/sharePost.js";
import editPost from "../controllers/postControllers/editPost.js";
import deletePost from "../controllers/postControllers/deletePost.js";
import editComment from "../controllers/postControllers/editComment.js";
import deleteComment from "../controllers/postControllers/deleteComment.js";
import { getPosts } from "../controllers/postControllers/getPosts.js";
import getComments from "../controllers/postControllers/getComments.js";
import addCommentReply from "../controllers/postControllers/addCommentReply.js";
import getCommentReply from "../controllers/postControllers/getCommentReply.js";
import { removePostUpvote , removeCommentUpvote } from "../controllers/postControllers/removeUpvote.js";
import { removePostDevote, removeCommentDevote } from "../controllers/postControllers/removeDevote.js";

// Daniyal's first test commit
const router = express.Router();

// Upload Post
router.post("/uploadPost", verifyToken, uploadP.fields([
    { name: 'image', maxCount: 1 },
    { name: 'document', maxCount: 1 },
    { name: 'video', maxCount: 1 }
]), uploadPost);

// Edit Post
router.put("/editPost/:postId", verifyToken , uploadP.fields([
    { name: 'image', maxCount: 1 },
    { name: 'document', maxCount: 1 },
    { name: 'video', maxCount: 1 }]), editPost);

// Delete Post
router.delete("/deletePost/:postId", verifyToken, deletePost);

// Get Post
router.get("/getPosts", verifyBearerToken, getPosts);



// Add Comment
router.post("/addComment/:postId", verifyToken, upload.single("image"), addComment);

// Add reply to Comment
router.post("/addCommentReply/:commentId", verifyToken, upload.single("image"), addCommentReply);

// Edit Comment
router.put("/editComment/:commentId", verifyToken, upload.single("image"), editComment);

// Delete Comment
router.delete("/deleteComment/:commentId", verifyToken, deleteComment);

// Get Comments
router.get("/getComments/:postId", verifyToken, getComments);

// Get Comment's replies
router.get("/getCommentReplies/:commentId", verifyToken, getCommentReply);



// Upvote Post
router.post("/upvotePost/:postId", verifyToken, upvotePost);

// Remove Post's Upvote
router.put("/removePostUpvote/:postId", verifyToken, removePostUpvote);


// Upvote Comment
router.post("/upvoteComment/:commentId", verifyToken, upvoteComment);

// Remove Comment's Upvote
router.put("/removeCommentUpvote/:commentId", verifyToken, removeCommentUpvote);



// Devote Post
router.post("/devotePost/:postId", verifyToken, devotePost);

// Remove Post's Devote
router.put("/removePostDevote/:postId", verifyToken, removePostDevote);


// Devote Comment
router.post("/devoteComment/:commentId", verifyToken, devoteComment);

// Remove Comment's Devote
router.put("/removeCommentDevote/:commentId", verifyToken, removeCommentDevote);


// Share Post
router.post("/sharePost/:postId", verifyToken, sharePost);

export default router;