// import mongoose from "mongoose";
// import CommunityPost from "../../models/communityPostModel.js";
// import Community from "../../models/communityModel.js";

// const shareComPost = async (req, res) => {
//     try {
//         const { postId } = req.params;
//         const userId = req.userId; // Assuming req.userId is set by your authentication middleware

//         // Validate the postId
//         if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
//             return res.status(400).json({ 
//                 success: false,
//                 message: 'Invalid PostID' 
//             });
//         }

//         // Find the original post
//         const originalPost = await CommunityPost.findById(postId);
//         if (!originalPost) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Original post not found"
//             });
//         }

//         const comId = originalPost.communityId.toString()
//         console.log("Community ID: ", comId);

//         const community = await Community.findById(comId);
//         console.log("Community: ", community);

//         if(community.privacy === "Private"){
//             return res.status(400).json({
//                 success: false,
//                 message: "Private Community's Post cannot be shared"
//             });
//         }

//         // Create a new post that references the original post
//         const sharedPost = new Post({
//             userId: userId, // User who is sharing the post
//             content: originalPost.content,
//             image: originalPost.image,
//             document: originalPost.document,
//             video: originalPost.video,
//             originalAuthor: originalPost.userId, // Original author of the post
//             sharedPost: originalPost._id // Reference to the original post
//         });

//         await sharedPost.save();

//         // Update the shares array in the original post
//         await Post.findByIdAndUpdate(postId, { $addToSet: { shares: userId } });

//         res.status(200).json({
//             success: true,
//             message: "Post has been shared",
//             post: sharedPost
//         });

//     } catch (error) {
//         console.log("Error occurred while sharing the community post: ", error);
//         return res.status(500).json({
//             success: false,
//             message: "Internal server error"
//         });
//     }
// }

// export default shareComPost;








import mongoose from "mongoose";
import CommunityPost from "../../models/communityPostModel.js";
import Community from "../../models/communityModel.js";

const shareComPost = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.userId; // Assuming req.userId is set by your authentication middleware

        // Validate the postId
        if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ 
                success: false,
                message: 'Invalid PostID' 
            });
        }

        // Find the original post
        const originalPost = await CommunityPost.findById(postId);
        if (!originalPost) {
            return res.status(404).json({
                success: false,
                message: "Original post not found"
            });
        }

        const comId = originalPost.communityId.toString();
        console.log("Community ID: ", comId);

        const community = await Community.findById(comId);
        if (!community) {
            return res.status(404).json({
                success: false,
                message: "Community not found"
            });
        }
        console.log("Community: ", community);

        // Check if the community is private
        if (community.privacy === "Private") {
            return res.status(400).json({
                success: false,
                message: "Private Community's Post cannot be shared"
            });
        }

        // Create a new post that references the original post
        const sharedPost = new CommunityPost({
            userId: userId, // User who is sharing the post
            content: originalPost.content,
            image: originalPost.image,
            document: originalPost.document,
            video: originalPost.video,
            originalAuthor: originalPost.userId, // Original author of the post
            sharedPost: originalPost._id, // Reference to the original post
            communityId: originalPost.communityId // Reference to the community
        });

        await sharedPost.save();

        // Update the shares array in the original post
        await CommunityPost.findByIdAndUpdate(postId, { $addToSet: { shares: userId } });

        res.status(200).json({
            success: true,
            message: "Post has been shared",
            post: sharedPost
        });

    } catch (error) {
        console.log("Error occurred while sharing the community post: ", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

export default shareComPost;

