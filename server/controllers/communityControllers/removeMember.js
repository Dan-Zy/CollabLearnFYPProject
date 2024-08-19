import Community from "../../models/communityModel.js";
import Chat from "../../models/chatModel.js";
import User from "../../models/userModel.js";
import Notification from "../../models/notificationModel.js";

const removeMemberFromCommunity = async (req, res) => {
    try {
        const { communityId, memberId } = req.params;
        const userId = req.userId; // This is the ID of the admin making the request

        // Find the community
        const community = await Community.findById(communityId);
        const discussionForum = await Chat.findOne({ chatName: communityId });

        if (!community) {
            return res.status(404).json({
                success: false,
                message: "Community not found"
            });
        }

        if (community.adminId.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: "Only the admin can remove members"
            });
        }

        if (!community.members.includes(memberId)) {
            return res.status(400).json({
                success: false,
                message: "User is not a member of this community"
            });
        }

        // Remove the member from the community and the discussion forum
        community.members = community.members.filter(item => item.toString() !== memberId.toString());
        discussionForum.users = discussionForum.users.filter(item => item.toString() !== memberId.toString());

        await community.save();
        await discussionForum.save();

        const user = await User.findById(userId).populate("username").populate("profilePicture").populate("role");

        const newNotification = new Notification({
            userId: userId,
            receivers: [memberId],
            message: `${user.username} has removed you from the ${community.communityName} community`,
        });
    
        await newNotification.save();

        // Populate the userId field in the notification with the required fields
        const populatedNotification = await Notification.findById(newNotification._id).populate({
            path: 'userId',
            select: 'username role profilePicture'
        });

        return res.status(200).json({
            success: true,
            message: "Member has been removed from the community and discussion forum successfully",
            notification: populatedNotification
        });

    } catch (error) {
        console.log("Internal server error: ", error);
        return res.status(500).json({
            success: false,
            message: "Error while removing member from the community"
        });
    }
};

export default removeMemberFromCommunity;
