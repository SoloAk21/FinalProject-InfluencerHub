import Company from "../../models/user/company.model.js";
import { errorHandler } from "../../utils/error.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
// In companyAuth.controller.js

export const checkCompanyName = async (req, res, next) => {
  try {
    const { companyName } = req.body;
    const companyExists = await Company.findOne({ companyName });

    if (companyExists) {
      return res.status(200).json({
        success: false,
        message: "Company name already exists.",
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "Company name is available.",
      });
    }
  } catch (error) {
    next(error);
  }
};

export const companySignUp = async (req, res, next) => {
  try {
    console.log(req.body);
    const {
      companyName,
      industry,
      contactName,
      companyDescription,
      email,
      licenceDocument,
      phoneNumber,
      password,
      companyWebsite,
    } = req.body;

    // Check if the company name or email already exists
    const existingCompany = await Company.findOne({
      $or: [{ companyName }, { email }],
    });
    if (existingCompany) {
      return next(
        errorHandler(400, "Company with provided name or email already exists")
      );
    }

    // Hash the password before creating the Company model instance
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newCompany = new Company({
      companyName: companyName.trim(),
      industry,
      contactName: contactName.trim(),
      companyDescription,
      companyWebsite,
      email: email.toLowerCase(),
      phoneNumber: `+251${phoneNumber}`,
      password: hashedPassword,
      licenceDocument,
    });

    console.log(licenceDocument);

    await newCompany.save();

    res.status(201).json({
      success: true,
      message: "Company registration successful",
    });
  } catch (error) {
    next(error);
  }
};

export const companyGoogle = async (req, res, next) => {
  try {
    const { email } = req.body;
    const userExists = await Company.findOne({ email });

    if (!userExists) {
      return res.status(201).json({
        userExists: false,
        message: "Continue signUp...",
      });
    }

    const payload = { userId: userExists._id };
    const secret = process.env.JWT_SECRET;
    const token = jwt.sign(payload, secret, { expiresIn: "2d" });
    const cookieOptions = { httpOnly: true };

    const { password, licenceDocument, ...userData } = userExists._doc;
    res.cookie("access_token", token, cookieOptions);
    return res.status(200).json(userData);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
