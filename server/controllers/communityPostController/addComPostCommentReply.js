import fs from "fs";
import mongoose from "mongoose";
import { Comment } from "../../models/postModel.js";


const addComPostCommentReply = async (req, res) => {

    try {
        
        const { commentId } = req.params;
        const { content } = req.body;
        const image = req.file ? req.file.path : "";

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
            parentCommentId: commentId,
            content,
            image,
            upvotes: [],
            devotes: [],
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        await newComment.save();

        res.status(201).json({
            success: true,
            message: "Comment reply added successfully",
            comment: newComment
        })


    } catch (error) {
        console.log("Error while adding reply: ", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }

}

export default addCommentReply;