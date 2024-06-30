import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";
import Influencer from "../models/user/influencer.model.js";
import Company from "../models/user/company.model.js";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) return next(errorHandler(401, "Unauthorized"));

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) return next(errorHandler(401, "Unauthorized"));

    // Assuming the decoded token includes userId
    const userId = decoded.userId;

    // Retrieve user model (Influencer or Company)
    let userModel;
    const influencer = await Influencer.findById(userId);
    if (influencer) {
      userModel = "Influencer";
    } else {
      const company = await Company.findById(userId);
      if (company) {
        userModel = "Company";
      } else {
        return next(errorHandler(404, "User not found"));
      }
    }

    req.user = { userId, model: userModel };
    next();
  });
};
