import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { newPassword, resetPassword } from "../controllers/resetpassword.controller.js";

const router = express.Router();

router.post("/reset-password", verifyToken, resetPassword);

router.post("/new-password/:id/:userType/:token", verifyToken, newPassword);

export default router;