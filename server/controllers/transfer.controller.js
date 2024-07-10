import fetch from "node-fetch"; // For making HTTP requests
import Transfer from "../models/transfer.model.js";

const CHAPA_API_BASE_URL = "https://api.chapa.co/v1";
const CHAPA_AUTH_KEY = process.env.CHASECK_TEST;
export const initiateTransfer = async (req, res) => {
  try {
    const { account_name, account_number, amount, reference, bank_code } =
      req.body;

    console.log(req.body);
    // Construct request payload
    const transferData = {
      campaign: "668a137dc7555dbadcbe9b3d",
      account_name,
      account_number,
      amount,
      currency: "ETB",
      reference,
      bank_code,
    };

    // Make API call to initiate transfer
    const response = await fetch(`${CHAPA_API_BASE_URL}/transfers`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${req.headers.authorization}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transferData),
    });

    const responseData = await response.json();

    // Save the transfer details in the database
    const transfer = new Transfer(transferData);
    await transfer.save();

    res.json(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to initiate transfer" });
  }
};

export const getAllTransfers = async (req, res) => {
  try {
    // Make API call to get all transfers
    const response = await fetch(`${CHAPA_API_BASE_URL}/transfers`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${CHAPA_AUTH_KEY}`,
      },
    });

    const responseData = await response.json();
    console.log(responseData);
    res.json(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch transfers" });
  }
};

export const getAllBanks = async (req, res) => {
  try {
    // Make API call to get all banks
    const response = await fetch(`${CHAPA_API_BASE_URL}/banks`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${req.headers.authorization}`,
      },
    });

    const responseData = await response.json();
    res.json(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch banks" });
  }
};

export const verifyTransfer = async (req, res) => {
  try {
    const { reference } = req.params;

    // Make API call to verify transfer
    const response = await fetch(
      `${CHAPA_API_BASE_URL}/transfers/verify/${reference}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${CHAPA_AUTH_KEY}`,
        },
      }
    );

    const responseData = await response.json();

    res.json(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to verify transfer" });
  }
};
