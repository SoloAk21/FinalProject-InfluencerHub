import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  createContent,
  getContentById,
  updateContent,
  deleteContent,
  getContentByCampaign,
} from "../controllers/content.controller.js";

const router = express.Router();

// Create Content
router.post("/create", verifyToken, createContent);
// Get Content by ID
router.get("/get:contentId", verifyToken, getContentById);

// Get Content by Campaign ID
router.get("/:campaignId", verifyToken, getContentByCampaign);

// Update Content by ID
router.put("/:contentId", verifyToken, updateContent);

// Delete Content by ID
router.delete("/:contentId", verifyToken, deleteContent);

export default router;
