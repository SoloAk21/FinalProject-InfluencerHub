import express from "express";
import {
  createCampaign,
  getCampaignById,
  updateCampaign,
  deleteCampaign,
  getCampaignsByCompany,
  getCampaignsByInfluencer,
} from "../controllers/campaign.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

// Create Campaign
router.post("/create", verifyToken, createCampaign);

// Get Campaign by ID
router.get("/:campaignId", verifyToken, getCampaignById);
// Get all campaigns specific to a company
router.get("/company/:companyId", verifyToken, getCampaignsByCompany);
router.get("/influencer/:influencerId", verifyToken, getCampaignsByInfluencer);
// Update Campaign by ID
router.put("/:campaignId/status", verifyToken, updateCampaign);

// Delete Campaign by ID
router.delete("/:campaignId", verifyToken, deleteCampaign);

export default router;
