const postModel = require("../models/postModel");
const { StatusCodes } = require("http-status-codes");

const postController = async (req, res) => {
  const { title } = req.body;

  const post = await postModel.create({ title });

  res.status(StatusCodes.CREATED).json({ post });
};

module.exports = postController;
