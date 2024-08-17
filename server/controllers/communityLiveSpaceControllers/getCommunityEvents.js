import communityLiveSpaceModel from "../../models/communityLiveSpaceModel.js";
import Community from "../../models/communityLiveSpaceModel.js";

export const getCommunityLiveSpaces = async (req, res) => {
    try {
        const { communityId } = req.params;

        // Fetch all live spaces associated with the provided communityId
        const liveSpaces = await communityLiveSpaceModel.find({ communityId }).populate('hostId').populate('numberOfParticipants');

        if (!liveSpaces) {
            return res.status(404).json({ message: "No live spaces found for this community." });
        }

        res.status(200).json({
            success: true,
            message: "Community Livespaces has been fetched successfully",
            Events: liveSpaces
        });
    } catch (error) {
        console.error("Error fetching community live spaces:", error);
        res.status(500).json({
            success: false, 
            message: "An error occurred while fetching live spaces." 
        });
    }
};