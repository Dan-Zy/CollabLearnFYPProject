// chatName
// isGroupChat
// users
// latestMessage
// groupAdmin

import mongoose from 'mongoose';
import User from '../models/userModel.js'; // Ensure you import your user model correctly

const chatModel = new mongoose.Schema(
  {
    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Make sure this is the correct reference
      },
    ],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    groupAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Make sure this is the correct reference
    },
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", chatModel);

export default Chat;

