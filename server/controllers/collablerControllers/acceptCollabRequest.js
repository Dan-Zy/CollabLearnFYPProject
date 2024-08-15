import mongoose from "mongoose";
import User from "../../models/userModel.js";

const acceptCollabRequest = async (req, res) => {
    try {
        const { userId } = req.params;
        const reqUserId = req.userId;

        // Find the users involved
        const sendedUser = await User.findById(userId);
        const receivedUser = await User.findById(reqUserId);

        if (!sendedUser) {
            return res.status(400).json({
                success: false,
                message: "User who sent the request does not exist"
            });
        }

        if (!receivedUser) {
            return res.status(400).json({
                success: false,
                message: "User who received the request does not exist"
            });
        }

        const objectUserId = new mongoose.Types.ObjectId(userId);
        const objectReqUserId = new mongoose.Types.ObjectId(reqUserId);

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

        // Add each user to the other's collablers array
        receivedUser.collablers.push(objectUserId);
        sendedUser.collablers.push(objectReqUserId);

        // Populate the sender from the receiver collabler field
        const populatedSendedUser = await receivedUser.populate({
            path: 'collablers',
            select: 'username role profilePicture'
        });

        // Populate the receiver from the sender collabler field
        const populatedReceivedUser = await sendedUser.populate({
            path: 'collablers',
            select: 'username role profilePicture'
        });
        

        console.log("Receiver Collabler-1: ", receivedUser.collablers);
        console.log("Sender Collabler-1: ", sendedUser.collablers);

        // Remove the request from both users' arrays
        receivedUser.receivedRequests.splice(requestIndex, 1);
        sendedUser.sendedRequests.pull(objectReqUserId);

        // Save the changes
        await receivedUser.save();
        await sendedUser.save();


        console.log("Receiver Collabler-2: ", populatedReceivedUser.collablers);
        console.log("Sender Collabler-2: ", populatedSendedUser.collablers);
        

        return res.status(200).json({
            success: true,
            message: "Collab Request has been accepted successfully",
            receivedUser: populatedReceivedUser.collablers,
            sendedUser: populatedSendedUser.collablers
        });

    } catch (error) {
        console.log("Internal server error: ", error);
        return res.status(500).json({
            success: false,
            message: "Error while accepting collab request"
        });
    }
};

export default acceptCollabRequest;
