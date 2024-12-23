import { Server } from "socket.io";
import http from "http";
import express from "express";
import { log } from "console";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"], // Replace with your frontend URL
    methods: ["GET", "POST"],
  },
});

const userSocketMap = {}; // { userId: socketId }

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  const userId = socket.handshake.query.userId;

  if (userId !== "undefined") {
    userSocketMap[userId] = socket.id;
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });

  socket.on("send_message", (message) => {
    io.emit("receive_message", message);
  });
});

export { app, server, io, userSocketMap };
