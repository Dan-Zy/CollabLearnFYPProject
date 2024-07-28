import Message from "../../models/messageModel.js";
import Chat from "../../models/chatModel.js";
import User from "../../models/userModel.js";

const sendMessage = async (req, res) => {
  try {
    const { content, chatId } = req.body;
    if (!content || !chatId) {
      console.log("Invalid data passed into request");
      return res.status(400).json({
        success: false,
        message: "Content and Chat ID is required"
      });
    }

    if(chatId.length != 24){
      return res.status(400).json({
        success: false,
        message: "Incorrect Chat ID Length (Means you are missing some hexadecimal character)"
      });
    }

    const chat = await Chat.findById(chatId);

    if(!chat){
      return res.status(400).json({
        success: false,
        message: "Invalid Chat ID"
      });
    }

    var newMessage = {
      sender: req.user._id,
      content: content,
      chat: chatId,
    };

    try {
      var message = await Message.create(newMessage);

      message = await message.populate("sender", "username profilePicture");
      message = await message.populate("chat");
      message = await User.populate(message, {
        path: "chat.users",
        select: "username profilePicture email",
      });

      await Chat.findByIdAndUpdate(req.body.chatId, {
        latestMessage: message,
      });

      res.json(message);
    } catch (error) {
      console.log(error);
    }
  } catch (error) {}
};

const allMessages = async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "username profilePicture email")
      .populate("chat");

    // To get Messages Content
    messages.forEach((message) => {
        console.log("Message Content: ", message.content);
    })   
      
    res.json(messages);
  } catch (error) {
    console.log(error);
  }
};

export { sendMessage, allMessages };
