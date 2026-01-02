const mongoose = require("mongoose");

const retweetsSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Types.ObjectId,
      ref: "Post",
      required: [true, "please provide the user."],
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "please provide the user"],
    },
    ReComment: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Retweet", retweetsSchema);
