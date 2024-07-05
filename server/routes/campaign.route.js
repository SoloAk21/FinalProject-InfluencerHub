import express from "express";
import {
  createCampaign,
  getCampaignById,
  updateCampaign,
  deleteCampaign,
} from "../controllers/campaign.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

// Create Campaign
router.post("/create", verifyToken, createCampaign);

// Get Campaign by ID
router.get("/:campaignId", verifyToken, getCampaignById);

// Update Campaign by ID
router.put("/:campaignId", verifyToken, updateCampaign);

// Delete Campaign by ID
router.delete("/:campaignId", verifyToken, deleteCampaign);

export default router;
