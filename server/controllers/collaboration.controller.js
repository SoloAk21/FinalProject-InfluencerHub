import Collaboration from "../models/collaboration.model.js";

export const sendCollaborationRequest = async (req, res) => {
  try {
    const { influencerId } = req.body;
    const company = req.user; // Assuming the company is authenticated and its ID is available

    const newCollaboration = new Collaboration({
      fromUser: company.userId,
      toUser: influencerId,
    });

    await newCollaboration.save();
    res.status(201).json(newCollaboration);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const checkCollabStatus = async (req, res) => {
  try {
    const { influencerId } = req.body;
    const company = req.user; // Assuming the company is authenticated and its ID is available

    const collaboration = await Collaboration.findOne({
      fromUser: company.userId,
      toUser: influencerId,
    });

    if (collaboration) {
      res.status(200).json({ collabStatus: collaboration.status }); // Assuming there's a status field
    } else {
      res.status(200).json({ collabStatus: "none" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
export const respondToCollaborationRequest = async (req, res) => {
  try {
    const { requestId, status } = req.body;
    const influencer = req.user;

    if (!influencer || !influencer.userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const collaboration = await Collaboration.findById(requestId);

    if (!collaboration) {
      return res.status(404).json({ error: "Collaboration request not found" });
    }

    if (collaboration.toUser.toString() !== influencer.userId.toString()) {
      return res
        .status(403)
        .json({ error: "You do not have permission to perform this action" });
    }

    collaboration.status = status;
    await collaboration.save();

    res.status(200).json(collaboration);
  } catch (error) {
    res.status(400).json({ error: error.message, id: influencer.userId });
  }
};
