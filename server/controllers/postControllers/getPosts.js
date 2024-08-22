import { Post } from "../../models/postModel.js";
import User from "../../models/userModel.js";  // Import User model
import jwt from "jsonwebtoken";  // Import jsonwebtoken

export const getPosts = async (req, res) => {
    try {
        // Extract the token from the Authorization header
        let token = req.header("Authorization");
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized Access. Token is missing"
            });
        }

        // Remove 'Bearer ' prefix if it exists
        token = token.split(" ")[1];

        // Decode the token to get the user ID
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        // Fetch the user data along with their collablers
        const user = await User.findById(userId).populate('collablers');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Filter posts: Include posts from the user and their collablers, 
        // and where the postType is "General" or matches the user's role
        const posts = await Post.find({
            $or: [
                { userId: { $in: [...user.collablers, userId] } },  // Posts from collablers and the user
                { postType: 'General' },                            // Posts of type "General"
                { postType: user.role }                             // Posts matching the user's role
            ]
        })
        .populate('userId', 'username profilePicture')
        .populate('originalAuthor', 'username')
        .sort({ createdAt: -1 });  // Sort by creation date

        res.status(200).json({
            success: true,
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
