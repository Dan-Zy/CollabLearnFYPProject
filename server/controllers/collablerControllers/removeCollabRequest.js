// THIS CONTROLLER IS A CASE IF USER SEND A COLLAB REQUEST TO ANYONE AND HE/SHE WANTS TO CANCEL THAT REQUEST THAN THIS CONTROLLER WILL WORK IN THIS CASE

import mongoose from "mongoose";
import User from './../../models/userModel.js';

const removeCollabRequest = async (req, res) => {

    try {
        
        const {userId} = req.params;
        const reqUserId = req.userId;

        const sendedUser = await User.findById(reqUserId);
        const receivedUser = await User.findById(userId);

        if(!sendedUser){
            return res.status(400).json({
                success: false,
                message: "User does not found whom you sended request"
            });
        }

        const objectUserId = new mongoose.Types.ObjectId(userId);
        const objectReqUserId = new mongoose.Types.ObjectId(reqUserId);

        if(!receivedUser.receivedRequests.includes(objectReqUserId)){
            return res.status(400).json({
                success: false,
                message: "Received Request does not exist"
            });
        }

        if(!sendedUser.sendedRequests.includes(objectUserId)){
            return res.status(400).json({
                success: false,
                message: "Sended Request does not exist"
            });
        }

        receivedUser.receivedRequests.pull(objectReqUserId);
        sendedUser.sendedRequests.pull(objectUserId);

        await receivedUser.save();
        await sendedUser.save();

        return res.status(200).json({
            success: true,
            message: "Collab Request has been removed successfully"
        });

    } catch (error) {
        console.log("Internal server error: ", error);
        return res.status(500).json({
            success: false,
            message: "Error while removing collab request"
        })
    }

}

export default removeCollabRequest;