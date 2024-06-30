import express from "express";

import { verifyToken } from "../utils/verifyUser.js";
import {
  deleteConversation,
  getConversationById,
  getConversations,
} from "../controllers/conversation.controller.js";

const router = express.Router();

// Get all conversations for the authenticated user
router.get("/", verifyToken, getConversations);

// Get a single conversation by ID
router.get("/:id", verifyToken, getConversationById);

// Delete a conversation by ID
router.delete("/:id", verifyToken, deleteConversation);

export default router;
