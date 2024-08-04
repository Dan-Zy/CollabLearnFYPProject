import mongoose from "mongoose";
import User from "../../models/userModel.js";

const acceptCollabRequest = async (req, res) => {

    try {
        
        const { userId } = req.params;
        const reqUserId = req.userId;

        const sendedUser = await User.findById(userId);
        const receivedUser = await User.findById(reqUserId);

        if(!sendedUser){
            return res.status(400).json({
                success: false,
                message: "Sended Request User does not exist"
            });
        }

        if(!receivedUser){
            return res.status(400).json({
                success: false,
                message: "Received Request User does not exist"
            });
        }

        const objectUserId = new mongoose.Types.ObjectId(userId);
        const objectReqUserId = new mongoose.Types.ObjectId(reqUserId);

        if(!receivedUser.receivedRequests.includes(objectUserId)){
            return res.status(400).json({
                success: false,
                message: "Received request does not exist"
            });
        }

        if(!sendedUser.sendedRequests.includes(objectReqUserId)){
            return res.status(400).json({
                success: false,
                message: "Sended request does not exist"
            });
        }

        receivedUser.collablers.push(userId);
        sendedUser.collablers.push(reqUserId);

        receivedUser.receivedRequests.pull(userId);
        sendedUser.sendedRequests.pull(reqUserId);

        await receivedUser.save();
        await sendedUser.save();

        return res.status(200).json({
            success: true,
            message: "Collab Request has been accepted successfully"
        })

    } catch (error) {
        console.log("Internal server error: ", error);
        return res.status(500).json({
            success: false,
            message: "Error while accepting collab request"
        });
    }

}

export default acceptCollabRequest;