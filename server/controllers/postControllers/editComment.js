import { Comment } from "../../models/postModel.js";
import fs from "fs";

const editComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const userId = req.userId;
        const { content } = req.body;
        const image = req.file ? req.file.path : "";

        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found"
            });
        }

        if (comment.userId.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to edit this comment"
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

            if (imageSize > 50 * 1024 * 1024) {
                return res.status(406).json({
                    success: false,
                    message: "Image size must not exceed 50MBs"
                });
            }

            // Delete the old image file if it exists
            // if (comment.image) {
            //     fs.unlink(comment.image, (err) => {
            //         if (err) console.log("Failed to delete old image:", err);
            //     });
            // }

            
        }

        // Edit Comment Data
        comment.content = content;
        comment.updatedAt = new Date();
        comment.image = image;

        await comment.save();

        res.status(200).json({
            success: true,
            message: "Comment has been edited successfully",
            comment: comment
        });

    } catch (error) {
        console.log("Error while editing comment: ", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

export default editComment;
