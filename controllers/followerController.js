const followerModel = require("../models/followerModel");
const userModel = require("../models/userModel");
const { StatusCodes } = require("http-status-codes");
const { BadRequest, NotFound } = require("../errors");
const notFound = require("../middleware/not-found");
const notificitionsModel = require("../models/notificitionsModel");
const postModel = require("../models/postModel");

const getAllUserFollowers = async (req, res) => {
  const {
    user: { userId },
  } = req;

  const followers = await followerModel
    .find({ following: userId })
    .populate("follower", "name email");

  const followersList = followers.map((person) => person.follower);

  res.status(StatusCodes.OK).json({ followers: followersList });
};

const createFollower = async (req, res) => {
  const {
    params: { id },
    user: { userId },
  } = req;

  if (id === userId) {
    throw new BadRequest("can not follow your self.");
  }

  const duplicateFollower = await followerModel.findOne({
    following: id,
    follower: userId,
  });

  if (duplicateFollower) {
    throw new BadRequest("can not follow twice");
  }

  const validateUser = await userModel.findOne({ _id: id });

  if (!validateUser) {
    throw new NotFound("User not found");
  }

  const follower = await followerModel.create({
    following: id,
    follower: userId,
  });

  const findUser = await userModel.findById(id);

  await notificitionsModel.create({
    recipient: findUser._id,
    actor: userId,
    type: "follow",
    read: false,
  });

  res.status(StatusCodes.CREATED).json({ follower });
};

const deleteFollower = async (req, res) => {
  const {
    params: { id },
    user: { userId },
  } = req;

  const follower = await followerModel.findOneAndDelete({
    following: id,
    follower: userId,
  });

  res.status(StatusCodes.OK).json({ follower });
};

module.exports = {
  getAllUserFollowers,
  createFollower,
  deleteFollower,
};
