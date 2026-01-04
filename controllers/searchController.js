const { StatusCodes } = require("http-status-codes");
const usersModel = require("../models/userModel");

const searchController = async (req, res) => {
  const {
    query: { q },
  } = req;

  const searcrhResults = await usersModel
    .find(
      { $text: { $search: q } },
      { name: 1, email: 1, score: { $meta: "textScore" } }
    )
    .sort({ score: { $meta: "textScore" } })
    .limit(10);

  res.status(StatusCodes.OK).json({ searcrhResults });
};

module.exports = searchController;
