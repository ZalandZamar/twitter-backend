const notificationsModel = require("../models/notificitionsModel");
const { StatusCodes } = require("http-status-codes");
const { BadRequest } = require("../errors");

const getAllNotifictions = async (req, res) => {
  const {
    user: { userId },
  } = req;

  const notifications = await notificationsModel.find({ recipient: userId });

  res.status(StatusCodes.OK).json({ notifications });
};

module.exports = {
  getAllNotifictions,
};
