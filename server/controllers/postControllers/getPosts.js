import { Post } from "../../models/postModel.js";
import User from "../../models/userModel.js";

export const getPosts = async (req, res) => {
    try {
        const userId = req.userId;  // Already set by verifyBearerToken middleware
        const user = req.user;      // Already set by verifyBearerToken middleware

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Get the list of collaborator IDs
        const collablersIds = user.collablers.map(collabler => collabler._id);

        // Query to find posts
        const posts = await Post.find({
            $or: [
                { userId: userId },  // User's own posts
                {  // Posts from collablers with specific post types
                    userId: { $in: collablersIds },
                    $or: [
                        { postType: 'General' },  // General posts
                        { postType: user.role }   // Posts matching user's role
                    ]
                }
            ]
        })
        .populate('userId', 'username profilePicture')
        .populate('originalAuthor', 'username')
        .sort({ createdAt: -1 });  // Sort by creation date

        res.status(200).json({
            success: true,
            message: "Posts fetched successfully",
            length: posts.length,
            posts
        });

    } catch (error) {
        console.log("Error while fetching posts' data: ", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
