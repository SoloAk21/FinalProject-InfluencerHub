import express from "express";
import {
  getCompanyById,
  test,
  updateUser,
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/test", test);

router.post("/update/:id", verifyToken, updateUser);
router.get("/company/:companyId", verifyToken, getCompanyById);

export default router;
