import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema(
  {
    senderId: {type: String, required: true},
    receiverId: {type: String, required: true},
    comment: {
      type: String,
      required: true,
    },
    starCount: {
        type: Number,
        default:0
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
