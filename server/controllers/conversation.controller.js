import Conversation from "../models/conversation.model.js";

// getConversations: Retrieves all conversations for a user
export const getConversations = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const userModel = req.user.model;

    // Find all conversations involving the user
    let conversations = await Conversation.find({
      "participants.participant": userId,
      "participants.model": userModel,
    })
      .populate({
        path: "participants.participant",
        select: "-password",
      })
      .populate("messages")
      .populate("lastMessage")
      .exec();

    // Filter out the logged-in user's data from participants
    conversations = conversations.map((conversation) => {
      conversation.participants = conversation.participants.filter(
        (participant) => participant.participant._id.toString() !== userId
      );
      return conversation;
    });

    res.status(200).json(conversations);
  } catch (error) {
    next(error);
  }
};

// getConversationById: Retrieves a single conversation by ID
export const getConversationById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const userModel = req.user.model; // Assuming req.user includes model info (Influencer or Company)

    // Find the conversation by ID and check if the user is a participant
    const conversation = await Conversation.findById(id)
      .populate({
        path: "messages",
        populate: {
          path: "sender recipient",
          select: "name",
        },
      })
      .populate({
        path: "participants.otherParticipant",
        select: "name",
      });

    if (
      !conversation ||
      !conversation.participants.some(
        (p) => p.participant.toString() === userId && p.model === userModel
      )
    ) {
      return next(errorHandler(404, "Conversation not found or unauthorized"));
    }

    res.status(200).json(conversation);
  } catch (error) {
    next(error);
  }
};

// deleteConversation: Deletes a conversation by ID
export const deleteConversation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const userModel = req.user.model; // Assuming req.user includes model info (Influencer or Company)

    // Find the conversation by ID and check if the user is a participant
    const conversation = await Conversation.findById(id);

    if (
      !conversation ||
      !conversation.participants.some(
        (p) => p.otherParticipant.toString() === userId && p.model === userModel
      )
    ) {
      return next(errorHandler(404, "Conversation not found or unauthorized"));
    }

    // Remove the conversation and its messages
    await Message.deleteMany({ _id: { $in: conversation.messages } });
    await conversation.deleteOne();

    res.status(200).json({ message: "Conversation deleted successfully" });
  } catch (error) {
    next(error);
  }
};
