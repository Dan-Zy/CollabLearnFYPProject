import { Comment , Post } from "../../models/postModel.js";

const deleteComment = async (req, res) => {
    try {
        
        const {commentId} = req.params;
        const userId = req.userId;

        const comment = await Comment.findById(commentId);

        if(!comment){
            return res.status(400).json({
                success: false,
                message: "Comment not found"
            });
        }

        if(comment.userId.toString() !== userId){
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this comment"
            });
        }

        // Find the post that contains the comment
        const post = await Post.findOne({ "comments.commentId": commentId });

        if (post) {
            // Remove the commentId from the comments array
            post.comments = post.comments.filter(comment => comment.commentId.toString() !== commentId);
            await post.save();
        }

        await comment.deleteOne({_id: commentId});

        res.status(200).json({
            success: true,
            message: "Comment has been deleted successfully"
        });

    } catch (error) {
        console.log("Error while deleting comment: ", error);
        return res.status(500).json({
            success: true,
            messsage: "Internal server error"
        });
    }
}

export default deleteComment;