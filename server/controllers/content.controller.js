import mongoose from "mongoose";
import Campaign from "../models/campaign.model.js";
import Content from "../models/content.model.js";
import { ObjectId } from "mongodb";

// Create Content
export const createContent = async (req, res) => {
  const { influencerId, companyId, campaignId, contents } = req.body;

  try {
    let campaignContent = await Content.findOne({ campaign: campaignId });

    if (campaignContent) {
      // Merge the new contents into existing campaignContent
      campaignContent.contents.push(...contents); // Spread contents array into push method
      await campaignContent.save();
    } else {
      campaignContent = await Content.create({
        influencer: influencerId,
        company: companyId,
        campaign: campaignId,
        contents,
      });
    }

    res.status(200).json({ message: "Content added successfully" });
  } catch (error) {
    console.error("Error adding content:", error);
    res.status(500).json({ error: "Failed to add content" });
  }
};

// Get Content by ID
export const getContentById = async (req, res) => {
  const { contentId } = req.params;

  try {
    const content = await Content.findById(contentId);
    if (!content) {
      return res.status(404).json({ error: "Content not found" });
    }

    res.status(200).json(content);
  } catch (error) {
    console.error("Error fetching content:", error);
    res.status(500).json({ error: "Failed to fetch content" });
  }
};

export const getContentByUserId = async (req, res) => {
  const userId = req.user.userId;
  const userModel = req.user.model;

  const userField = userModel === "Company" ? "company" : "influencer";

  try {
    const content = await Content.find({
      [userField]: userId,
    })
      .populate({
        path: "campaign",
        populate: [
          { path: "influencer", select: "-password" },
          { path: "company", select: "-password" },
        ],
      })
      .select("-__v"); // Exclude version field for cleaner data

    if (!content || content.length === 0) {
      return res.status(404).json({ error: "Content not found" });
    }

    res.status(200).json(content);
  } catch (error) {
    console.error("Error fetching content:", error);
    res.status(500).json({ error: "Failed to fetch content" });
  }
};

// Get Content by Campaign ID
export const getContentByCampaign = async (req, res) => {
  const { campaignId } = req.params;

  try {
    const content = await Content.find({ campaign: campaignId }).populate({
      path: "campaign",
      populate: [
        { path: "influencer", model: "Influencer" },
        { path: "company", model: "Company" },
      ],
    });

    if (!content || content.length === 0) {
      return res
        .status(404)
        .json({ error: "Content not found for this campaign" });
    }

    res.status(200).json(content);
  } catch (error) {
    console.error("Error fetching content by campaign:", error);
    res.status(500).json({ error: "Failed to fetch content by campaign" });
  }
};

// Update content status by content ID
export const updateContent = async (req, res) => {
  const { contentId } = req.params;

  const { status, selectedSingleContent } = req.body;

  try {
    // Find the content by ID
    const content = await Content.findById(contentId);
    if (!content) {
      return res.status(404).json({ error: "Content not found" });
    }

    // Find the specific content item within contents array
    const contentItem = content.contents.find(
      (item) => item._id.toString() === selectedSingleContent
    );

    if (!contentItem) {
      return res.status(404).json({ error: "Content item not found" });
    }

    // Update the status of the content item
    contentItem.status = status;

    // Save the updated content
    await content.save();
    res.json({ message: "Content status updated successfully", content });
  } catch (error) {
    console.error("Error updating content status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete Content by ID
export const deleteContent = async (req, res) => {
  const { contentId } = req.params;

  try {
    const deletedContent = await Content.findByIdAndDelete(contentId);

    if (!deletedContent) {
      return res.status(404).json({ error: "Content not found" });
    }

    res.status(200).json({ message: "Content deleted successfully" });
  } catch (error) {
    console.error("Error deleting content:", error);
    res.status(500).json({ error: "Failed to delete content" });
  }
};
