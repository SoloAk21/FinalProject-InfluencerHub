import express from "express";
import {
  createAgreement,
  getAgreementById,
  updateAgreement,
  deleteAgreement,
} from "../controllers/agreement.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

// Create Agreement
router.post("/create", verifyToken, createAgreement);

// Get Agreement by ID
router.get("/:agreementId", verifyToken, getAgreementById);

// Update Agreement by ID
router.put("/:agreementId", verifyToken, updateAgreement);

// Delete Agreement by ID
router.delete("/:agreementId", verifyToken, deleteAgreement);

export default router;
