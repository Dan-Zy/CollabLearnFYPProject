import Community from "../../models/communityModel.js";
import CommunityPost from "../../models/communityPostModel.js";

const deleteCommunity = async (req, res) => {
    try {
        const { communityId } = req.params;
        const adminId = req.userId;

        if (!communityId) {
            return res.status(400).json({
                success: false,
                message: "Community ID is required"
            });
        }

        const community = await Community.findById(communityId);
        if (!community) {
            return res.status(404).json({
                success: false,
                message: "Community not found"
            });
        }

        if (community.adminId.toString() !== adminId) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this community"
            });
        }

        // Delete all posts related to the community
        const deleteResult = await CommunityPost.deleteMany({ communityId });

        console.log(`Deleted ${deleteResult.deletedCount} posts related to community ${communityId}`);

        // Delete the community itself
        await Community.deleteOne({ _id: communityId });

        res.status(200).json({
            success: true,
            message: "Community and its related posts have been deleted successfully"
        });
    } catch (error) {
        console.log("Error while deleting Community: ", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export default deleteCommunity;
