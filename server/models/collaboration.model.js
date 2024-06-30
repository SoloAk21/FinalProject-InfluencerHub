import mongoose, { Schema } from "mongoose";
import { COLLABORATION_STATUS } from "../enum.js";

const collaborationSchema = new Schema(
  {
    fromUser: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    toUser: { type: Schema.Types.ObjectId, ref: "Influencer", required: true },
    status: {
      type: String,
      enum: COLLABORATION_STATUS,
      default: "pending",
    },
  },
  { timestamps: true }
);

const Collaboration = mongoose.model("Collaboration", collaborationSchema);

export default Collaboration;
