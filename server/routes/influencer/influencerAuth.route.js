import express from "express";

import {
  checkUsernameAndEmail,
  influencerGoogle,
  influencerSignUp,
} from "../../controllers/influencer/influencerAuth.controller.js";

const router = express.Router();

router.post("/signup", influencerSignUp);
router.post("/check-username-email", checkUsernameAndEmail);
router.post("/google", influencerGoogle);

export default router;
