import mongoose from "mongoose";
import { Post } from "../../models/postModel.js";
import User from "../../models/userModel.js";

const sharePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const { sharedContent } = req.body;
        const userId = req.userId; // Assuming req.userId is set by your authentication middleware

        // Validate the postId
        if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ 
                success: false,
                message: 'Invalid PostID' 
            });
        }

        // Find the original post
        const originalPost = await Post.findById(postId);
        if (!originalPost) {
            return res.status(404).json({
                success: false,
                message: "Original post not found"
            });
        }

        if(sharedContent && sharedContent !== ""){
            const contentLength = sharedContent.split(/\s+/).length;

            if (contentLength > 500) {
                return res.status(406).json({
                    success: false,
                    message: "Shared Content length must not exceed 500 words"
                });
            }

        }


        // Create a new post that references the original post
        const sharedPost = new Post({
            userId: userId, // User who is sharing the post
            content: originalPost.content,
            image: originalPost.image,
            document: originalPost.document,
            video: originalPost.video,
            originalAuthor: originalPost.userId, // Original author of the post
            sharedPost: originalPost._id, // Reference to the original post
            sharedContent: sharedContent
        });


        await sharedPost.save();
        await sharedPost.populate('originalAuthor', 'username');
        await Post.findByIdAndUpdate(postId, { $addToSet: { shares: userId } });

        res.status(200).json({
            success: true,
            message: "Post has been shared",
            post: sharedPost,
            originalAuthorUsername: sharedPost.originalAuthor.username // Return the username
        });
    } catch (error) {
        console.log("Error occurred while sharing the post: ", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

export default sharePost;
