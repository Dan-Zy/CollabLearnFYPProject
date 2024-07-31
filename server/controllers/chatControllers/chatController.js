import Chat from "../../models/chatModel.js";
import User from "../../models/userModel.js";

const accessChat = async (req, res) => {
  try {
    const { userId } = req.body;

    // Check if userId is provided
    if (!userId) {
      console.log("UserId param not sent with request");
      return res.status(400).send({
        status: "error",
        message: "UserId parameter is required.",
      });
    }

    // Check for existing chat between the users
    let isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage");

    // Populate latestMessage sender details
    isChat = await User.populate(isChat, {
      path: "latestMessage.sender",
      select: "username profilePicture email",
    });

    // If an existing chat is found, return it
    if (isChat.length > 0) {
      return res.status(200).send({
        status: "success",
        message: "Chat retrieved successfully.",
        chat: isChat[0],
      });
    } else {
      // Create a new chat if none exists
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

      // Return the newly created chat
      return res.status(201).send({
        status: "success",
        message: "New chat created successfully.",
        chat: FullChat,
      });
    }
  } catch (error) {
    // Handle unexpected errors
    console.log(error);
    return res.status(500).send({
      status: "error",
      message: "Internal Server Error. Please try again later.",
    });
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

  if (!req.body.name) {
    return res.status(400).json({ 
      success: false,
      message: "Please Give name of the Group" 
    });
  }

  var users = [];

  if(req.body.userId){
    console.log("Before Parsing: ", req.body.userId);

    users = JSON.parse(req.body.userId);

    console.log("After Parsing: ", users);
  }  

  // if (users.length < 2) {
  //   return res
  //     .status(400)
  //     .send("More than 2 users are required to form a group chat");
  // }

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

    res.status(200).json({
      success: true,
      message: "Group Chat has been Created Successfully",
      ID: fullGroupChat._id,
      GroupChat: fullGroupChat
    });
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
