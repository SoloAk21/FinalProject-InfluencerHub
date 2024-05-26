import express from "express";
import { test } from "../controllers/search.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
import {
  getInfluencersByUsername,
  getInfluencersByFilters,
} from "../controllers/search.controller.js";

const router = express.Router();

router.get("/test", test);

router.get("/search", verifyToken, getInfluencersByUsername);
router.get("/filter", verifyToken, getInfluencersByFilters);

export default router;
