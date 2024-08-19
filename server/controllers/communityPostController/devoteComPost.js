import mongoose from "mongoose";
import CommunityPost from "../../models/communityPostModel.js";
import Notification from "../../models/notificationModel.js";
import User from "../../models/userModel.js";

const devoteComPost = async (req , res) => {
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

        const post = await CommunityPost.findByIdAndUpdate(postId, { $addToSet: { devotes: userId } } , {new: true});

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
            message: "Devote has been added to the community post",
            post: post,
            notification: newNotification
        });

    } catch (error) {
        console.log("Error occured while upvoting: ", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}


export { devoteComPost };