// import multer from "multer";
// import path from "path";
// import fs from "fs";


// // Utility to ensure directory existence
// const ensureDirSync = (dirPath) => {
//     if (!fs.existsSync(dirPath)) {
//       fs.mkdirSync(dirPath, { recursive: true });
//     }
//   }
  
//   // Custom storage engine
//   const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       let dir = '';
//       // Adjust directory paths based on the fieldname
//       if (file.fieldname === 'picture') {
//         dir = path.join(__dirname, 'uploads', 'postImages');
//       } else if (file.fieldname === 'document') {
//         dir = path.join(__dirname, 'uploads', 'postDocuments');
//       } else if (file.fieldname === 'video') {
//         dir = path.join(__dirname, 'uploads', 'postVideos');
//       }
//       ensureDirSync(dir);  // Ensure the directory exists
//       cb(null, dir);       // Pass the directory to Multer
//     },
//     filename: function (req, file, cb) {
//       const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9); // Create a unique suffix for the filename
//       cb(null, uniqueSuffix + path.extname(file.originalname));  // Construct the full filename and pass it to Multer
//     }
//   });
  
  
//   // File filter
//   const fileFilter = (req, file, cb) => {
//     const fileSize = parseInt(req.headers['content-length']); // Get the file size from headers
  
//     if (file.fieldname === 'picture') {
//       if (!['image/jpeg', 'image/png'].includes(file.mimetype)) {
//         return cb(new Error('Only JPG and PNG images are allowed!'));
//       }
//       if (fileSize > 1024 * 1024 * 50) { // Limit for pictures: 50MB
//         return cb(new Error('Picture size should be less than 50MB!'));
//       }
//     } else if (file.fieldname === 'document') {
//       if (!['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'].includes(file.mimetype)) {
//         return cb(new Error('Only PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX documents are allowed!'));
//       }
//       if (fileSize > 1024 * 1024 * 150) { // Limit for documents: 150MB
//         return cb(new Error('Document size should be less than 150MB!'));
//       }
//     } else if (file.fieldname === 'video') {
//       if (file.mimetype !== 'video/mp4') {
//         return cb(new Error('Only MP4 videos are allowed!'));
//       }
//       if (fileSize > 1024 * 1024 * 300) { // Limit for videos: 300MB
//         return cb(new Error('Video size should be less than 300MB!'));
//       }
//     } else {
//       return cb(new Error('Invalid file type!'));
//     }
  
//     cb(null, true);
//   };
  
//   export const upload = multer({ 
//     storage: storage, 
//     fileFilter: fileFilter,
//     // limits: {
//     //   fileSize: 1024 * 1024 * 300, // Max file size in bytes (300MB)
//     // }
//   }).fields([
//     { name: 'picture', maxCount: 1 },
//     { name: 'document', maxCount: 1 },
//     { name: 'video', maxCount: 1 }
//   ]);





import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === "image") {
            cb(null, 'uploads/postImages');
        } else if (file.fieldname === "document") {
            cb(null, 'uploads/postDocuments');
        } else if (file.fieldname === "video") {
            cb(null, 'uploads/postVideos');
        } else {
            cb({ error: 'Unsupported file type' }, false);
        }
    },
    filename: (req, file, cb) => {
        const timestamp = Date.now();
        const originalName = path.parse(file.originalname).name; // extract the original filename without extension
        const extension = path.extname(file.originalname); // extract the file extension
        const unique = "Q-D-H-T-E";
        const randomNumber = Math.floor(Math.random() * 10000); // generate a random number between 0 and 9999
        const newFilename = `${originalName}-${unique}-${timestamp}-${randomNumber}${extension}`; // concatenate original name, unique string, timestamp, random number, and extension
        cb(null, newFilename);
    }
});



// I AM NOT USING THIS TO CHECK MY POST'S IMAGE, DOCUMENT AND VIDEO FILES EXTENSION AND SIZE. I AM CHECKING IT ON MY UPLOADPOST.JS FILE


// const fileFilter = (req, file, cb) => {
//     if (file.fieldname === "image" && !file.originalname.match(/\.(jpg|jpeg|png)$/)) {
//         return cb(new Error('Only image files are allowed!'), false);
//     }
//     if (file.fieldname === "document" && !file.originalname.match(/\.(pdf|doc|docx)$/)) {
//         return cb(new Error('Only document files are allowed!'), false);
//     }
//     if (file.fieldname === "video" && !file.originalname.match(/\.(mp4)$/)) {
//         return cb(new Error('Only video files are allowed!'), false);
//     }
//     cb(null, true);
// };

// const upload = multer({ storage: storage, fileFilter: fileFilter });
const uploadP = multer({ storage: storage });

export default uploadP;