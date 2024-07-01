import CommunityModel from "../../models/communityModel.js";

const createCommunity = async(req , res) => {

    try {
        
        // const {communityName, communityDescription, privacy, communityGenre, }

    } catch (error) {
        console.log("Error while creating community: ", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }

}