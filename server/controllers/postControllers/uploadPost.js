// import express from "express";
// import { upload } from "../config/postMulter.js";
// import { Post } from "../models/postModel.js";
// import multer from "multer";

// export const uploadPost = (req, res, next) => {
//     upload(req, res, async (err) => {
//         if (err) {
//             // Handle Multer-specific errors
//             if (err instanceof multer.MulterError) {
//                 return res.status(400).json({ error: `Multer error: ${err.message}` });
//             } else {
//                 return res.status(400).json({ error: `File upload error: ${err.message}` });
//             }
//         }

//         try {
//             // Retrieve userId from authenticated session or JWT
//             const userId = req.user._id;
//             const { content } = req.body;

//             // Check for minimum required information: at least content
//             if (!content) {
//                 return res.status(400).json({ error: 'Content is required for the post.' });
//             }

//             // Access the uploaded files, if any
//             const pictures = req.files['picture'] ? req.files['picture'][0].filename : "";
//             const documents = req.files['document'] ? req.files['document'][0].filename : "";
//             const videos = req.files['video'] ? req.files['video'][0].filename : "";

//             // Create a new post object using the model
//             const newPost = new Post({
//                 userId,
//                 content,
//                 image: pictures,
//                 document: documents,
//                 video: videos
//             });

//             // Save the new post to the database
//             await newPost.save();

//             // Respond to the client
//             res.status(201).json({
//                 message: 'New post created successfully',
//                 post: newPost
//             });
//         } catch (err) {
//             // Handle potential errors during database operations
//             if (err.name === 'ValidationError') {
//                 return res.status(400).json({ error: `Validation error: ${err.message}` });
//             } else {
//                 return res.status(500).json({ error: `Internal server error: ${err.message}` });
//             }
//         }
//     });

// };




import { Post } from "../../models/postModel.js";
import Notification from "../../models/notificationModel.js";
import User from "../../models/userModel.js";
import fs from "fs";

export const uploadPost = async (req, res) => {
    try {
        const userId = req.userId;
        const { content } = req.body;
        const image = req.files.image ? req.files.image[0].path : "";
        const document = req.files.document ? req.files.document[0].path : "";
        const video = req.files.video ? req.files.video[0].path : "";

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
            const imageFormat = req.files.image[0].mimetype;

            if (!validFormats.includes(imageFormat)) {
                return res.status(406).json({
                    success: false,
                    message: "Given format is not accepted, only JPG and PNG are allowed"
                });
            }

            if (imageSize > 50 * 1024 * 1024) { // Image size more than 50MB
                return res.status(406).json({
                    success: false,
                    message: "Image size must not exceed 50MBs"
                });
            }
        }


        // Document validation
        if (document) {
            const validDocumentFormats = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
            const documentSize = fs.statSync(document).size;
            const documentFormat = req.files.document[0].mimetype;

            if (!validDocumentFormats.includes(documentFormat)) {
                return res.status(406).json({
                    success: false,
                    message: "Document format not accepted. Allowed formats are PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX."
                });
            }

            if (documentSize > 150 * 1024 * 1024) { // Document size more than 150MB
                return res.status(406).json({
                    success: false,
                    message: "Document size must not exceed 150MBs"
                });
            }
        }


        // Video validation
        if (video) {
            const validVideoFormats = ['video/mp4'];
            const videoSize = fs.statSync(video).size;
            const videoFormat = req.files.video[0].mimetype;

            if (!validVideoFormats.includes(videoFormat)) {
                return res.status(406).json({
                    success: false,
                    message: "Video format not accepted. Only MP4 is allowed."
                });
            }

            if (videoSize > 300 * 1024 * 1024) { // Video size more than 300MB
                return res.status(406).json({
                    success: false,
                    message: "Video size must not exceed 300MBs"
                });
            }
        }
        
        const newPost = new Post({
            userId: req.userId,
            content,
            image,
            document,
            video,
            upvotes: [],
            devotes: [],
            comments: [],
            shares: [],
            visibility: "Public",
            createdAt: new Date(),
            updatedAt: new Date()
        });

        await newPost.save();

        const user = await User.findById(userId);

        const newNotification = new Notification({
            userId: userId,
            receivers: user.collablers,
            message: `${user.username} has uploaded a post`,
        });

        await newNotification.save();

        res.status(201).json({
            success: true,
            message: "Post uploaded successfully",
            post: newPost,
            notification: newNotification
        });
        
    } catch (error) {
        console.error("Error uploading post:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

