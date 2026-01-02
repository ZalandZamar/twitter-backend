const mongoose = require("mongoose");

const notificationsSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "please provide the user"],
    },
    actor: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "please provide the user"],
    },
    type: {
      type: String,
      enum: ["comment", "like", "follow", "retweet"],
    },
    post: {
      type: mongoose.Types.ObjectId,
      ref: "Post",
      required: false,
    },
    read: {
      type: Boolean,
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("notification", notificationsSchema);
