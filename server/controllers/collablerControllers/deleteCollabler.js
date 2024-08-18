import mongoose from "mongoose";
import User from "../../models/userModel.js";

const deleteCollabler = async (req, res) => {
    try {
        const { collablerId } = req.params;
        const reqUserId = req.userId;

        // Find the users involved
        const collabler = await User.findById(collablerId);
        const currentUser = await User.findById(reqUserId);

        if (!collabler) {
            return res.status(404).json({
                success: false,
                message: "Collabler not found"
            });
        }

        if (!currentUser) {
            return res.status(404).json({
                success: false,
                message: "Current user not found"
            });
        }

        const objectCollablerId = new mongoose.Types.ObjectId(collablerId);
        const objectReqUserId = new mongoose.Types.ObjectId(reqUserId);

        // Check if they are indeed collablers
        if (!currentUser.collablers.includes(objectCollablerId) || !collabler.collablers.includes(objectReqUserId)) {
            return res.status(400).json({
                success: false,
                message: "Users are not collablers"
            });
        }

        // Remove the collabler from the current user's collablers array
        currentUser.collablers = currentUser.collablers.filter(item => !item.equals(objectCollablerId));

        // Remove the current user from the collabler's collablers array
        collabler.collablers = collabler.collablers.filter(item => !item.equals(objectReqUserId));

        // Save the changes
        await currentUser.save();
        await collabler.save();

        return res.status(200).json({
            success: true,
            message: "Collabler has been removed successfully",
            currentUser: currentUser.collablers,
            collabler: collabler.collablers
        });

    } catch (error) {
        console.error("Internal server error: ", error);
        return res.status(500).json({
            success: false,
            message: "Error while removing collabler"
        });
    }
};

export default deleteCollabler;
