import Community from "../../models/communityModel.js";
import Chat from "../../models/chatModel.js";
import fs from "fs";

const createCommunity = async(req , res) => {

    try {
        
        const {communityName, communityDescription, privacy, communityGenre, members = []} = req.body;
        const userId = req.userId;
        const image = req.file ? req.file.path : "";

        if(!communityName){
            return res.status(400).json({
                success: false,
                message: "Community Name is Required"
            });
        }

        if(!communityGenre){
            return res.status(400).json({
                success: false,
                message: "Community Genre is Required"
            });
        }

        const descLength = communityDescription.split(/\s+/).length;

        if(communityDescription && descLength > 500){
            return res.status(406).json({
                success: false,
                message: "Community Description must not exceed 500 words"
            });
        }

        // Check if image is provided, validate its format and size
        if (image) {
            const validFormats = ['image/jpeg', 'image/png'];
            const imageSize = fs.statSync(image).size;
            const imageFormat = req.file.mimetype;

            if (!validFormats.includes(imageFormat)) {
                return res.status(406).json({
                    success: false,
                    message: "Given format is not accepted, only JPG and PNG are allowed"
                });
            }

            if (imageSize > 50 * 1024 * 1024) { // Image size more than 50MB
                return res.status(406).json({
                    success: false,
                    message: "Image size must not exceed 50MB"
                });
            }
        }

        const updatedMembers = Array.isArray(members) ? members : [];
        updatedMembers.push(userId);

        const newCommunity = new Community({
            adminId: userId,
            communityName,
            communityDescription,
            communityBanner: image,
            privacy,
            communityGenre,
            members: updatedMembers
        });   
        await newCommunity.save();


        
        var users = [];
        
        
        users.push(userId);
        const groupChat = await Chat.create({
            chatName: newCommunity._id,
            users: users,
            isGroupChat: true,
            groupAdmin: userId,
        });
        
        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password");
    


        res.status(201).json({
            success: true,
            message: "Community has been created successfully",
            community: newCommunity,
            discussionForum: fullGroupChat
        });

    } catch (error) {
        console.log("Error while creating community: ", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }

}

export default createCommunity;