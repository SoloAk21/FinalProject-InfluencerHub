import mongoose, { Schema } from "mongoose";
import { STATUS } from "../enum.js";

const campaignSchema = new Schema({
  campaignName: { type: String, required: true },
  campaignDescription: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  campaignBudget: { type: Number, required: true },
  contentGuidelines: { type: String },
  contentDeliverables: [{ type: String }],
  targetAudience: { type: String },
  additionalRequirements: { type: String },
  status: {
    type: String,
    enum: STATUS,
    default: "pending",
    required: true,
  },
  influencer: {
    type: Schema.Types.ObjectId,
    ref: "Influencer",
    required: true,
  },
  company: {
    type: Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
});

const Campaign = mongoose.model("Campaign", campaignSchema);

export default Campaign;
