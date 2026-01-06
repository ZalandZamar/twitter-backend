const { BadRequest, NotFound } = require("../errors");
const notFound = require("../middleware/not-found");
const postModel = require("../models/postModel");
const { StatusCodes } = require("http-status-codes");

const getAllPosts = async (req, res) => {
  const post = await postModel.find({});

  if (!post) {
    throw new NotFound("Posts not found");
  }

  res.status(StatusCodes.OK).json({ post, NbH: post.length });
};

const getUserAllPosts = async (req, res) => {
  const user = req.user.userId;

  const post = await postModel.find({ createdBy: user });

  if (!post) {
    throw new NotFound("Post not found");
  }

  res.status(StatusCodes.OK).json({ post, nbH: post.length });
};

const getUserPost = async (req, res) => {
  const {
    user: { userId },
    params: { postId },
  } = req;

  const post = await postModel.findOne({ _id: postId, createdBy: userId });

  if (!post) {
    throw new NotFound("Post not found");
  }

  res.status(StatusCodes.OK).json({ post });
};

const createPost = async (req, res) => {
  const { title } = req.body;

  const post = await postModel.create({ title, createdBy: req.user.userId });

  if (!post) {
    throw new NotFound("Post not found");
  }

  res.status(StatusCodes.CREATED).json({ post });
};

const updatePost = async (req, res) => {
  const {
    body: { title },
    user: { userId },
    params: { postId },
  } = req;

  if (!title) {
    throw new BadRequest("please provide the update fields");
  }

  const post = await postModel.findOneAndUpdate(
    { _id: postId, createdBy: userId },
    { title },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!post) {
    throw new NotFound("Post not found");
  }

  res.status(StatusCodes.OK).json({ post });
};

const deletePost = async (req, res) => {
  const {
    user: { userId },
    params: { postId },
  } = req;

  const post = await postModel.findOneAndDelete({
    _id: postId,
    createdBy: userId,
  });

  if (!post) {
    throw new NotFound("Post not found");
  }

  res.status(StatusCodes.OK).json({ post });
};

module.exports = {
  getAllPosts,
  getUserAllPosts,
  getUserPost,
  createPost,
  updatePost,
  deletePost,
};
