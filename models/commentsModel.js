const mongoose = require("mongoose");

const commentsSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: [true, "please write down a comment"],
      minLength: 1,
    },
    post: {
      type: mongoose.Types.ObjectId,
      ref: "Post",
      required: [true, "please provide the user"],
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "please provide the user"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", commentsSchema);
