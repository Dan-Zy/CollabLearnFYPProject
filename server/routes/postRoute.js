import express from "express";
import { verifyToken } from "../middlewares/authorization.js";
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