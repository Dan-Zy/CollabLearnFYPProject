import fs from 'fs';
import mongoose from 'mongoose';
import { Comment } from '../../models/postModel.js';
import CommunityPost from '../../models/communityPostModel.js';

export const addComPostComment = async (req, res) => {
    try {
        const { postId } = req.params;
        const { content } = req.body;
        const image = req.file ? req.file.path : "";

        // Validate the postId
        if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ 
                success: false,
                message: 'Invalid PostID' 
            });
        }

        // Ensure the post exists
        const post = await CommunityPost.findById(postId);
        if (!post) {
            return res.status(404).json({ 
                success: false,
                message: 'Post not found' 
            });
        }

        if (!content) {
            return res.status(400).json({
                success: false,
                message: "Content is required"
            });
        }

        const contentLength = content.split(/\s+/).length;
        if (contentLength > 500) {
            return res.status(406).json({
                success: false,
                message: "Content length must not exceed 500 words"
            });
        }

        // Check if image is provided, validate its format and size
        if (image) {
            const validFormats = ['image/jpeg', 'image/png'];
            const imageSize = fs.statSync(image).size;
            const imageFormat = req.file.mimetype;

            if (!validFormats.includes(imageFormat)) {
                return res.status(406).json({
                    success: false,
                    message: "Given format is not accepted, only JPG and PNG are allowed"
                });
            }

            if (imageSize > 50 * 1024 * 1024) { // Image size more than 50MB
                return res.status(406).json({
                    success: false,
                    message: "Image size must not exceed 50MB"
                });
            }
        }

        const newComment = new Comment({
            userId: req.userId,
            parentCommentId: null,
            content,
            image,
            upvotes: [],
            devotes: [],
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        await newComment.save();

        // Add the comment ID and content to the corresponding post's comments array
        post.comments.push({
            commentId: newComment._id,
            content: newComment.content
        });
        
        await post.save();

        res.status(201).json({
            success: true,
            message: "Comment added successfully to the community post",
            comment: newComment
        });

    } catch (error) {
        console.log("Error while adding comment: ", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}
