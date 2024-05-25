import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import upload from "../config/multer.js";
import { verifyToken } from "../middlewares/authorization.js";
import { uploadProfilePicture } from "../controllers/uploadPfp.js";

const router = express.Router();


// Regiter User
router.post("/register", registerUser);

// Login User
router.post("/login", loginUser);


// upload picture
router.patch("/upload/pfp", verifyToken , upload.single("image"), uploadProfilePicture)

export default router;