import mongoose, { Schema } from "mongoose";
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
  isActive: { type: Boolean, default: false },
});

const Campaign = mongoose.model("Campaign", campaignSchema);

export default Campaign;
