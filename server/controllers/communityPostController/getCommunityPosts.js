import CommunityPost from './../../models/communityPostModel.js';

const getCommunityPosts = async (req, res) => {
    try {

        const {communityId} = req.params;

        // Initialize query object
        let query = {};

        if(!communityId){
            return res.status(400).json({
                success: false,
                message: "Community ID not found"
            });
        }

        query.communityId = communityId;

        // Find posts with optional communityId filter, populate userId, and sort by creation date
        const posts = await CommunityPost.find(query).populate('userId').sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            length: posts.length,
            posts
        });

    } catch (error) {
        console.log("Error while fetching posts' data: ", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

export default getCommunityPosts;