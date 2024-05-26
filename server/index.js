import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import "dotenv/config";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import searchRouter from "./routes/search.route.js";
import collaborationRouter from "./routes/collaboration.route.js";
const app = express();
const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_DB_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/influencers", searchRouter);
app.use("/api/collaborations", collaborationRouter);

app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    statusCode,
    message: error.message || "Server creating error",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
