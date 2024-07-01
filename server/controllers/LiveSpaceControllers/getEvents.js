import liveSpaceModel from "../../models/liveSpaceModel.js";

const getEvents = async (req , res) => {

    try {
        
        const events = await liveSpaceModel.find().populate('hostId').sort({createdAt: -1});
        res.status(200).json({
            success: true,
            // length: events.length,
            events
        });

    } catch (error) {
        console.log("Error while fetching Events: ", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }

}

export default getEvents;