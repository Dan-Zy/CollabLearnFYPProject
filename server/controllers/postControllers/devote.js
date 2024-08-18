import mongoose from "mongoose";
import {Post, Comment} from "../../models/postModel.js";
import Notification from "../../models/notificationModel.js";
import User from "../../models/userModel.js";

const devotePost = async (req , res) => {
    try {
        
        const {postId} = req.params;
        const userId = req.userId;

        // Validate the postId
        if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ 
                success: false,
                message: 'Invalid PostID' 
            });
        }

        // Ensure the post exists
        // const post = await Post.findById(postId);
        // if (!post) {
        //     return res.status(404).json({ 
        //         success: false,
        //         message: 'Post not found' 
        //     });
        // }

        const post = await Post.findByIdAndUpdate(postId, { $addToSet: { devotes: userId } } , {new: true});

        if(!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            })
        }

        const user = await User.findById(userId);

        const newNotification = new Notification({
            userId: userId,
            receivers: [post.userId],
            message: `${user.username} has devoted your post`,
        });

        await newNotification.save();


        res.status(200).json({
            success: true,
            message: "devote has been added to the post",
            post: post,
            notification: newNotification
        })

    } catch (error) {
        console.log("Error occured while upvoting: ", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}



const devoteComment = async (req , res) => {
    try {
        
        const {commentId} = req.params;
        const userId = req.userId;

        // Validate the commentId
        if (!commentId || !mongoose.Types.ObjectId.isValid(commentId)) {
            return res.status(400).json({ 
                success: false,
                message: 'Invalid CommentID' 
            });
        }

        // Ensure the comment exists
        // const post = await Post.findById(postId);
        // if (!post) {
        //     return res.status(404).json({ 
        //         success: false,
        //         message: 'Post not found' 
        //     });
        // }

        const comment = await Comment.findByIdAndUpdate(commentId, { $addToSet: { devotes: userId } } , {new: true});

        if(!comment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found"
            })
        }

        const user = await User.findById(userId);

        const newNotification = new Notification({
            userId: userId,
            receivers: [comment.userId],
            message: `${user.username} has devoted your comment`,
        });

        await newNotification.save();


        res.status(200).json({
            success: true,
            message: "devote has been added to the comment",
            comment: comment,
            notification: newNotification
        })

    } catch (error) {
        console.log("Error occured while upvoting: ", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}


export { devotePost, devoteComment};