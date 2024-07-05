import mongoose, { Schema } from "mongoose";
const agreementSchema = new Schema(
  {
    company: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    contentCreator: {
      type: Schema.Types.ObjectId,
      ref: "Influencer",
      required: true,
    },
    campaign: { type: Schema.Types.ObjectId, ref: "Campaign", required: true },
    agreementDate: { type: Date, default: Date.now },
    isSigned: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

const Agreement = mongoose.model("Agreement", agreementSchema);

export default Agreement;
