import Community from "../../models/communityModel.js";

const getCommunity = async (req, res) => {

    try {
        const { communityId } = req.params;
        const userId = req.userId;
    
        const community = await Community.findById(communityId).populate("adminId").populate("members");

        const memb = community.members.find(element => { return JSON.stringify(userId) === JSON.stringify(element._id) });
        console.log("Member: ", memb);

        console.log("UserID : ", JSON.stringify(userId));

        console.log("Community Member's ID: ", JSON.stringify(community.members[0]._id));

        if(JSON.stringify(userId) === JSON.stringify(community.members[0]._id)){
            console.log("EQUALLLLLLL");
        }

        if(community.privacy === "Private" && memb == undefined){
            return res.status(401).json({
                success: false,
                message: "You have to be a member of this community to view this Private Community Details"
            })
        }

        
        

        else{
            console.log("NOT EQUAL");
        }

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