const customError = require("./CustomError");
const BadRequest = require("./BadRequest");
const NotFound = require("./Not-Found");
const UnuthenticatedError = require("./UnauthenticatedError");

module.exports = {
  customError,
  BadRequest,
  NotFound,
  UnuthenticatedError,
};
