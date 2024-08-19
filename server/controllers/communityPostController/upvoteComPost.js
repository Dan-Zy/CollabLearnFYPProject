import mongoose from "mongoose";
import CommunityPost from "../../models/communityPostModel.js";
import Notification from "../../models/notificationModel.js";
import User from "../../models/userModel.js";

const upvoteComPost = async (req , res) => {
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
        const post = await CommunityPost.findById(postId);

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

        // Populate the userId field in the notification with the required fields
        // const populatedNotification = await Notification.findById(newNotification._id).populate({
        //     path: 'userId',
        //     select: 'username role profilePicture'
        // });

        res.status(200).json({
            success: true,
            message: 'Upvote has been added to the community post',
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
        console.log("Error occured while upvoting community post: ", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}


export { upvoteComPost };