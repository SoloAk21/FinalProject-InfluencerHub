import express from "express";

import { verifyToken } from "../utils/verifyUser.js";
import {
  acceptPayment,
  createPayment,
  deletePayment,
  // earnMoney,
  getPaymentById,
  getPaymentData,
  processPendingPayments,
  updatePaymentStatus,
  verifyPayment,
  webhook,
} from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/accept-payment", verifyToken, acceptPayment);
router.get("/verify-payment/:tx_ref", verifyToken, verifyPayment);
router.get("/webhook", verifyToken, webhook);
router.get("/list", verifyToken, getPaymentData);

router.post("/create", verifyToken, createPayment);
router.post("/transfer", verifyToken, processPendingPayments);

// Update Payment Status by ID
router.put("/:paymentId", verifyToken, updatePaymentStatus);

// Delete Payment by ID
router.delete("/:paymentId", verifyToken, deletePayment);
export default router;
