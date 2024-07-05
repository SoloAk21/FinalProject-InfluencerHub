import { v4 as uuidv4 } from "uuid";
import Payment from "../models/payment.model.js";
const CHAPA_AUTH_KEY = process.env.CHASECK_TEST;

// Create Campaign
export const createPayment = async (req, res) => {
  try {
    const payment = new Payment(req.body);
    await payment.save();
    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const acceptPayment = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res
        .status(400)
        .json({ success: false, message: "Amount is required" });
    }

    const body = {
      amount,
      currency: "ETB",
      tx_ref: uuidv4(),
      return_url: "http://localhost:3000/message",
    };

    try {
      const response = await fetch(
        "https://api.chapa.co/v1/transaction/initialize",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${CHAPA_AUTH_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) {
        const errorBody = await response.json();
        console.error("Chapa API Error:", errorBody); // Log detailed error response
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      res.status(200).json({ success: true, data, tx_ref: body.tx_ref });
    } catch (error) {
      console.error("Chapa API Error:", error);
      res.status(400).json({
        success: false,
        message: "Failed to initialize transaction",
        error: error.message,
      });
    }
  } catch (e) {
    console.error("Internal Server Error:", e);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const verifyPayment = async (req, res, next) => {
  try {
    const { tx_ref } = req.params;

    try {
      const response = await fetch(
        `https://api.chapa.co/v1/transaction/verify/${tx_ref}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${CHAPA_AUTH_KEY}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      res.status(200).json({ success: true, data });
    } catch (error) {
      console.error("Chapa API Error:", error);
      res.status(400).json({
        success: false,
        message: "Failed to verify transaction",
        error: error.message,
      });
    }
  } catch (e) {
    console.error("Internal Server Error:", e);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get Payment by ID
export const getPaymentById = async (req, res) => {
  const { paymentId } = req.params;
  try {
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Payment Status by ID
export const updatePaymentStatus = async (req, res) => {
  const { paymentId } = req.params;
  try {
    const updatedPayment = await Payment.findByIdAndUpdate(
      paymentId,
      req.body,
      { new: true }
    );
    if (!updatedPayment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    res.json(updatedPayment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Payment by ID
export const deletePayment = async (req, res) => {
  const { paymentId } = req.params;
  try {
    const deletedPayment = await Payment.findByIdAndDelete(paymentId);
    if (!deletedPayment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    res.json({ message: "Payment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
