import communityLiveSpaceModel from "../../models/communityLiveSpaceModel.js";
import fs from "fs";
import Community from './../../models/communityModel.js';
import User from './../../models/userModel.js';
import Notification from './../../models/notificationModel.js';

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

         const responseMessage = type === "Scheduled"
            ? `Scheduled Live Space has been created Successfully and will start at: ${startDateTime} and will end at ${endDateTime}`
            : "Instant Live Space has been created Successfully";

        const user = await User.findById(hostId);

        let message = ``;

        if (type === "Instant") {
            message = `${user.username} has created an Instant Live Space named as ${newCommunityLiveSpace.eventName}`;
        } else {
            message = `${user.username} has created a Scheduled Live Space named as ${newCommunityLiveSpace.eventName} starting from ${startDateTime} to ${endDateTime}`;
        }

        // Filter out the userId of the post uploader from the community members
        const receivers = community.members.filter(memberId => !memberId.equals(hostId));

        const newNotification = new Notification({
            userId: hostId,
            receivers: receivers,
            message: message,
        });

        await newNotification.save();


        return res.status(201).json({
            success: true,
            message: responseMessage,
            event: newCommunityLiveSpace,
            notification: newNotification
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