import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import Influencer from "../models/user/influencer.model.js";

export const test = (req, res) => {
  res.json({
    message: "Api route is working!",
  });
};

export const updateUser = async (req, res, next) => {
  if (req.user.userId !== req.params.id) {
    return next(errorHandler(401, "You can only update your own account!"));
  }

  try {
    const { username, email, ...updateFields } = req.body;

    const currentUser = await Influencer.findById(req.user.userId);

    if (!currentUser) {
      return next(errorHandler(404, "User not found"));
    }

    if (username) {
      const normalizedUsername = username.toLowerCase().replace(/\s/g, "");
      if (normalizedUsername !== currentUser.username) {
        const usernameFound = await Influencer.findOne({
          username: normalizedUsername,
          _id: { $ne: currentUser._id }, // Exclude current user
        });
        if (usernameFound) {
          return next(errorHandler(400, "Username already exists"));
        }
        updateFields.username = normalizedUsername;
      }
    }

    const updatedUser = await Influencer.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    );

    if (!updatedUser) {
      return next(errorHandler(500, "Failed to update user"));
    }

    // Omitting the password field
    const { password, ...rest } = updatedUser._doc;

    res.status(200).json(rest);
  } catch (error) {
    console.error("Error updating user information:", error);
    next(errorHandler(500, "Internal Server Error"));
  }
};
