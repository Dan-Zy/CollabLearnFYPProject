import mongoose from 'mongoose';
import User from '../models/userModel.js'; // Ensure you import your user model correctly
import Chat from '../models/chatModel.js'; // Ensure you import the chat model correctly

const messageModel = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: String, trim: true },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" }
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model('Message', messageModel);

export default Message;
