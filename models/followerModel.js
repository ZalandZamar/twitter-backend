const mongoose = require("mongoose");

const followerSchema = new mongoose.Schema(
  {
    follower: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "please provide followers"],
    },
    following: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "please provide followers"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("follow", followerSchema);
