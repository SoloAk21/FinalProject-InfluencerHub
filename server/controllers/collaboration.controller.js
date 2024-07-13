import Collaboration from "../models/collaboration.model.js";

export const sendCollaborationRequest = async (req, res) => {
  try {
    const { influencerId } = req.body;
    const company = req.user; // Assuming the company is authenticated and its ID is available

    const newCollaboration = new Collaboration({
      company: company.userId,
      influencer: influencerId,
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
      company: company.userId,
      influencer: influencerId,
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
    const { collaborationId, status } = req.body;
    const userId = req.user.userId;

    if (!userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const collaboration = await Collaboration.findById(collaborationId);

    if (!collaboration) {
      return res.status(404).json({ error: "Collaboration request not found" });
    }

    if (status === "request-back") {
      if (collaboration.company.toString() !== userId.toString()) {
        return res.status(403).json({
          error:
            "You do not have permission to request back this collaboration",
        });
      }
      await collaboration.deleteOne();
      return res
        .status(200)
        .json({ message: "Collaboration deleted successfully" });
    }

    if (collaboration.influencer.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ error: "You do not have permission to perform this action" });
    }

    collaboration.status = status === "accept" ? "accepted" : "rejected";
    await collaboration.save();

    res.status(200).json(collaboration);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message, id: userId });
  }
};

export const findCollabIdBetweenUsers = async (req, res) => {
  const { userId1, userId2 } = req.body;
  try {
    const collaboration = await Collaboration.findOne({
      $or: [
        { company: userId1, influencer: userId2 },
        { company: userId2, influencer: userId1 },
      ],
    });

    if (collaboration) {
      // Send the collaboration ID as JSON response
      res.status(200).json({ collaborationId: collaboration._id });
    } else {
      // Handle case where no collaboration is found
      res.status(404).json({ error: "No collaboration found" });
    }
  } catch (error) {
    // Handle error appropriately, e.g., log it or throw it
    console.error("Error finding collaboration:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getCollaborationsByUserType = async (req, res) => {
  const { model, userId } = req.user;
  const userType = model.toLowerCase();

  try {
    const page = parseInt(req.query.page) || 1; // Current page, default to 1
    const pageSize = parseInt(req.query.pageSize) || 10; // Number of items per page, default to 10

    let collaborations = [];
    let totalCollaborations = 0;
    let totalPages = 0;

    if (userType === "influencer") {
      totalCollaborations = await Collaboration.countDocuments({
        influencer: userId,
      });
      totalPages = Math.ceil(totalCollaborations / pageSize);

      collaborations = await Collaboration.find({ influencer: userId })
        .populate("company influencer")
        .skip((page - 1) * pageSize)
        .limit(pageSize);
    } else if (userType === "company") {
      totalCollaborations = await Collaboration.countDocuments({
        company: userId,
      });
      totalPages = Math.ceil(totalCollaborations / pageSize);

      collaborations = await Collaboration.find({ company: userId })
        .populate("company influencer")
        .skip((page - 1) * pageSize)
        .limit(pageSize);
    } else {
      return res.status(400).json({ message: "Invalid user type" });
    }

    res.status(200).json({
      collaborations: collaborations,
      totalPages: totalPages,
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// collaborationController.js
export const getCollaborations = async (req, res) => {
  const { model, userId } = req.user;
  const userType = model.toLowerCase();

  try {
    let collaborations = [];

    if (userType === "influencer") {
      const { status } = req.query;
      if (status === "accepted") {
        collaborations = await Collaboration.find({
          influencer: userId,
          status: "accepted",
        }).populate("company influencer");
      } else {
        collaborations = await Collaboration.find({
          influencer: userId,
        }).populate("company influencer");
      }
    } else if (userType === "company") {
      collaborations = await Collaboration.find({ company: userId }).populate(
        "company influencer"
      );
    } else {
      return res.status(400).json({ message: "Invalid user type" });
    }

    res.status(200).json({ collaborations });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
