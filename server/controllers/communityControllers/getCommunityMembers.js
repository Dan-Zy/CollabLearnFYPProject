import Community from "../../models/communityModel.js";

const getCommunityMembers = async (req, res) => {
    try {
        const { communityId } = req.params;

        // Find the community by ID and populate the members field
        const community = await Community.findById(communityId).populate("members");

        if (!community) {
            return res.status(404).json({
                success: false,
                message: "Community not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Community members fetched successfully",
            members: community.members,
        });
    } catch (error) {
        console.error("Internal server error: ", error);
        return res.status(500).json({
            success: false,
            message: "Error while fetching community members",
        });
    }
};

export default getCommunityMembers;
