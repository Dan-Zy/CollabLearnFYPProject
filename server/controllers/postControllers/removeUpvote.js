import mongoose from "mongoose";
import {Post , Comment} from "../../models/postModel.js";

const removePostUpvote = async (req, res) => {

    const { postId } = req.params;
    const userId = req.userId;

    if (!mongoose.Types.ObjectId.isValid(postId) || !mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid postId or userId' });
    }

    try {
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ 
                succes: false,
                message: 'Post not found' 
            });
        }

        if (!post.upvotes.includes(userId)) {
            return res.status(403).json({ 
                success: false,
                message: 'You have not upvoted this post' 
            });
        }

        post.upvotes = post.upvotes.filter(upvoteId => !upvoteId.equals(userId));

        await post.save();
        
        return res.status(200).json({ 
            success: true,
            message: 'Upvote removed successfully', 
            post 
        });

    } catch (error) {
        return res.status(500).json({ 
            success: false,
            message: 'Server error', error 
        });
    }
}


const removeCommentUpvote = async (req, res) => {

    const { commentId } = req.params;
    const userId = req.userId;

    if (!mongoose.Types.ObjectId.isValid(commentId) || !mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ 
            success: false,
            message: 'Invalid commentId or userId' });
    }

    try {
        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({ 
                success: false,
                message: 'Comment not found' });
        }

        if (!comment.upvotes.includes(userId)) {
            return res.status(403).json({ 
                succes: false,
                message: 'You have not upvoted this comment' });
        }

        comment.upvotes = comment.upvotes.filter(upvoteId => !upvoteId.equals(userId));

        await comment.save();

        return res.status(200).json({ 
            success: true,
            message: 'Upvote removed successfully', 
            comment });

    } catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
}


export { removePostUpvote, removeCommentUpvote };