import Community from "../../models/communityModel.js";

const addMemberToCommunity = async (req, res) => {
  try {
    const { communityId } = req.params;
    const userId = req.userId; 
    console.log('User ID:', userId);

    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({ success: false, message: "Community not found" });
    }

    if (community.members.includes(userId)) {
      return res.status(400).json({ success: false, message: "User is already a member of the community" });
    }

    community.members.push(userId);
    await community.save();

    res.status(200).json({ success: true, message: "User added to the community", community });
  } catch (error) {
    console.error("Error while adding member to community:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export default addMemberToCommunity;
