import path from "path";
import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/commentPictures/');
    },

    filename: function (req, file, cb) {
        const timestamp = Date.now();
        const originalName = path.parse(file.originalname).name; // extract the original filename without extension
        const extension = path.extname(file.originalname); // extract the file extension
        const unique = "Q-D-H-T-E";
        const randomNumber = Math.floor(Math.random() * 10000); // generate a random number between 0 and 9999
        const newFilename = `${originalName}-${unique}-${timestamp}-${randomNumber}${extension}`; // concatenate original name, unique string, timestamp, random number, and extension
        cb(null, newFilename);
    }
});

const upload = multer({ storage: storage })

export default upload;