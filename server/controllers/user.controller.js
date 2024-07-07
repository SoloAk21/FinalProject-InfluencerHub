import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import Influencer from "../models/user/influencer.model.js";
import Company from "../models/user/company.model.js";
import { CONTENT } from "../enum.js";

export const test = (req, res) => {
  res.json({
    message: "API route is working!",
  });
};

export const updateUser = async (req, res, next) => {
  try {
    const { email, userType, ...updateFields } = req.body;
    const userId = req.params.id;

    console.log(userType);
    const currentUser = await (userType === "influencer"
      ? Influencer.findById(userId)
      : Company.findById(userId));

    if (!currentUser) {
      return next(errorHandler(404, "User not found"));
    }

    // Check if the user is authorized to update their own account
    if (req.user.userId !== userId) {
      return next(errorHandler(401, "You can only update your own account!"));
    }

    // Check if the username/company name is provided and handle uniqueness
    if (updateFields.username && userType === "influencer") {
      const normalizedUsername = updateFields.username
        .toLowerCase()
        .replace(/\s/g, "");

      const usernameFound = await Influencer.findOne({
        username: normalizedUsername,
        _id: { $ne: userId }, // Exclude current user
      });

      if (usernameFound) {
        return next(errorHandler(400, "Username already exists"));
      }

      updateFields.username = normalizedUsername;
    }

    if (updateFields.companyName && userType === "company") {
      const normalizedCompanyName = updateFields.companyName
        .toLowerCase()
        .replace(/\s/g, "");

      const companyNameFound = await Company.findOne({
        companyName: normalizedCompanyName,
        _id: { $ne: userId }, // Exclude current user
      });

      if (companyNameFound) {
        return next(errorHandler(400, "Company name already exists"));
      }

      updateFields.companyName = normalizedCompanyName;
    }

    // Update user information
    Object.assign(currentUser, updateFields);
    await currentUser.save();

    // Omitting the password field
    const { password, ...rest } = currentUser._doc;

    res.status(200).json(rest);
  } catch (error) {
    console.error("Error updating user information:", error);
    next(errorHandler(500, "Internal Server Error"));
  }
};

// Get company by ID
export const getCompanyById = async (req, res) => {
  const { companyId } = req.params;

  try {
    const company = await Company.findById(companyId).select({
      password: 0,
      licenceDocument: 0,
    });

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    res.status(200).json(company);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve company", error });
  }
};
