import communityLiveSpaceModel from "../../models/communityLiveSpaceModel.js";
import fs from "fs";
import Community from './../../models/communityModel.js';

const createEventCommunity = async (req, res) => {
    try {
        const { eventName, eventDescription, type, eventGenre, eventLink } = req.body;
        const { communityId } = req.params;
        const hostId = req.userId;
        const image = req.file ? req.file.path : "";

        const community = await Community.findById(communityId);

        if(!community){
            return res.status(400).json({
                success: false,
                message: "Community not Found"
            });
        }
        console.log("Host Id: ", hostId);
        console.log("Community Admin Id: ", community.adminId.toString());


        if(hostId !== community.adminId.toString()){
            return res.status(400).json({
                success: false,
                message: "Only Admin can create Live Space in Community"
            });
        }


        console.log("Received Data: ", eventName , eventDescription , type , eventGenre , eventLink);

        console.log(`${eventName} , ${eventDescription} , ${type} , ${hostId}`);

        if (!eventName || !eventDescription || !type || !eventGenre || !eventLink) {
            return res.status(400).json({
                success: false,
                message: "Event name, description, type, genre and eventlink are required"
            });
        }


        const length = eventDescription.split(/\s+/).length;

        if (length > 500) {
            return res.status(406).json({
                success: false,
                message: "Content length must not exceed 500 words"
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


        const newCommunityLiveSpace = new communityLiveSpaceModel({
            communityId,
            hostId,
            eventName,
            eventDescription,
            imageBanner: image,
            type,
            eventGenre,
            eventLink,
            eventStatus: "Ongoing", // Set initial status based on type
            numberOfParticipants: [hostId] // Add the host to the numberOfParticipants field
        });

        await newCommunityLiveSpace.save();


        return res.status(201).json({
            success: true,
            message: "Community Instant Live Space has been created successfully",
            event: newCommunityLiveSpace
        });
    } catch (error) {
        console.log("Error while creating Live Space: ", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

export default createEventCommunity;