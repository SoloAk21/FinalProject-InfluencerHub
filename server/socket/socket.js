import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
  },
});

export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId != "undefined") userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("contentUpdate", async (updatedContent) => {
    try {
      const { _id, status } = updatedContent;
      const updated = await Content.findByIdAndUpdate(
        _id,
        { status },
        { new: true }
      );

      io.emit("contentUpdated", updated);
    } catch (error) {
      console.error("Error updating content:", error);
    }
  });
  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });

  socket.on("send_message", (message) => {
    // Emit the message to all connected clients
    io.emit("receive_message", message);
  });
});

export { app, io, server };
