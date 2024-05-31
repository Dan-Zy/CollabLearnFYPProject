import mongoose from "mongoose";
import {Post , Comment} from "../../models/postModel.js";

const removePostDevote = async (req, res) => {

    const { postId } = req.params;
    const userId = req.userId;

    if (!mongoose.Types.ObjectId.isValid(postId) ) {
        return res.status(400).json({ message: 'Invalid postId' });
    }

    try {
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ 
                succes: false,
                message: 'Post not found' 
            });
        }

        if (!post.devotes.includes(userId)) {
            return res.status(403).json({ 
                success: false,
                message: 'You have not devoted this post' 
            });
        }

        post.devotes = post.devotes.filter(devoteId => !devoteId.equals(userId));

        await post.save();
        
        return res.status(200).json({ 
            success: true,
            message: 'Devote removed successfully', 
            post 
        });

    } catch (error) {
        return res.status(500).json({ 
            success: false,
            message: 'Server error', error 
        });
    }
}


const removeCommentDevote = async (req, res) => {

    const { commentId } = req.params;
    const userId = req.userId;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        return res.status(400).json({ 
            success: false,
            message: 'Invalid commentId' });
    }

    try {
        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({ 
                success: false,
                message: 'Comment not found' });
        }

        if (!comment.devotes.includes(userId)) {
            return res.status(403).json({ 
                succes: false,
                message: 'You have not devoted this comment' });
        }

        comment.devotes = comment.devotes.filter(devoteId => !devoteId.equals(userId));

        await comment.save();

        return res.status(200).json({ 
            success: true,
            message: 'Devote removed successfully', 
            comment });

    } catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
}


export { removePostDevote, removeCommentDevote };