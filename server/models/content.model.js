import mongoose, { Schema } from "mongoose";

const contentSchema = new Schema(
  {
    campaign: {
      type: Schema.Types.ObjectId,
      ref: "Campaign",
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
    contents: [
      {
        type: {
          type: String,
          required: true,
          enum: ["image", "audio", "video"],
        },
        description: { type: String, required: true },
        url: { type: String, required: true },
        uploadedAt: { type: Date, default: Date.now },
        status: {
          type: String,
          enum: ["pending", "approved", "rejected"],
          default: "pending",
        },
      },
    ],
    overallStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

contentSchema.pre("save", function (next) {
  // Calculate overall status based on individual content statuses
  const rejectedContents = this.contents.some(
    (content) => content.status === "rejected"
  );

  if (rejectedContents) {
    this.overallStatus = "rejected";
  } else {
    const approvedContents = this.contents.some(
      (content) => content.status === "approved"
    );

    if (approvedContents) {
      this.overallStatus = "approved";
    } else {
      this.overallStatus = "pending";
    }
  }

  next();
});

const Content = mongoose.model("Content", contentSchema);

export default Content;
