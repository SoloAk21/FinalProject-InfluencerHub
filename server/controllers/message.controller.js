import asyncHandler from "express-async-handler";
import { userSocketMap } from "../socket/socket.js";
import Message from "../models/message.model.js";
import Collaboration from "../models/collaboration.model.js";

// Helper function to get receiver's socket ID
const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

// Send a message
export const sendMessage = asyncHandler(async (req, res) => {
  const { receiverId, content } = req.body;
  const senderId = req.user.userId;

  const newMessage = new Message({
    sender: senderId,
    receiver: receiverId,
    onModel: req.user.userType === "Company" ? "Influencer" : "Company",
    content,
  });

  const message = await newMessage.save();

  // Update lastMessage and lastSeen in Collaboration
  const collaborationFilter = {
    company: req.user.model === "Company" ? req.user.userId : receiverId,
    influencer: req.user.model === "Influencer" ? req.user.userId : receiverId,
  };

  const collaborationUpdate = {
    lastMessage: content,
    lastSeen: new Date(), // Update lastSeen to current time
  };

  const collaboration = await Collaboration.findOneAndUpdate(
    collaborationFilter,
    collaborationUpdate,
    { new: true }
  );

  if (!collaboration) {
    console.log("Collaboration not found for filter:", collaborationFilter);
    return res.status(404).json({ error: "Collaboration not found" });
  }

  console.log(collaboration);
  // Emit the message to the recipient via Socket.io
  const io = req.app.get("io");
  const receiverSocketId = getReceiverSocketId(receiverId);

  if (receiverSocketId) {
    io.to(receiverSocketId).emit("send_message", message); // Emit the saved message object
  }

  res.status(200).json(message);
});

// Mark a message as received (read)
export const receiveMessage = asyncHandler(async (req, res) => {
  const { messageId } = req.params;

  const message = await Message.findById(messageId);

  if (!message) {
    res.status(404);
    throw new Error("Message not found");
  }

  message.read = true; // Mark message as read if required
  await message.save();

  res.status(200).json({
    success: true,
    message: "Message marked as read",
    data: message,
  });
});

export const getMessage = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const { participantId } = req.params;

  const messages = await Message.find({
    $or: [
      { sender: userId, receiver: participantId },
      { sender: participantId, receiver: userId },
    ],
  }).sort({ createdAt: 1 });

  res.status(200).json({ success: true, messages });
});

// Mark messages as read
export const markAsRead = asyncHandler(async (req, res) => {
  console.log("jsjdg");
  const { messageId } = req.params;

  const message = await Message.findById(messageId);

  if (!message) {
    return res.status(404).json({ error: "Message not found" });
  }

  message.read = true;
  await message.save();

  res.status(200).json({ success: true, message });
});
