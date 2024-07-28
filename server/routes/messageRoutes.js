import express from "express";
import { sendMessage, allMessages } from "../controllers/chatControllers/messageController.js";
import { verifyToken } from './../middlewares/authorization.js';

const router = express.Router();

// Send a Message
router.post("/send-message", verifyToken, sendMessage);

// Get All Messages in Chat
router.get("/get-messages/:chatId", verifyToken, allMessages);

export default router;
