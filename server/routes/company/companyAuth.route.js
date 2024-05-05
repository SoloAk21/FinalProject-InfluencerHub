import express from "express";

import {
  checkCompanyName,
  companyGoogle,
  companySignUp,
} from "../../controllers/company/companyAuth.controller.js";

const router = express.Router();

router.post("/signup", companySignUp);
router.post("/check-company", checkCompanyName);
router.post("/google", companyGoogle);

export default router;
