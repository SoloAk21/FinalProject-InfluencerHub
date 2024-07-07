import Campaign from "../models/campaign.model.js";
import Content from "../models/content.model.js";

// Create Content
export const createContent = async (req, res) => {
  const { campaignId, contents } = req.body;

  try {
    let campaignContent = await Content.findOne({ campaign: campaignId });

    if (campaignContent) {
      // Merge the new contents into existing campaignContent
      campaignContent.contents.push(...contents); // Spread contents array into push method
      await campaignContent.save();
    } else {
      campaignContent = await Content.create({
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

// Get Content by Campaign ID
export const getContentByCampaign = async (req, res) => {
  const { campaignId } = req.params;

  try {
    const content = await Content.find({ campaign: campaignId });

    res.status(200).json(content);
  } catch (error) {
    console.error("Error fetching content by campaign:", error);
    res.status(500).json({ error: "Failed to fetch content by campaign" });
  }
};

// Update Content by ID
export const updateContent = async (req, res) => {
  const { contentId } = req.params;
  const { type, content } = req.body;

  try {
    const updatedContent = await Content.findByIdAndUpdate(
      contentId,
      { type, content },
      { new: true }
    );

    if (!updatedContent) {
      return res.status(404).json({ error: "Content not found" });
    }

    res.status(200).json(updatedContent);
  } catch (error) {
    console.error("Error updating content:", error);
    res.status(500).json({ error: "Failed to update content" });
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
