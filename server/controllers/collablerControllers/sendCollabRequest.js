import mongoose from "mongoose";
import User from "../../models/userModel.js";

const sendCollabRequest = async (req , res) => {

    try {
        
        const {userId} = req.params;
        const reqUserId = req.userId;

        // console.log("User ID: ", userId);
        // console.log("Requested User ID: ", reqUserId);

        // console.log("User ID TYPE: ", typeof(userId));
        // console.log("Requested User ID TYPE: ", typeof(reqUserId));

        const user = await User.findById(userId);
        if(!user){
            return res.status(400).json({
                success: false,
                message: "User for Collab Request not found"
            });
        }

        const reqUser = await User.findById(reqUserId);
        if(!reqUser){
            return res.status(400).json({
                success: false,
                message: "Request User for Collab Request not found"
            });
        }

        const objectUserId = new mongoose.Types.ObjectId(userId);
        const objectReqUserId = new mongoose.Types.ObjectId(reqUserId);

        // console.log("OBJECT USER: ", objectUserId);
        // console.log("OBJECT REQ USER: ", objectReqUserId);
        
        if(reqUser.sendedRequests.includes(objectUserId) && user.receivedRequests.includes(objectReqUserId)){
            return res.status(400).json({
                success: false,
                message: "You have already send collab request to this user"
            });
        }

        if(reqUser.collablers.includes(objectUserId) && user.collablers.includes(objectReqUserId)){
            return res.status(400).json({
                success: false,
                message: "You both are already collablers"
            });
        }

        reqUser.sendedRequests.push(objectUserId);
        user.receivedRequests.push(objectReqUserId);

        await reqUser.save();
        await user.save();

        console.log(reqUser.sendedRequests);
        

        return res.status(201).json({
            success: true,
            message: "Collab Request has been sent successfully"
        });
        
        

    } catch (error) {
        console.log("Internal Server Error: ", error);
        return res.status(500).json({
            success: false,
            message: "Error while sending collab request"
        });
    }

}

export default sendCollabRequest;