import liveSpaceModel from "../../models/liveSpaceModel.js";

const joinEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const userId = req.userId; // Assuming you are using some form of authentication middleware that adds the user ID to req.user

        // Find the live space by ID
        const liveSpace = await liveSpaceModel.findById(eventId);

        if (!liveSpace) {
            return res.status(404).json({
                success: false,
                message: "Live space not found",
            });
        }

        // Check if the user is already a participant
        const isAlreadyParticipant = liveSpace.numberOfParticipants.includes(userId);

        if (isAlreadyParticipant) {
            return res.status(400).json({
                success: false,
                message: "User is already a participant",
            });
        }

        // Add the user to the participants array
        liveSpace.numberOfParticipants.push(userId);

        // Save the updated live space document
        await liveSpace.save();

        return res.status(200).json({
            success: true,
            message: "User has successfully joined the live space",
            liveSpace: liveSpace,
        });
    } catch (error) {
        console.error("Internal server error:", error);
        return res.status(500).json({
            success: false,
            message: "Error while joining the live space",
        });
    }
};

export default joinEvent;