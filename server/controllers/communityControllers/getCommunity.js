import Community from "../../models/communityModel.js";

const getCommunity = async (req, res) => {

    try {
        const { communityId } = req.params;
        const userId = req.userId;

        // console.log("Req User ID: ", typeof(reqUserId));
        // console.log("Param User ID: ", typeof(userId));

        const community = await Community.findById(communityId).populate("adminId").populate("members");

        // if(community.privacy === "Private"){
        //     if()
        // }

        console.log("Community Member's ID: ", community.members[0]._id);

        return res.status(200).json({
            success: true,
            message: "Community fetched successfully",
            community
        })


    } catch (error) {
        console.log("Error while fetching a community");
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }

}

export default getCommunity;