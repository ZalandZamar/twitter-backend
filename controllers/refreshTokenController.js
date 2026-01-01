const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.refreshToken)
    return res.status(403).json({ message: "token does not exist" });

  const { refreshToken } = cookies;

  let payload;

  try {
    payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN);
  } catch (error) {
    return res
      .status(403)
      .json({ message: "Invalid or expired refresh token" });
  }

  const user = await userModel.findOne({ _id: payload.userId });
  if (!user) return res.status(403).json({ message: "user not found" });

  const isValid = await bcrypt.compare(refreshToken, user.refreshTokens);
  if (!isValid)
    return res.status(401).json({ message: "refresh token does not match" });

  const accessToken = jwt.sign(
    { userId: user._id, name: user.name },
    process.env.ACCESS_TOKEN,
    {
      expiresIn: "1d",
    }
  );

  res.json({ accessToken });
};

module.exports = handleRefreshToken;
