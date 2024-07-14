import mongoose, { Schema } from "mongoose";

const paymentSchema = new Schema(
  {
    agreement: {
      type: Schema.Types.ObjectId,
      ref: "Agreement",
      required: true,
    },
    amount: { type: Number, required: true },
    paymentDate: { type: Date, default: Date.now },
    transactionId: { type: String },

    status: {
      type: String,
      enum: ["Pending", "Processing", "Completed", "Failed", "Refunded"],
      default: "Pending",
    },
    paymentType: { type: String, enum: ["Stripe"], default: "Stripe" },
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
