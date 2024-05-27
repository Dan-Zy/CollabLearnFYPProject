import { Post } from "../../models/postModel.js";

export const getPosts = async (req, res) => {
    try {
        
        const posts = await Post.find().populate('userId').sort({createdAt: -1});
        res.status(200).json({
            success: true,
            posts
        });

    } catch (error) {
        console.log("Error while fetching posts' data: ", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}