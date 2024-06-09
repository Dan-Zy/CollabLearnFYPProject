import { DateTime } from "luxon";
import liveSpaceModel from "../../models/liveSpaceModel.js";

const createEvent = async (req, res) => {
    try {
        const { eventName, eventDescription, type, startDate, endDate, startTime, endTime } = req.body;
        const hostId = req.userId;

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
        }

        const startDateTime = type === "scheduled" ? DateTime.fromISO(`${startDate}T${startTime}`) : null;
        const endDateTime = type === "scheduled" ? DateTime.fromISO(`${endDate}T${endTime}`) : null;

        const newLiveSpace = new liveSpaceModel({
            hostId,
            eventName,
            eventDescription,
            type,
            startDateTime: startDateTime ? startDateTime.toJSDate() : undefined,
            endDateTime: endDateTime ? endDateTime.toJSDate() : undefined
        });

        await newLiveSpace.save();

        const responseMessage = type === "scheduled"
            ? `Scheduled Live Space has been created Successfully and will start at: ${startDateTime.toJSDate()}`
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
