import express from "express";

import { verifyToken } from "../utils/verifyUser.js";
import {
  checkCollabStatus,
  respondToCollaborationRequest,
  sendCollaborationRequest,
} from "../controllers/collaboration.controller.js";

const router = express.Router();

router.post("/send", verifyToken, sendCollaborationRequest);
router.post("/respond", verifyToken, respondToCollaborationRequest);
router.post("/status", verifyToken, checkCollabStatus);

export default router;
