const { StatusCodes } = require("http-status-codes");
const commentsModel = require("../models/commentsModel");
const postModel = require("../models/postModel");
const { BadRequest } = require("../errors");

const getAllPostComments = async (req, res) => {
  const {
    user: { userId },
    params: { postId },
  } = req;

  const comments = await commentsModel.find({
    createdBy: userId,
    post: postId,
  });

  res.status(StatusCodes.OK).json({ comments });
};

const createComment = async (req, res) => {
  const {
    body: { comment },
    user: { userId },
    params: { postId },
  } = req;

  const validatePost = await postModel.findOne({ _id: postId });

  if (!validatePost) {
    throw new BadRequest("Post not found.");
  }

  const comments = await commentsModel.create({
    comment,
    createdBy: userId,
    post: postId,
  });

  res.status(StatusCodes.CREATED).json({ comments });
};

const updateComment = async (req, res) => {
  const {
    body: { comment },
    params: { commentId },
    user: { userId },
  } = req;

  const comments = await commentsModel.findOneAndUpdate(
    { _id: commentId, createdBy: userId },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(StatusCodes.OK).json({ comments });
};
//6954b6095431caa91a6a1bf0
const deleteComment = async (req, res) => {
  const {
    user: { userId },
    params: { commentId },
  } = req;

  const comments = await commentsModel.findOneAndDelete({
    _id: commentId,
    createdBy: userId,
  });

  res.status(StatusCodes.OK).json({ message: "comment deleted" });
};

module.exports = {
  getAllPostComments,
  createComment,
  updateComment,
  deleteComment,
};
