import express from "express";
import Influencer from "../models/user/influencer.model.js";
import Company from "../models/user/company.model.js";
import {
  checkUniqueness,
  googleAuth,
  signIn,
  signUp,
} from "../controllers/auth.controller.js";

const router = express.Router();

// Influencer routes
router.post(
  "/influencers/check",
  checkUniqueness(Influencer, ["username", "email"])
);
router.post("/influencers/signup", signUp(Influencer, "Influencer"));
router.post("/influencers/google", googleAuth(Influencer, "Influencer"));

// Company routes
router.post(
  "/companies/check",
  checkUniqueness(Company, ["companyName", "email"])
);
router.post("/companies/signup", signUp(Company, "Company"));
router.post("/companies/google", googleAuth(Company, "Company"));

router.post("/signin", signIn);

export default router;
