import Community from "../../models/communityModel.js";

const getCommunities = async (req, res) => {

    try {
        
        const communities = await Community.find().populate('adminId').sort({createdAt: -1});
        res.status(200).json({
            success: true,
            length: communities.length,
            communities
        });

    } catch (error) {
        console.log("Error while fetching Communities");
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }

}

export default getCommunities;