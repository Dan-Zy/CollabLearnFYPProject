import express from "express";
import sendCollabRequest from "../controllers/collablerControllers/sendCollabRequest.js";
import { verifyToken } from "../middlewares/authorization.js";

const router = express.Router();

router.post("/sendCollabRequest/:userId", verifyToken, sendCollabRequest);


export default router;