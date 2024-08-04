import express from "express";
import sendCollabRequest from "../controllers/collablerControllers/sendCollabRequest.js";
import { verifyToken } from "../middlewares/authorization.js";
import acceptCollabRequest from "../controllers/collablerControllers/acceptCollabRequest.js";

const router = express.Router();

router.post("/sendCollabRequest/:userId", verifyToken, sendCollabRequest);

router.put("/acceptCollabRequest/:userId", verifyToken, acceptCollabRequest);

export default router;