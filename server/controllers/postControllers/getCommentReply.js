import mongoose from "mongoose";
import { Comment } from "../../models/postModel.js";

const getCommentReply = async (req, res) => {

    try {
        
        const { commentId } = req.params;

        // Validate the commentId
        if (!commentId || !mongoose.Types.ObjectId.isValid(commentId)) {
            return res.status(400).json({ message: 'Invalid CommentID' });
        }

        // Ensure the comment exists
        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        const comments = await Comment.find({parentCommentId: commentId});

        res.status(200).json({
            success: true,
            message: "Comments reply fetched successfully",
            length: comments.length,
            data: comments
        })

    } catch (error) {
        console.log("Error while fetching comment's reply: ", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }

}

export default getCommentReply;