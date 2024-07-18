import Comment from "../models/comment.model.js";

export const sendComment = async (req, res, next) => {
  const comment = new Comment(req.body);
  console.log(comment);
  try {
    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const fetchData = async (req, res) => {
  try {
    const commentData = await Comment.find();

    if (!commentData || commentData.length === 0) {
      return res.status(404).json({ message: "No records found" });
    }

    res.json(commentData);
  } catch (error) {
    console.error("Error retrieving data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
