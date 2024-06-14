import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === "profilePhoto") {
            cb(null, 'uploads/profilePicture');
        } else if (file.fieldname === "coverPhoto") {
            cb(null, 'uploads/coverPicture');
        } else {
            cb(new Error('Unsupported file type'), false);
        }
    },
    filename: (req, file, cb) => {
        const timestamp = Date.now();
        const originalName = path.parse(file.originalname).name;
        const extension = path.extname(file.originalname);
        const unique = "Q-D-H-T-E";
        const randomNumber = Math.floor(Math.random() * 10000);
        const newFilename = `${originalName}-${unique}-${timestamp}-${randomNumber}${extension}`;
        cb(null, newFilename);
    }
});

const uploadPfpCvP = multer({ storage: storage });

export default uploadPfpCvP;
