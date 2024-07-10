import mongoose from "mongoose";
import { INDUSTRY } from "../../enum.js";

const CompanySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
    },

    companyWebsite: {
      type: String,
    },
    industry: {
      type: [String],
      required: true,
      enum: INDUSTRY,
    },
    companyDescription: {
      type: String,
      maxlength: 500,
    },

    contactName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    userType: {
      type: String,
      default: "company",
    },
    password: {
      type: String,
      required: true,
    },
    licenceDocument: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
    },

    active: {
      type: Boolean,
      default: false,
    },
    new: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Company = mongoose.model("Company", CompanySchema);
export default Company;
