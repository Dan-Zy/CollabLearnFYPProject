import express from "express";
const router = express.Router();
import { verifyToken } from "../middlewares/authorization.js";
import {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
} from "../controllers/chatControllers/chatController.js";

// Access or Start a Chat
router.post("/access-chat", verifyToken, accessChat);

// Fetch User's Chats
router.get("/fetch-chats", verifyToken, fetchChats);

// Create a Group Chat
router.post("/create-group-chat", verifyToken, createGroupChat);

// Rename a Group Chat
router.put("/rename-group", verifyToken, renameGroup);

// Add User to Group Chat
router.put("/add-to-group", verifyToken, addToGroup);

// Remove User from Group Chat
router.put("/remove-from-group", verifyToken, removeFromGroup);

export default router;
