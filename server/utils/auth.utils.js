import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Hash password
export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};
export const checkPassword = async (inputPassword, userPassword) => {
  const isMatch = await bcrypt.compare(inputPassword, userPassword);
  return isMatch;
};

// Example function to simulate transferring funds
export const transferToAccount = async (accountNumber, amount) => {
  try {
    if (true) {
      return {
        success: true,
        message: `Successfully transferred ${amount} to account ${accountNumber}`,
      };
    } else {
      throw new Error(
        `Failed to transfer ${amount} to account ${accountNumber}`
      );
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Generate JWT
export const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "2d" });
};

// Check duplicates in database
export const checkDuplicates = async (Model, fields) => {
  const query = { $or: fields.map((field) => ({ [field.key]: field.value })) };
  return Model.findOne(query);
};

// Save document to database
export const saveDocument = async (doc) => {
  const document = new doc.model(doc.values);
  await document.save();
  return document;
};
