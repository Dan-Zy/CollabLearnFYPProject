import path from "path";
import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/profilePicture/');
    },

    filename: function (req, file, cb) {
        cb(null,  Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage })

export default upload;








// PROFILE PICTURE CONFIGURATION MULTER
// profilePictureConfig.js
// import multer from 'multer';
// import path from 'path';

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     const dir = path.join(__dirname, 'profilePictures');
//     ensureDirSync(dir);
//     cb(null, dir);
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, uniqueSuffix + path.extname(file.originalname));
//   }
// });

// const fileFilter = (req, file, cb) => {
//   if (!['image/jpeg', 'image/png'].includes(file.mimetype)) {
//     return cb(new Error('Only JPG and PNG images are allowed!'));
//   }
//   cb(null, true);
// };

// export const profilePictureUpload = multer({ 
//   storage: storage, 
//   fileFilter: fileFilter,
//   limits: {
//     fileSize: 1024 * 1024 * 50, // Max file size in bytes (50MB)
//   }
// }).single('profilePicture');
