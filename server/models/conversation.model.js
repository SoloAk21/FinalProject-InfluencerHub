import mongoose from "mongoose";

const { Schema } = mongoose;

const conversationSchema = new Schema(
  {
    participants: [
      {
        participant: {
          type: Schema.Types.ObjectId,
          required: true,
          refPath: "participants.model",
        },
        model: {
          type: String,
          required: true,
          enum: ["Influencer", "Company"],
        },
      },
    ],
    messages: [
      {
        type: Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
  },
  { timestamps: true }
);

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;
