import mongoose from "mongoose";
import Campaign from "../models/campaign.model.js";

export const createCampaign = async (req, res) => {
  const { companyId, influencerId } = req.body;
  console.log(req.body);

  try {
    const campaign = new Campaign({
      company: companyId,
      influencer: influencerId,
      ...req.body,
    });

    await campaign.save();
    res.status(201).json(campaign);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const getCampaignsByCompany = async (req, res) => {
  try {
    const { companyId } = req.params;
    const page = parseInt(req.query.page) || 1; // Current page, default to 1
    const pageSize = parseInt(req.query.pageSize) || 10; // Number of items per page, default to 10

    const totalCampaigns = await Campaign.countDocuments({
      company: companyId,
    });
    const totalPages = Math.ceil(totalCampaigns / pageSize);

    const campaigns = await Campaign.find({ company: companyId })
      .populate("influencer company")
      .skip((page - 1) * pageSize) // Skip previous pages
      .limit(pageSize); // Limit results per page

    res.json({
      campaigns: campaigns,
      totalPages: totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    res.status(500).json({ message: "Failed to fetch campaigns" });
  }
};

export const getCampaignsByInfluencer = async (req, res) => {
  try {
    const { influencerId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    const totalCampaigns = await Campaign.countDocuments({
      influencer: influencerId,
    });
    const totalPages = Math.ceil(totalCampaigns / pageSize);

    const campaigns = await Campaign.find({ influencer: influencerId })
      .populate("company influencer")
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    res.json({
      campaigns: campaigns,
      totalPages: totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    res.status(500).json({ message: "Failed to fetch campaigns" });
  }
};

// Get Campaign by ID
export const getCampaignById = async (req, res) => {
  const { campaignId } = req.params;
  try {
    const campaign = await Campaign.findById(campaignId)
      .populate("company")
      .populate("influencer");
    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }
    res.json(campaign);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Campaign by ID
export const updateCampaign = async (req, res) => {
  const { campaignId } = req.params;
  const { status } = req.body;

  try {
    const updatedCampaign = await Campaign.findByIdAndUpdate(
      campaignId,
      { status },
      { new: true }
    );

    if (!updatedCampaign) {
      return res.status(404).json({ error: "Campaign not found" });
    }

    res.json(updatedCampaign);
  } catch (error) {
    console.error("Error updating campaign status:", error);
    res.status(500).json({ error: "Failed to update campaign status" });
  }
};

// Delete Campaign by ID
export const deleteCampaign = async (req, res) => {
  const { campaignId } = req.params;
  try {
    const deletedCampaign = await Campaign.findByIdAndDelete(campaignId);
    if (!deletedCampaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }
    res.json({ message: "Campaign deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
