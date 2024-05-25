import express from "express";
import { verifyToken } from "../middlewares/authorization.js";
import { uploadPost } from "../controllers/uploadPost.js";
import upload from "../config/commentMulter.js";
import uploadP from "../config/postMulter.js"
import { addComment } from "../controllers/addComment.js";
import {upvotePost, upvoteComment} from "../controllers/upvote.js";
import { devotePost, devoteComment } from "../controllers/devote.js";
import sharePost from "../controllers/sharePost.js";
import editPost from "../controllers/editPost.js";
import deletePost from "../controllers/deletePost.js";
import editComment from "../controllers/editComment.js";
import deleteComment from "../controllers/deleteComment.js";
import { getPosts } from "../controllers/getPosts.js";

const router = express.Router();

// Upload Post
router.post("/uploadPost", verifyToken, uploadP.fields([
    { name: 'image', maxCount: 1 },
    { name: 'document', maxCount: 1 },
    { name: 'video', maxCount: 1 }
]), uploadPost);

// Edit Post with hassan
router.put("/editPost/:postId", verifyToken , uploadP.fields([
    { name: 'image', maxCount: 1 },
    { name: 'document', maxCount: 1 },
    { name: 'video', maxCount: 1 }]), editPost);

// Delete Post
router.delete("/deletePost/:postId", verifyToken, deletePost);

// Get Post
router.get("/getPosts", getPosts);



// Add Comment
router.post("/addComment/:postId", verifyToken, upload.single("image"), addComment);

// Edit Comment
router.put("/editComment/:commentId", verifyToken, upload.single("image"), editComment);

// Delete Comment
router.delete("/deleteComment/:commentId", verifyToken, deleteComment)


// Upvote Post
router.post("/upvotePost/:postId", verifyToken, upvotePost);

// Upvote Comment
router.post("/upvoteComment/:commentId", verifyToken, upvoteComment);


// Devote Post
router.post("/devotePost/:postId", verifyToken, devotePost);

// Devote Comment
router.post("/devoteComment/:commentId", verifyToken, devoteComment);

// Share Post
router.post("/sharePost/:postId", verifyToken, sharePost);

export default router;