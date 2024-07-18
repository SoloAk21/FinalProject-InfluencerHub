import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { fetchData } from "../controllers/company.controller.js";

const router = express.Router();

router.get("/company-data", verifyToken, fetchData);

export default router;
