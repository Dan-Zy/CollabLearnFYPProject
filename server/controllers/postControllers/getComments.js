import mongoose from "mongoose";
import {Post, Comment} from "../../models/postModel.js";

const getComments = async (req, res) => {

    try {
        
        const { postId } = req.params;

        // Validate the postId
        if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ message: 'Invalid PostID' });
        }

        // Ensure the post exists
        const post = await Post.findById(postId).populate({
            path: 'comments.commentId',
            populate: {
                path: 'userId',
                select: 'username'  // assuming you want to include username in response
            }
        });

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }


         // Extract and format comments
         const comments = post.comments.map(comment => ({
            commentId: comment.commentId._id,
            content: comment.content,
            userId: comment.commentId.userId,
            createdAt: comment.commentId.createdAt,
            updatedAt: comment.commentId.updatedAt,
            upvotes: comment.commentId.upvotes,
            devotes: comment.commentId.devotes,
            parentCommentId: comment.commentId.parentCommentId,
            image: comment.commentId.image
        }));

        return res.status(200).json({
            success: true,
            total_comments: comments.length,
            comments
        });


    } catch (error) {
        console.log("Error while fetching comments' data: ", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }

}


export default getComments;