import express from "express";
import {
  getAllBanks,
  getAllTransfers,
  initiateTransfer,
  verifyTransfer,
} from "../controllers/transfer.controller.js";

const router = express.Router();

router.post("/", initiateTransfer);
router.get("/", getAllTransfers);
router.get("/banks", getAllBanks);
router.get("/verify/:reference", verifyTransfer);

export default router;
