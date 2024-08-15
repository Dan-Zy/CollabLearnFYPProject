import express from "express";
import { verifyToken } from "../middlewares/authorization.js";
import sendCollabRequest from "../controllers/collablerControllers/sendCollabRequest.js";
import acceptCollabRequest from "../controllers/collablerControllers/acceptCollabRequest.js";
import cancelCollabRequest from "../controllers/collablerControllers/cancelCollabRequest.js";
import removeCollabRequest from "../controllers/collablerControllers/removeCollabRequest.js";

const router = express.Router();

router.post("/sendCollabRequest/:userId", verifyToken, sendCollabRequest);

router.put("/acceptCollabRequest/:userId", verifyToken, acceptCollabRequest);

router.put("/cancelCollabRequest/:userId", verifyToken, cancelCollabRequest);

router.put("/removeCollabRequest/:userId", verifyToken, removeCollabRequest);

export default router;