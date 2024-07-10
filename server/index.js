import express from "express";

import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import "dotenv/config";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import searchRouter from "./routes/search.route.js";
import collaborationRouter from "./routes/collaboration.route.js";
import messageRouter from "./routes/message.route.js";
import conversationRouter from "./routes/conversation.route.js";
import paymentRouter from "./routes/payment.route.js";
import campaignRouter from "./routes/campaign.route.js";
import agreementRouter from "./routes/agreement.route.js";
import contentRouter from "./routes/content.route.js";
import transferRouter from "./routes/transfer.route.js";

import cors from "cors";
import { app, server } from "./socket/socket.js";

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_DB_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// API Routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/influencers", searchRouter);
app.use("/api/collaborations", collaborationRouter);
app.use("/api/messages", messageRouter);
app.use("/api/conversations", conversationRouter);
app.use("/api/payments", paymentRouter);
app.use("/api/campaigns", campaignRouter);
app.use("/api/agreements", agreementRouter);
app.use("/api/contents", contentRouter);
app.use("/api/transfers", transferRouter);

// Error handling middleware
app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    statusCode,
    message: error.message || "Server error",
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
