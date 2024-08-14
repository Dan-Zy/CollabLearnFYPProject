// THIS CONTROLLER IS A CASE IF USER SEND A COLLAB REQUEST TO ANYONE AND HE/SHE WANTS TO CANCEL THAT REQUEST THAN THIS CONTROLLER WILL WORK IN THIS CASE

import mongoose from "mongoose";
import User from './../../models/userModel.js';

const removeCollabRequest = async (req, res) => {
    try {
        const { userId } = req.params;
        const reqUserId = req.userId;

        // Find the users involved
        const sendedUser = await User.findById(reqUserId);
        const receivedUser = await User.findById(userId);

        if (!receivedUser) {
            return res.status(400).json({
                success: false,
                message: "User who received the request not found"
            });
        }

        const objectUserId = new mongoose.Types.ObjectId(userId);
        const objectReqUserId = new mongoose.Types.ObjectId(reqUserId);

        // Check if the sent request exists in receivedUser's receivedRequests
        const requestIndex = receivedUser.receivedRequests.findIndex(request =>
            request.user.equals(objectReqUserId)
        );
        if (requestIndex === -1) {
            return res.status(400).json({
                success: false,
                message: "Received request does not exist"
            });
        }

        // Check if the sent request exists in sendedUser's sendedRequests
        if (!sendedUser.sendedRequests.includes(objectUserId)) {
            return res.status(400).json({
                success: false,
                message: "Sent request does not exist"
            });
        }

        // Remove the request from both users' arrays
        receivedUser.receivedRequests.splice(requestIndex, 1);
        sendedUser.sendedRequests.pull(objectUserId);

        // Save the changes
        await receivedUser.save();
        await sendedUser.save();

        // Populate the relevant fields for the response
        const populatedReceivedUser = await receivedUser.populate({
            path: 'receivedRequests.user',
            select: 'username role profilePicture'
        });

        const populatedSendedUser = await sendedUser.populate({
            path: 'sendedRequests',
            select: 'username role profilePicture'
        });

        return res.status(200).json({
            success: true,
            message: "Collab Request has been removed successfully",
            receivedRequests: populatedReceivedUser.receivedRequests,
            sendedRequests: populatedSendedUser.sendedRequests
        });

    } catch (error) {
        console.log("Internal server error: ", error);
        return res.status(500).json({
            success: false,
            message: "Error while removing collab request"
        });
    }
};

export default removeCollabRequest;
