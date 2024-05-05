import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import cookieParser from "cookie-parser";
import companyAuthRouter from "./routes/company/companyAuth.route.js";
const app = express();
app.use(cookieParser());
const PORT = 3000;
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

mongoose.connect(process.env.MONGO_DB_URL);

app.listen(PORT, () => {
  console.log(`The server is listening on port ${PORT}`);
});

app.use("/api/company-auth", companyAuthRouter);

app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Server creating error ";

  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
