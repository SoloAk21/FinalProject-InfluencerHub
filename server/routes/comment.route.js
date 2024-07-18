import express from "express";
import {sendComment} from "../controllers/comment.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
import { fetchData } from "../controllers/comment.controller.js";

const router = express.Router();

router.post("/send", verifyToken, sendComment);
router.get("/comment-data", verifyToken, fetchData);

export default router;
