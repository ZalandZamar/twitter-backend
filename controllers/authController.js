const userModel = require("../models/userModel");
const UserModel = require("../models/userModel");
const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcryptjs");
const { BadRequest, UnuthenticatedError } = require("../errors/index");

const register = async (req, res) => {
  const { name, email, password } = req.body;
  const user = await UserModel.create({ name, email, password });

  const token = user.accessToken();

  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
};

const logIn = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequest("please provide email and password.");
  }

  const user = await userModel.findOne({ email });
  if (!user) {
    throw new UnuthenticatedError("Wrong credentials.");
  }

  const pwd = await user.comparePassword(password);
  if (!pwd) {
    throw new UnuthenticatedError("Wrong credentials.");
  }

  const accessTkn = user.accessToken();
  const refreshTkn = user.refreshToken();

  const salt = await bcrypt.genSalt(10);
  const hasedRefreshTkn = await bcrypt.hash(refreshTkn, salt);

  user.refreshTokens = hasedRefreshTkn;
  await user.save();

  res.cookie("refreshToken", refreshTkn, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // true only in production
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000,
  });
  res.status(StatusCodes.OK).json({ user: { name: user.name }, accessTkn });
};

module.exports = {
  register,
  logIn,
};
