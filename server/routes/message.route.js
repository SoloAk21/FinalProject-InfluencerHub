import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  sendMessage,
  receiveMessage,
} from "../controllers/message.controller.js";

const router = express.Router();

// Route to send a message
router.post("/send", verifyToken, sendMessage);

// Route to mark a message as received (read)
router.patch("/receive/:messageId", verifyToken, receiveMessage);

export default router;
