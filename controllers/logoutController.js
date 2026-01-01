const UserModel = require("../models/userModel");

const handleLogOut = async (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // true only in production
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000,
  });

  if (req.user?.userId) {
    const user = await UserModel.findById(req.user.userId);

    if (user) {
      user.refreshTokens = null;
      await user.save();
    }
  }

  return res.status(200).json({ message: "user logged out" });
};

module.exports = handleLogOut;
