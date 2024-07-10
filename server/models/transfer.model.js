import mongoose, { Schema } from "mongoose";

const transferSchema = new Schema(
  {
    campaign: {
      type: Schema.Types.ObjectId,
      ref: "Campaign",
      required: true,
    },
    account_name: { type: String, required: true },
    account_number: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, enum: ["ETB"], default: "ETB" },
    reference: { type: String, required: true },
    bank_code: { type: String, required: true },
  },
  { timestamps: true }
);

const Transfer = mongoose.model("Transfer", transferSchema);

export default Transfer;
