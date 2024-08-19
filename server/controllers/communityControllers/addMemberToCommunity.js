import Community from "../../models/communityModel.js";
import Chat from "../../models/chatModel.js";
import User from "../../models/userModel.js";
import Notification from "../../models/notificationModel.js";

const addMemberToCommunity = async (req, res) => {
  try {
    const { communityId } = req.params;
    const userId = req.userId; 
    console.log('User ID:', userId);

    const community = await Community.findById(communityId);
    const discussionForum = await Chat.findOne({ chatName: communityId });

    console.log("COMMUNITY: ", community);
    console.log("DISCUSSION FORUM: ", discussionForum);

    if (!community) {
      return res.status(404).json({ success: false, message: "Community not found" });
    }

    if (!discussionForum) {
      return res.status(400).json({
        success: false,
        message: `Error while fetching Discussion Forum of Community ${community.communityName}`
      });
    }

    if (community.members.includes(userId) && discussionForum.users.includes(userId)) {
      return res.status(400).json({ success: false, message: "User is already a member of the community" });
    }

    community.members.push(userId);
    discussionForum.users.push(userId);
    await community.save();
    await discussionForum.save();

    const user = await User.findById(userId).populate("username").populate("profilePicture").populate("role");

    const newNotification = new Notification({
      userId: userId,
      receivers: [community.adminId],
      message: `${user.username} has joined your community`,
    });

    await newNotification.save();

    // Populate the userId field in the notification with the required fields
    const populatedNotification = await Notification.findById(newNotification._id).populate({
      path: 'userId',
      select: 'username role profilePicture'
    });

    res.status(201).json({ 
      success: true, 
      message: "User added to the community", 
      community: community,
      discussionForum: discussionForum,
      notification: populatedNotification
    });

  } catch (error) {
    console.error("Error while adding member to community:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export default addMemberToCommunity;
