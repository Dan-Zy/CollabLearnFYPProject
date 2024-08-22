import liveSpaceModel from "../../models/liveSpaceModel.js";
import User from "../../models/userModel.js"; // Import User model

const getNumberOfParticipants = async (req, res) => {
    try {
        const { eventId } = req.params;

        // Fetch the live space document by eventId
        const liveSpace = await liveSpaceModel.findById(eventId).populate({
            path: 'numberOfParticipants',
            select: 'username profilePicture role' // Only select the needed fields
        });

        if (!liveSpace) {
            return res.status(400).json({
                success: false,
                message: "Cannot find live space"
            });
        }

        // Extract participants' details
        const participants = liveSpace.numberOfParticipants;

        console.log("Participants: ", participants);

        // Return the participants' details in the response
        return res.status(200).json({
            success: true,
            message: `Participants of Live Space (${liveSpace.eventName}) have been fetched successfully`,
            participants
        });

    } catch (error) {
        console.log("Internal server error: ", error);
        return res.status(500).json({
            success: false,
            message: "Error while fetching Number of participants of live spaces"
        });
    }
};

export default getNumberOfParticipants;
