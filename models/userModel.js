const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please provide a name"],
    minLength: 3,
    maxLength: 20,
  },
  email: {
    type: String,
    required: [true, "please provide an email"],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide a valid email",
    ],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "please provide a password"],
    minLength: 6,
  },
  refreshTokens: {
    type: String,
    default: null,
  },
});

// added text index for searching
userSchema.index(
  { name: "text", email: "text" },
  { weights: { name: 2, email: 1 } }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.accessToken = function () {
  return jwt.sign(
    { userId: this._id, name: this.name },
    process.env.ACCESS_TOKEN,
    { expiresIn: "30s" }
  );
};

userSchema.methods.refreshToken = function () {
  return jwt.sign(
    { userId: this._id, name: this.name },
    process.env.REFRESH_TOKEN,
    { expiresIn: "1d" }
  );
};

userSchema.methods.comparePassword = async function (pwd) {
  return await bcrypt.compare(pwd, this.password);
};

module.exports = mongoose.model("User", userSchema);
