// As you can see below I am using import instead of require this is beacause I have write a code line of { "type": "module" } in package.json file

import './helpers/cleanupUser.js';
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import userRoutes from "./routes/userRoute.js";
import postRoutes from "./routes/postRoute.js";
import liveSpaceRoutes from "./routes/liveSpaceRoute.js";


/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));


// app.use('/uploads', express.static('uploads'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


/* FILE STORAGE */
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "public/assets"); // Set the destination where files should be stored
    },
    filename: function (req, file, cb) {
      // Create a unique filename with the current timestamp
        cb(null, Date.now() + path.extname(file.originalname));
    },
  });
  const upload = multer({ storage: storage });


  // Configure CORS to allow requests from http://localhost:5173
  const corsOptions = {
  // origin: 'http://localhost:5173',
  // optionsSuccessStatus: 200 // For legacy browser support

    origin: 'http://localhost:5173', // Allow this origin
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,

  };
  app.use(cors(corsOptions));


  // ROUTES
  app.use("/collablearn/user", userRoutes);

  app.use("/collablearn/user", postRoutes);

  app.use("/collablearn", liveSpaceRoutes);



  /* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001;

mongoose.connect(process.env.MONGO_URL)
.then(() => {
    app.listen(PORT, () => console.log(`Server is running on Port: ${PORT}`));

    /* ADD DATA ONE TIME */
    // User.insertMany(users);
    // Post.insertMany(posts);

  }).catch((error) => console.log(`${error} did not connect`));





// import express from "express";
// import bodyParser from "body-parser";
// import mongoose from "mongoose";
// import cors from "cors";
// import dotenv from "dotenv";
// import multer from "multer";
// import helmet from "helmet";
// import morgan from "morgan";
// import path from "path";
// import { fileURLToPath } from "url";
// import userRoutes from "./routes/userRoute.js";
// import postRoutes from "./routes/postRoute.js";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// dotenv.config();
// const app = express();

// app.use(express.json());
// app.use(helmet());
// app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
// app.use(helmet({
//   contentSecurityPolicy: {
//     directives: {
//       ...helmet.contentSecurityPolicy.getDefaultDirectives(),
//       'frame-ancestors': ["'self'"],  // Allow framing from the same origin
//     },
//   },
// }));
// app.use(morgan("common"));
// app.use(bodyParser.json({ limit: "30mb", extended: true }));
// app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
// app.use(cors());

// app.use("/assets", express.static(path.join(__dirname, "public/assets")));
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "public/assets"); // Set the destination where files should be stored
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });
// const upload = multer({ storage: storage });

// app.use("/collablearn/user", userRoutes);
// app.use("/collablearn/user", postRoutes);

// const PORT = process.env.PORT || 6001;
// mongoose.connect(process.env.MONGO_URL)
//   .then(() => {
//     app.listen(PORT, () => console.log(`Server is running on Port: ${PORT}`));
//   }).catch((error) => console.log(`${error} did not connect`));
