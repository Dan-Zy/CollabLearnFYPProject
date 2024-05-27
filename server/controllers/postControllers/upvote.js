import mongoose from "mongoose";
import {Post, Comment} from "../../models/postModel.js";

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

        // Ensure the post exists
        // const post = await Post.findById(postId);
        // if (!post) {
        //     return res.status(404).json({ 
        //         success: false,
        //         message: 'Post not found' 
        //     });
        // }

        const post = await Post.findByIdAndUpdate(postId, { $addToSet: { upvotes: userId } } , {new: true});

        if(!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            })
        }


        res.status(200).json({
            success: true,
            message: "Upvote has been added to the post",
            post: post
        })

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
        // const post = await Post.findById(postId);
        // if (!post) {
        //     return res.status(404).json({ 
        //         success: false,
        //         message: 'Post not found' 
        //     });
        // }

        const comment = await Comment.findByIdAndUpdate(commentId, { $addToSet: { upvotes: userId } } , {new: true});

        if(!comment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found"
            })
        }


        res.status(200).json({
            success: true,
            message: "Upvote has been added to the comment",
            comment: comment
        })

    } catch (error) {
        console.log("Error occured while upvoting: ", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}


export { upvotePost, upvoteComment};