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


const uploadCommunityPost = multer({ storage: storage });

export default uploadCommunityPost;