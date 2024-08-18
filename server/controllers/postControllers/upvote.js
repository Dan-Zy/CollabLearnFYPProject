import mongoose from "mongoose";
import {Post, Comment} from "../../models/postModel.js";
import Notification from "../../models/notificationModel.js";
import User from "../../models/userModel.js";

const upvotePost = async (req , res) => {
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

        
        // Fetch the post
        const post = await Post.findById(postId);

        // Check if the post exists
        if (!post) {
            return res.status(404).json({ 
                success: false,
                message: 'Post not found' 
            });
        }


        // Check if the user has already upvoted the post
        if (post.upvotes.includes(userId)) {
            return res.status(400).json({
                success: false,
                message: 'You have already upvoted this post'
            });
        }

        // Add the upvote
        post.upvotes.push(userId);
        await post.save();

        const user = await User.findById(userId);

        const newNotification = new Notification({
            userId: userId,
            receivers: [post.userId],
            message: `${user.username} has upvoted your post`,
        });

        await newNotification.save();

        res.status(200).json({
            success: true,
            message: 'Upvote has been added to the post',
            post: post,
            notification: newNotification
        });



        // const post = await Post.findByIdAndUpdate(postId, { $addToSet: { upvotes: userId } } , {new: true});

        // if(!post) {
        //     return res.status(404).json({
        //         success: false,
        //         message: "Post not found"
        //     })
        // }


        // res.status(200).json({
        //     success: true,
        //     message: "Upvote has been added to the post",
        //     post: post
        // })

    } catch (error) {
        console.log("Error occured while upvoting: ", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}



const upvoteComment = async (req , res) => {
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
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ 
                success: false,
                message: 'Comment not found' 
            });
        }

        if(comment.upvotes.includes(userId)){
            return res.status(400).json({
                success: false,
                message: "You have already upvoted this comment"
            });
        }


        comment.upvotes.push(userId);
        await comment.save();

        const user = await User.findById(userId);

        const newNotification = new Notification({
            userId: userId,
            receivers: [comment.userId],
            message: `${user.username} has upvoted your comment`,
        });

        await newNotification.save();

        res.status(201).json({
            success: true,
            message: "Upvote has been added to the comment",
            notification: newNotification
        });

        


        // const comment = await Comment.findByIdAndUpdate(commentId, { $addToSet: { upvotes: userId } } , {new: true});

        // if(!comment) {
        //     return res.status(404).json({
        //         success: false,
        //         message: "Comment not found"
        //     })
        // }


        // res.status(200).json({
        //     success: true,
        //     message: "Upvote has been added to the comment",
        //     comment: comment
        // })

    } catch (error) {
        console.log("Error occured while upvoting: ", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}


export { upvotePost, upvoteComment};