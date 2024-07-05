import Campaign from "../models/campaign.model.js";

// Create Campaign
export const createCampaign = async (req, res) => {
  try {
    const campaign = new Campaign(req.body);
    await campaign.save();
    res.status(201).json(campaign);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Campaign by ID
export const getCampaignById = async (req, res) => {
  const { campaignId } = req.params;
  try {
    const campaign = await Campaign.findById(campaignId);
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
  try {
    const updatedCampaign = await Campaign.findByIdAndUpdate(
      campaignId,
      req.body,
      { new: true }
    );
    if (!updatedCampaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }
    res.json(updatedCampaign);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
