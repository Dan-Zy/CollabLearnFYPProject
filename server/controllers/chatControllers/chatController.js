import Chat from "../../models/chatModel.js";
import User from "../../models/userModel.js";

const accessChat = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      console.log("UserId param not sent with request");
      return res.status(400).send("UserId param not sent with request");
    }

    let isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage");

    isChat = await User.populate(isChat, {
      path: "latestMessage.sender",
      select: "username profilePicture email",
    });

    if (isChat.length > 0) {
      return res.status(200).send(isChat[0]);
    } else {
      const chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [req.user._id, userId],
      };

      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );

      return res.status(200).send(FullChat);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};

const fetchChats = async (req, res) => {
  try {
    let result = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });
    result = await User.populate(result, {
      path: "latestMessage.sender",
      select: "username profilePicture email",
    });

    res.status(200).json({
      // users: result.length,
      chats: result
    });
  } catch (error) {
    console.log(error);
  }
};

const createGroupChat = async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please fill all the fields" });
  }

  console.log("Before Parsing: ", req.body.users);

  var users = JSON.parse(req.body.users);

  console.log("After Parsing: ", users);

  if (users.length < 2) {
    return res
      .status(400)
      .send("More than 2 users are required to form a group chat");
  }

  users.push(req.user);
  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    console.log(error);
  }
};

const renameGroup = async (req, res) => {
  const { chatId, chatName } = req.body;

  if(chatId.length != 24){
    return res.status(400).json({
      success: false,
      message: "Incorrect Chat ID Length (Means you are missing some hexadecimal character)"
    });
  }

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    return res.status(404).send("Chat Not Found");
  } else {
    res.json(updatedChat);
  }
};

const addToGroup = async (req, res) => {
  try {
    const { chatId, userId } = req.body;

    if(chatId.length != 24){
      return res.status(400).json({
        success: false,
        message: "Incorrect Chat ID Length (Means you are missing some hexadecimal character)"
      });
    }

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({
        success: false,  
        message: "Group Chat Not Found"
      });
    }

    // Check if the user is already in the users array
    if (chat.users.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: "User already added to the group",
      });
    }

    const added = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { users: userId },
      },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
  
    res.status(201).json({
      success: true,
      message: "User added to group successfully",  
      added
    });
    
  } catch (error) {
    console.log(error);
  }
};

const removeFromGroup = async (req, res) => {
  try {
    const { chatId, userId } = req.body;

    if(chatId.length != 24){
      return res.status(400).json({
        success: false,
        message: "Incorrect Chat ID Length (Means you are missing some hexadecimal character)"
      });
    }

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({
        success: false,  
        message: "Group Chat Not Found"
      });
    }

    // Check if the user is already in the users array
    if (!chat.users.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: "User not found in this Group Chat",
      });
    }

    const removed = await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: { users: userId },
      },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    
    res.status(200).json({
      success: true,
      message: "User removed successfully from the group",  
      removed
    });

  } catch (error) {
    console.log(error);
  }
};

export {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
};
