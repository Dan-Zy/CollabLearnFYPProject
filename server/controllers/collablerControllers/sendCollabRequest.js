import mongoose from "mongoose";
import User from "../../models/userModel.js";
import Notification from './../../models/notificationModel.js';

const sendCollabRequest = async (req, res) => {
    try {
        const { userId } = req.params;
        const reqUserId = req.userId;

        // Find the user who will receive the request
        const requestReceiveUser = await User.findById(userId);
        if (!requestReceiveUser) {
            return res.status(400).json({
                success: false,
                message: "User to send Collab Request not found"
            });
        }

        // Find the user who is sending the request
        const requestSendUser = await User.findById(reqUserId);
        if (!requestSendUser) {
            return res.status(400).json({
                success: false,
                message: "Request User for Collab Request not found"
            });
        }

        const reqReceiveUserIdObject = new mongoose.Types.ObjectId(userId);
        const reqSendUserIdObject = new mongoose.Types.ObjectId(reqUserId);

        // Check if the requesting user has already sent a request to the receiving user
        const hasReceivedRequest = requestReceiveUser.receivedRequests.some(request => 
            request && request.user && request.user.equals(reqSendUserIdObject)
        );

        if (requestSendUser.sendedRequests.includes(reqReceiveUserIdObject) && hasReceivedRequest) {
            return res.status(400).json({
                success: false,
                message: "You have already sent a collab request to this user"
            });
        }

        // Check if the receiving user has already sent a request to the requesting user
        const hasSentRequest = requestSendUser.receivedRequests.some(request => 
            request && request.user && request.user.equals(reqReceiveUserIdObject)
        );

        if (requestReceiveUser.sendedRequests.includes(reqSendUserIdObject) && hasSentRequest) {
            return res.status(400).json({
                success: false,
                message: "This user has already sent you a collab request"
            });
        }

        // Check if they are already collablers
        if (requestSendUser.collablers.includes(reqReceiveUserIdObject) && requestReceiveUser.collablers.includes(reqSendUserIdObject)) {
            return res.status(400).json({
                success: false,
                message: "You both are already collablers"
            });
        }

        // Push the request data to the relevant fields
        requestSendUser.sendedRequests.push(reqReceiveUserIdObject);
        requestReceiveUser.receivedRequests.push({ user: reqSendUserIdObject, seen: false });

        // Save the changes
        await requestSendUser.save();
        await requestReceiveUser.save();

        // Populate username, role, and profilePicture for sendedRequests
        const populatedReqUser = await requestSendUser.populate({
            path: 'sendedRequests',
            select: 'username role profilePicture'
        });

        // Populate username, role, and profilePicture for receivedRequests
        const populatedUser = await requestReceiveUser.populate({
            path: 'receivedRequests.user',
            select: 'username role profilePicture'
        });

        const newNotification = new Notification({
            userId: reqUserId,
            receivers: [userId],
            message: `${requestSendUser.username} has sent you a collab request`,
        });

        await newNotification.save();

        return res.status(201).json({
            success: true,
            message: "Collab Request has been sent successfully",
            RequestSendToUser: populatedReqUser.sendedRequests,
            RequestSendedByUser: populatedUser.receivedRequests,
            notification: newNotification
        });

    } catch (error) {
        console.log("Internal Server Error: ", error);
        return res.status(500).json({
            success: false,
            message: "Error while sending collab request"
        });
    }
};

export default sendCollabRequest;
