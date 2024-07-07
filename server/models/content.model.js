import mongoose, { Schema } from "mongoose";

const contentSchema = new Schema(
  {
    campaign: {
      type: Schema.Types.ObjectId,
      ref: "Campaign",
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
  const approvedContents = this.contents.filter(
    (content) => content.status === "approved"
  );

  if (approvedContents.length > 0) {
    this.overallStatus = "approved";
  } else {
    this.overallStatus = "pending";
  }

  next();
});

const Content = mongoose.model("Content", contentSchema);

export default Content;
