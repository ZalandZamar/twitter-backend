const { StatusCodes } = require("http-status-codes");
const postModel = require("../models/postModel");
const { BadRequest, NotFound } = require("../errors");

const likePost = async (req, res) => {
  const {
    user: { userId },
    params: { postId },
  } = req;

  const post = await postModel.findOne({ _id: postId });

  if (!post) {
    throw new NotFound("Post not found.");
  }

  const toggleLike = async (operator, inc) => {
    return await postModel.findOneAndUpdate(
      { _id: postId },
      {
        $inc: { likesCount: inc },
        [operator]: { likedBy: userId },
      },
      { new: true }
    );
  };

  const alreadyLiked = await postModel.findOne({
    likedBy: userId,
    _id: postId,
  });

  let updatedPost;
  if (alreadyLiked) {
    updatedPost = await toggleLike("$pull", -1);
  } else {
    updatedPost = await toggleLike("$addToSet", 1);
  }

  res.status(StatusCodes.CREATED).json({ post: updatedPost });
};

module.exports = likePost;
