import mongoose from "mongoose";
import { Post, Comment } from "../../models/postModel.js";
import Notification from "../../models/notificationModel.js";
import User from "../../models/userModel.js";

const devotePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.userId;

        // Validate the postId
        if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ 
                success: false,
                message: 'Invalid PostID' 
            });
        }

        const post = await Post.findByIdAndUpdate(postId, { $addToSet: { devotes: userId } }, { new: true });

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        const user = await User.findById(userId).populate("username").populate("profilePicture").populate("role");

        const newNotification = new Notification({
            userId: userId,
            receivers: [post.userId],
            message: `${user.username} has devoted your post`,
        });

        await newNotification.save();

        // Populate the userId field in the notification with the required fields
        const populatedNotification = await Notification.findById(newNotification._id).populate({
            path: 'userId',
            select: 'username role profilePicture'
        });

        res.status(200).json({
            success: true,
            message: "Devote has been added to the post",
            post: post,
            notification: populatedNotification
        });
    } catch (error) {
        console.log("Error occurred while devoting the post: ", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const devoteComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const userId = req.userId;

        // Validate the commentId
        if (!commentId || !mongoose.Types.ObjectId.isValid(commentId)) {
            return res.status(400).json({ 
                success: false,
                message: 'Invalid CommentID' 
            });
        }

        const comment = await Comment.findByIdAndUpdate(commentId, { $addToSet: { devotes: userId } }, { new: true });

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found"
            });
        }

        const user = await User.findById(userId).populate("username").populate("profilePicture").populate("role");

        const newNotification = new Notification({
            userId: userId,
            receivers: [comment.userId],
            message: `${user.username} has devoted your comment`,
        });

        await newNotification.save();

        // Populate the userId field in the notification with the required fields
        const populatedNotification = await Notification.findById(newNotification._id).populate({
            path: 'userId',
            select: 'username role profilePicture'
        });

        res.status(200).json({
            success: true,
            message: "Devote has been added to the comment",
            comment: comment,
            notification: populatedNotification
        });
    } catch (error) {
        console.log("Error occurred while devoting the comment: ", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export { devotePost, devoteComment };
