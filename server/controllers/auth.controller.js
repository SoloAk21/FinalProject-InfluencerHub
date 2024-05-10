import Company from "../models/user/company.model.js";
import Influencer from "../models/user/influencer.model.js";
import {
  hashPassword,
  generateToken,
  checkDuplicates,
  saveDocument,
  checkPaswword,
} from "../utils/auth.utils.js";
import { errorHandler } from "../utils/error.js";
import bcrypt from "bcryptjs";
// Check if the specified unique keys already exist in the database
export const checkUniqueness =
  (Model, uniqueKeys) => async (req, res, next) => {
    try {
      const checks = uniqueKeys.map((key) => ({
        [key]: req.body[key],
      }));

      const results = await Promise.all(
        checks.map((check) => Model.findOne(check))
      );

      const exists = results.filter((result) => result !== null);

      if (exists.length > 0) {
        return res.status(200).json({
          success: false,
          errors: exists.map(
            (_, index) =>
              `${uniqueKeys[index]} already exists. Please choose another one.`
          ),
        });
      }
      res.status(200).json({
        success: true,
        message: `${uniqueKeys.join(" and ")} are available.`,
      });
    } catch (error) {
      next(error);
    }
  };

// Sign up a new user with the specified model
export const signUp = (Model, userTypeName) => async (req, res, next) => {
  const { password, ...rest } = req.body;
  console.log(req.body);
  try {
    const existingUser = await checkDuplicates(Model, [
      {
        key: userTypeName === "Influencer" ? "username" : "companyName",
        value: rest[userTypeName === "Influencer" ? "username" : "companyName"],
      },
      { key: "email", value: rest.email },
    ]);

    if (existingUser) {
      return next(
        errorHandler(
          400,
          `${userTypeName} with provided information already exists`
        )
      );
    }

    const hashedPassword = await hashPassword(password);
    const newUserData = { ...rest, password: hashedPassword };
    const newUser = await saveDocument({ model: Model, values: newUserData });

    res.status(201).json({
      success: true,
      message: `${userTypeName} registration successful`,
      id: newUser._id,
    });
  } catch (error) {
    next(error);
  }
};

// Handle Google sign-in/up
export const googleAuth = (Model, userTypeName) => async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await Model.findOne({ email });

    if (!user) {
      return res
        .status(201)
        .json({ userExists: false, message: "Continue signup..." });
    }

    const token = generateToken(user._id);
    res.cookie("access_token", token, { httpOnly: true });
    res.status(200).json({
      success: true,
      message: "Authentication successful",
      id: user._id,
    });
  } catch (error) {
    next(error.message);
  }
};

export const signIn = async (req, res, next) => {
  try {
    const { email, password, userType } = req.body;

    if (!["company", "influencer"].includes(userType.toLowerCase())) {
      return next(errorHandler(400, "Invalid user type"));
    }

    const Model = userType === "company" ? Company : Influencer;
    const user = await Model.findOne({ email });
    if (!user) {
      return next(
        errorHandler(401, "Email or password or user type incorrect")
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(
        errorHandler(401, "Email or password or user type incorrect")
      );
    }

    const token = generateToken(user._id);
    res.cookie("access_token", token, { httpOnly: true });
    const { password: _, ...userData } = user._doc;
    res.status(200).json(userData);
  } catch (error) {
    next(error);
  }
};
