import mongoose, { Schema } from "mongoose";
import { CONTENT } from "../../enum.js";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    contents: {
      type: [String],
      required: true,
      enum: CONTENT,
    },
    city: {
      type: String,
      required: true,
    },
    biography: {
      type: String,
      default: "",
    },
    gender: {
      type: String,
    },
    userType: {
      type: String,
      default: "influencer",
    },
    platforms: [
      {
        name: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
        followerCount: {
          type: Number,
          required: true,
        },
      },
    ],
    active: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Influencer = mongoose.model("Influencer", userSchema);

export default Influencer;
