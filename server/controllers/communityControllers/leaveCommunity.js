import Community from "../../models/communityModel.js";
import Chat from "../../models/chatModel.js";

const leaveCommunity = async (req, res) => {
    try {
        const { communityId } = req.params;
        const userId = req.userId;

        const community = await Community.findById(communityId);
        const discussionForum = await Chat.findOne({ chatName: communityId });

        if (!community) {
            return res.status(400).json({
                success: false,
                message: "Community not found"
            });
        }

        if (!community.members.includes(userId)) {
            return res.status(400).json({
                success: false,
                message: "You are not a member of this community"
            });
        }

        if (community.adminId.toString() === userId.toString()) {
            // User is the admin, delete the community and the discussion forum
            await Community.findByIdAndDelete(communityId);
            await Chat.findOneAndDelete({ chatName: communityId });

            return res.status(200).json({
                success: true,
                message: "You have successfully leaved the community and as you are admin so Community and its discussion forum have been deleted successfully"
            });
        } else {
            // User is not the admin, just remove them from the community and discussion forum
            community.members = community.members.filter(item => item.toString() !== userId.toString());
            discussionForum.users = discussionForum.users.filter(item => item.toString() !== userId.toString());

            await community.save();
            await discussionForum.save();

            return res.status(200).json({
                success: true,
                message: "You have left the community successfully"
            });
        }
    } catch (error) {
        console.log("Internal server error: ", error);
        return res.status(500).json({
            success: false,
            message: "Error while leaving the community"
        });
    }
};

export default leaveCommunity;
