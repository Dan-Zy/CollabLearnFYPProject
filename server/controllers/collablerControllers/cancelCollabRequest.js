import mongoose from "mongoose";
import User from "../../models/userModel.js";

const cancelCollabRequest = async (req, res) => {
    try {
        const { userId } = req.params;
        const reqUserId = req.userId;

        // Find the users involved
        const sendedUser = await User.findById(userId);
        const receivedUser = await User.findById(reqUserId);

        if (!sendedUser) {
            return res.status(400).json({
                success: false,
                message: "User who sent the request not found"
            });
        }

        const objectUserId = new mongoose.Types.ObjectId(userId);
        const objectReqUserId = new mongoose.Types.ObjectId(reqUserId);

        // Check if the request has not been sent by the sender to the receiver
        const hasSentRequest = sendedUser.sendedRequests.includes(objectReqUserId);
        const hasReceivedRequest = receivedUser.receivedRequests.some(request =>
            request.user.equals(objectUserId)
        );

        if (!hasSentRequest || !hasReceivedRequest) {
            return res.status(400).json({
                success: false,
                message: "No such collab request exists to cancel"
            });
        }

        // Check if the request exists in receivedUser's receivedRequests
        const requestIndex = receivedUser.receivedRequests.findIndex(request => 
            request.user.equals(objectUserId)
        );
        if (requestIndex === -1) {
            return res.status(400).json({
                success: false,
                message: "Received request does not exist"
            });
        }

        // Check if the request exists in sendedUser's sendedRequests
        if (!sendedUser.sendedRequests.includes(objectReqUserId)) {
            return res.status(400).json({
                success: false,
                message: "Sent request does not exist"
            });
        }

        // Populate the relevant fields for the response
        const populatedReceivedUser = await receivedUser.populate({
            path: 'receivedRequests.user',
            select: 'username role profilePicture'
        });

        const populatedSendedUser = await sendedUser.populate({
            path: 'sendedRequests',
            select: 'username role profilePicture'
        });

        // Remove the request from both users' arrays
        receivedUser.receivedRequests.splice(requestIndex, 1);
        sendedUser.sendedRequests.pull(objectReqUserId);

        // Save the changes
        await receivedUser.save();
        await sendedUser.save();

        return res.status(200).json({
            success: true,
            message: "Collab Request has been canceled successfully",
            receivedRequests: populatedReceivedUser.receivedRequests,
            sendedRequests: populatedSendedUser.sendedRequests
        });

    } catch (error) {
        console.log("Internal server error:", error);
        return res.status(500).json({
            success: false,
            message: "Error while canceling collab request"
        });
    }
};

export default cancelCollabRequest;
