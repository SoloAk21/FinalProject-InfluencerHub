import express from "express";

import { verifyToken } from "../utils/verifyUser.js";
import {
  checkCollabStatus,
  findCollabIdBetweenUsers,
  getCollaborationsByUserType,
  respondToCollaborationRequest,
  sendCollaborationRequest,
} from "../controllers/collaboration.controller.js";

const router = express.Router();

router.post("/send", verifyToken, sendCollaborationRequest);
router.post("/respond", verifyToken, respondToCollaborationRequest);
router.post("/status", verifyToken, checkCollabStatus);
router.post("/findid", verifyToken, findCollabIdBetweenUsers);
router.get("/", verifyToken, getCollaborationsByUserType);
// Route for accepting collaboration

export default router;
