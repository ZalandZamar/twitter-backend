const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "please provide an User"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
