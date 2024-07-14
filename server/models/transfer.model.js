import mongoose, { Schema } from "mongoose";

const transferSchema = new Schema(
  {
    Payment: {
      type: Schema.Types.ObjectId,
      ref: "Payment",
      required: true,
    },
    account_number: { type: String, required: true },
    amount: { type: Number, required: true },
  },
  { timestamps: true }
);

const Transfer = mongoose.model("Transfer", transferSchema);

export default Transfer;
