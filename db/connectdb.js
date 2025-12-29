const mongoose = require("mongoose");

const connectdb = (url) => {
  return mongoose
    .connect(url)
    .then(() => console.log("Connected..."))
    .catch((err) => console.log(err));
};

module.exports = connectdb;
