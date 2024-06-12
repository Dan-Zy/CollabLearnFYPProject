import { DateTime } from "luxon";
import liveSpaceModel from "../../models/liveSpaceModel.js";
import fs from "fs";

const createEvent = async (req, res) => {
    try {
        const { eventName, eventDescription, type, startDate, endDate, startTime, endTime } = req.body;
        const hostId = req.userId;
        const image = req.file ? req.file.path : "";

        console.log(`${eventName} , ${eventDescription} , ${type} , ${hostId} , ${startDate} , ${startTime}`);

        if (!eventName || !eventDescription || !type || !hostId) {
            
            return res.status(400).json({
                success: false,
                message: "Event name, description, type, and host ID are required"
            });
        }

        if (type === "scheduled") {
            if (!startDate || !endDate || !startTime || !endTime) {
                return res.status(400).json({
                    success: false,
                    message: "Date and Time required for Scheduled Events"
                });
            }

            if(!image){
                return res.status(400).json({
                    success: false,
                    message: "Image is required for Scheduled Events"
                });
            }
        }


        if(type === "instant"){
            if (startDate || endDate || startTime || endTime) {
                return res.status(400).json({
                    success: false,
                    message: "Date and Time required not required for Instant Events"
                });
            }

            if(image !== ""){
                return res.status(400).json({
                    success: false,
                    message: "Image is not required for Instant Events"
                });
            }
        }

        const length = eventDescription.split(/\s+/).length;

        if(length > 500){
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

        const startDateTime = type === "scheduled" ? DateTime.fromISO(`${startDate}T${startTime}`) : null;
        const endDateTime = type === "scheduled" ? DateTime.fromISO(`${endDate}T${endTime}`) : null;

        const newLiveSpace = new liveSpaceModel({
            hostId,
            eventName,
            eventDescription,
            imageBanner: image,
            type,
            startDateTime: startDateTime ? startDateTime.toJSDate() : undefined,
            endDateTime: endDateTime ? endDateTime.toJSDate() : undefined
        });

        await newLiveSpace.save();

        const responseMessage = type === "scheduled"
            ? `Scheduled Live Space has been created Successfully and will start at: ${startDateTime.toJSDate()} and will end at ${endDateTime.toJSDate()}`
            : "Instant Live Space has been created Successfully";

        return res.status(201).json({
            success: true,
            message: responseMessage,
            event: newLiveSpace
        });
    } catch (error) {
        console.log("Error while creating Live Space: ", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

export default createEvent;
