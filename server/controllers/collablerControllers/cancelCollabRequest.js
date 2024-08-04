import mongoose from "mongoose";
import User from "../../models/userModel.js";

const cancelCollabRequest = async (req, res) => {

    try {
        
        const {userId} = req.params;
        const reqUserId = req.userId;

        const receivedUser = await User.findById(reqUserId);
        const sendedUser = await User.findById(userId);

        if(!sendedUser){
            return res.status(400).json({
                success: false,
                message: "User does not found that send you request"
            });
        }

        const objectUserId = new mongoose.Types.ObjectId(userId);
        const objectReqUserId = new mongoose.Types.ObjectId(reqUserId);

        if(!receivedUser.receivedRequests.includes(objectUserId)){
            return res.status(400).json({
                success: false,
                message: "Received Request does not exist"
            });
        }

        if(!sendedUser.sendedRequests.includes(objectReqUserId)){
            return res.status(400).json({
                success: false,
                message: "Sended Request does not exist"
            });
        }

        receivedUser.receivedRequests.pull(objectUserId);
        sendedUser.sendedRequests.pull(objectReqUserId);

        await receivedUser.save();
        await sendedUser.save();

        return res.status(200).json({
            success: true,
            message: "Collab Request has been canceled successfully"
        });


    } catch (error) {
        console.log("Internal server error");
        return res.status(500).json({
            success: false,
            message: "Error while canceling collab request"
        });
    }

}

export default cancelCollabRequest;