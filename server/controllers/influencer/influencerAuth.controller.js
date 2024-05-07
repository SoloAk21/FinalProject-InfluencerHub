import Influencer from "../../models/user/influencer.model.js";
import { errorHandler } from "../../utils/error.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Function to check for existing username or email
const checkForDuplicates = async (field, value) => {
  const existingInfluencer = await Influencer.findOne({ [field]: value });
  return existingInfluencer;
};

// Function to create a new Influencer
const createInfluencer = async (influencerData) => {
  const newInfluencer = new Influencer(influencerData);
  await newInfluencer.save();
  return newInfluencer;
};
export const checkUsernameAndEmail = async (req, res, next) => {
  try {
    const { username, email } = req.body;

    // Perform both checks in parallel
    const [usernameExists, emailExists] = await Promise.all([
      checkForDuplicates("username", username),
      checkForDuplicates("email", email.toLowerCase()),
    ]);

    const errors = [];
    if (usernameExists) {
      errors.push({
        exist: "username",
        error: "Username already exists. Please choose another one.",
      });
    }
    if (emailExists) {
      errors.push({
        exist: "email",
        error: "Email already exists. Please choose another one.",
      });
    }

    if (errors.length > 0) {
      return res.status(200).json({ success: false, errors });
    }

    res
      .status(200)
      .json({ success: true, message: "Username and Email are available." });
  } catch (error) {
    next(error);
  }
};

export const influencerSignUp = async (req, res, next) => {
  try {
    const { username, email, ...rest } = req.body;

    const existingInfluencer = await checkForDuplicates("username", username);
    if (existingInfluencer) {
      return next(
        errorHandler(
          400,
          "Influencer with provided username or email already exists"
        )
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(rest.password, salt);

    const influencerData = {
      username,
      email: email.toLowerCase(),
      ...rest,
      password: hashedPassword,
    };

    await createInfluencer(influencerData);

    res
      .status(201)
      .json({ success: true, message: "Influencer registration successful" });
  } catch (error) {
    next(error);
  }
};

export const influencerGoogle = async (req, res, next) => {
  try {
    const { email } = req.body;

    const influencerExists = await Influencer.findOne({
      email: email.toLowerCase(),
    });

    if (!influencerExists) {
      return res
        .status(201)
        .json({ userExists: false, message: "Continue signup..." });
    }

    const payload = { userId: influencerExists._id };
    const secret = process.env.JWT_SECRET;
    const token = jwt.sign(payload, secret, { expiresIn: "2d" });

    const cookieOptions = { httpOnly: true };
    const { password, ...userData } = influencerExists._doc;

    res.cookie("access_token", token, cookieOptions);
    res.status(200).json(userData);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
