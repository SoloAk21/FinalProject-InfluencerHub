import { v4 as uuidv4 } from "uuid";
import Payment from "../models/payment.model.js";
import Influencer from "../models/user/influencer.model.js";
import Campaign from "../models/campaign.model.js";

import Company from "../models/user/company.model.js";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import { transferToAccount } from "../utils/auth.utils.js";
import Transfer from "../models/transfer.model.js";
const CHAPA_AUTH_KEY = process.env.CHASECK_TEST;
const CHAPA_SECRET_HASH = process.env.CHAPA_SECRET_HASH;
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

// Endpoint to handle webhooks
export const webhook = async (req, res) => {
  const chapaSignature = req.headers["chapa-signature"];
  const hash = crypto
    .createHmac("sha256", CHAPA_SECRET_HASH)
    .update(JSON.stringify(req.body))
    .digest("hex");

  if (hash === chapaSignature) {
    const event = req.body;
    console.log("Webhook Event Received:", event);

    // Handle different event types
    switch (event.event) {
      case "transaction.success":
        // Update payment status in your database
        try {
          const paymentId = event.data.payment.id;
          const updateData = {
            status: "success",
            updated_at: new Date(),
            chapa_response: event.data,
          };
          await updatePaymentStatus(paymentId, updateData);
          console.log(`Payment ${paymentId} updated successfully.`);
        } catch (error) {
          console.error("Error updating payment status:", error);
        }
        break;

      case "transaction.failure":
        // Handle failed transaction
        try {
          const paymentId = event.data.payment.id;
          const updateData = {
            status: "failed",
            updated_at: new Date(),
            chapa_response: event.data,
          };
          await updatePaymentStatus(paymentId, updateData);
          console.log(`Payment ${paymentId} failed.`);
        } catch (error) {
          console.error("Error updating payment status:", error);
        }
        break;

      default:
        console.log(`Unhandled webhook event type: ${event.event}`);
        break;
    }

    res.status(200).send("Webhook received");
  } else {
    res.status(400).send("Invalid signature");
  }
};

export const processPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;

    // 1. Find the payment
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }

    // 2. Check if the payment is already processed
    if (payment.status !== "Pending") {
      return res.status(400).json({ error: "Payment is already processed" });
    }

    // 3. Find the influencer
    const influencer = await Influencer.findById(payment.influencer);
    if (!influencer) {
      return res.status(404).json({ error: "Influencer not found" });
    }

    // 4. Process payment with Stripe (Example)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: payment.amount * 100, // Stripe uses cents
      currency: "usd", // Currency of the payment
      // ... other Stripe options for payment processing
    });

    // 5. Update the payment status
    payment.status = "Completed";
    payment.paymentMethodId = paymentIntent.id;
    await payment.save();

    // 6. Update influencer's earnings
    influencer.earnings += payment.amount;
    await influencer.save();

    res
      .status(200)
      .json({ message: "Payment processed successfully", payment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getPaymentData = async (req, res) => {
  const { model, userId } = req.user;
  const query =
    model.toLowerCase() === "company"
      ? { company: userId }
      : { contentCreator: userId };

  const payment = await Payment.find().populate({
    path: "agreement",
    match: query,
    populate: [
      { path: "company", select: "-password" },
      { path: "contentCreator", select: "-password" },
      { path: "campaign" },
    ],
  });

  res.status(200).json(payment);
};

export const processPendingPayments = async (req, res, next) => {
  const { userId } = req.user;
  const { accountNumber, password } = req.body;

  try {
    const user = await Influencer.findById(userId);

    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    if (!user.password) {
      return next(errorHandler(500, "User password is not defined"));
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const payments = await Payment.find({
      status: "Pending",
    }).populate({
      path: "agreement",
      match: { contentCreator: userId },
      populate: [
        { path: "company", select: "-password" },
        { path: "contentCreator", select: "-password" },
        { path: "campaign", match: { status: "completed" } },
      ],
    });

    const filteredPayments = payments.filter(
      (payment) => payment.agreement && payment.agreement.campaign
    );

    if (filteredPayments.length === 0) {
      return res.status(200).json({ message: "No payments to transfer" });
    }

    const transferResults = [];

    for (const payment of filteredPayments) {
      try {
        const transfer = new Transfer({
          Payment: payment._id,
          account_number: accountNumber,
          amount: payment.amount,
        });

        await transfer.save();

        const transferResult = await transferToAccount(
          transfer.account_number,
          transfer.amount
        );

        if (transferResult.success) {
          payment.status = "completed";
          await payment.save();
          transfer.status = "successful";
          await transfer.save();
        }

        transferResults.push(transferResult);
      } catch (transferError) {
        transferResults.push({ success: false, error: transferError.message });
      }
    }

    console.log(transferResults);
    res
      .status(200)
      .json({ message: "Transfers processed", results: transferResults });
  } catch (error) {
    next(errorHandler(500, error));
  }
};
