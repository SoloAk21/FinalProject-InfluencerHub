import express from "express";

import { verifyToken } from "../utils/verifyUser.js";
import {
  updateContent,
  createContent,
  getContentByCampaign,
  getContentByUserId,
} from "../controllers/content.controller.js";

const router = express.Router();

router.post("/create", verifyToken, createContent);
router.get("/content", verifyToken, getContentByUserId);
router.get("/campaign/:campaignId", verifyToken, getContentByCampaign);
// Update Campaign by ID
router.put("/:contentId/status", verifyToken, updateContent);

export default router;
