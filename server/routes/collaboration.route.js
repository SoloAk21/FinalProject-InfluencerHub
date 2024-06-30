import express from "express";

import { verifyToken } from "../utils/verifyUser.js";
import {
  checkCollabStatus,
  findCollabIdBetweenUsers,
  respondToCollaborationRequest,
  sendCollaborationRequest,
} from "../controllers/collaboration.controller.js";

const router = express.Router();

router.post("/send", verifyToken, sendCollaborationRequest);
router.post("/respond", verifyToken, respondToCollaborationRequest);
router.post("/status", verifyToken, checkCollabStatus);
router.post("/findid", verifyToken, findCollabIdBetweenUsers);

export default router;
