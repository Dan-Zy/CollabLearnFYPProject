import {Post} from "../models/postModel.js";

const deletePost = async (req, res) => {
    try {
        
        const {postId} = req.params;

        const post = await Post.findById(postId);
        const userId = req.userId;

        if(!post){
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        if(post.userId.toString() !== userId){
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this post"
            });
        }

        await Post.deleteOne({_id: postId});

        res.status(200).json({
            success: true,
            message: "Post has been deleted Successfully"
        });


    } catch (error) {
        console.log("Error in deleting post: ", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

export default deletePost;