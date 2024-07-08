import mongoose from "mongoose";
import CommunityPost from "../../models/communityPostModel.js";

const removeComPostDevote = async (req, res) => {

    const { postId } = req.params;
    const userId = req.userId;

    if (!mongoose.Types.ObjectId.isValid(postId) ) {
        return res.status(400).json({ message: 'Invalid postId' });
    }

    try {
        const post = await CommunityPost.findById(postId);

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
            message: 'Devote removed successfully from community post', 
            post 
        });

    } catch (error) {
        return res.status(500).json({ 
            success: false,
            message: 'Server error', error 
        });
    }
}

export { removeComPostDevote };