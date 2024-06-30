import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

import Influencer from "../models/user/influencer.model.js";
import Company from "../models/user/company.model.js";
import Collaboration from "../models/collaboration.model.js";

const getUserModel = async (userId) => {
  const influencer = await Influencer.findById(userId);
  if (influencer) {
    return "Influencer";
  }
  const company = await Company.findById(userId);
  if (company) {
    return "Company";
  }
  throw new Error("User not found");
};

export const sendMessage = async (req, res) => {
  try {
    const user = req.user;
    const { collaboration, sender, recipient, content } = req.body;

    // Check if the sender matches the authenticated user
    if (user.userId !== sender) {
      return res.status(403).json({ message: "Unauthorized action" });
    }

    // Check if the collaboration request is accepted and the users match
    const collab = await Collaboration.findById(collaboration);
    if (!collab || collab.status !== "accepted") {
      return res
        .status(403)
        .json({ message: "Collaboration not accepted or does not exist" });
    }
    if (
      (collab.fromUser.toString() !== sender ||
        collab.toUser.toString() !== recipient) &&
      (collab.fromUser.toString() !== recipient ||
        collab.toUser.toString() !== sender)
    ) {
      return res.status(403).json({ message: "Invalid collaboration users" });
    }

    // Determine sender and recipient models based on sender and recipient IDs
    const senderModel = await getUserModel(sender);
    const recipientModel = await getUserModel(recipient);

    // Create a new message
    const message = new Message({
      sender,
      recipient,
      onModel: senderModel,
      content,
    });

    // Save the message
    await message.save();

    let conversation = await Conversation.findOne({
      participants: {
        $all: [
          { $elemMatch: { participant: sender, model: senderModel } },
          { $elemMatch: { participant: recipient, model: recipientModel } },
        ],
      },
    });

    if (conversation) {
      // Update existing conversation with the new message
      conversation.messages.push(message._id);
      conversation.lastMessage = message._id;
    } else {
      // Create a new conversation
      conversation = new Conversation({
        participants: [
          { participant: sender, model: senderModel },
          { participant: recipient, model: recipientModel },
        ],
        messages: [message._id],
        lastMessage: message._id,
      });
    }
    await conversation.save();
    res
      .status(201)
      .json({ message: "Message sent successfully", data: message });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error sending message", error: error.message });
  }
};

export const receiveMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const user = req.user;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (message.recipient.toString() !== user.userId) {
      return res.status(403).json({ message: "Unauthorized action" });
    }

    message.read = true;
    await message.save();

    res.status(200).json({ message: "Message received", data: message });
  } catch (error) {
    console.error("Error receiving message:", error);
    res
      .status(500)
      .json({ message: "Error receiving message", error: error.message });
  }
};
