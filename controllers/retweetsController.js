const { StatusCodes } = require("http-status-codes");
const retweetsModel = require("../models/retweetsModel");
const postModel = require("../models/postModel");
const { NotFound, BadRequest } = require("../errors");

const getAllPostRetweets = async (req, res) => {
  const {
    params: { postId },
    user: { userId },
  } = req;

  const retweets = await retweetsModel.find({ post: postId });

  res.status(StatusCodes.OK).json({ retweets });
};

const createRetweet = async (req, res) => {
  const {
    params: { postId },
    user: { userId },
    body: { ReComment },
  } = req;

  const findPost = await postModel.findOne({ _id: postId });
  if (!findPost) {
    throw new NotFound("Post not Found.");
  }

  const duplicate = await retweetsModel.findOne({ user: userId, post: postId });
  if (duplicate) {
    throw new BadRequest("not allowed to retweet twice");
  }

  const retweet = await retweetsModel.create({
    post: postId,
    user: userId,
    ReComment,
  });

  res.status(StatusCodes.CREATED).json({ retweet });
};

const updateRetweet = async (req, res) => {
  const {
    body: { ReComment },
    params: { retweetId },
    user: { userId },
  } = req;

  const findRetweet = await retweetsModel.findOne({
    _id: retweetId,
    user: userId,
  });

  if (!findRetweet) {
    throw new NotFound("Retweet not fount.");
  }

  const retweet = await retweetsModel.findOneAndUpdate(
    { _id: retweetId, user: userId },
    { ReComment },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(StatusCodes.OK).json({ retweet });
};

const deleteRetweet = async (req, res) => {
  const {
    params: { retweetId },
    user: { userId },
  } = req;

  const findRetweet = await retweetsModel.findOne({
    _id: retweetId,
    user: userId,
  });

  if (!findRetweet) {
    throw new NotFound("Retweet not fount.");
  }

  const retweet = await retweetsModel.findOneAndDelete({
    _id: retweetId,
    user: userId,
  });

  res.status(StatusCodes.OK).json({ message: "retweet succefully deleted" });
};

module.exports = {
  getAllPostRetweets,
  createRetweet,
  updateRetweet,
  deleteRetweet,
};
