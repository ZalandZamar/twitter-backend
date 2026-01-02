const express = require("express");
const router = express.Router();
const {
  getAllNotifictions,
} = require("../controllers/notificationsController");

router.route("/").get(getAllNotifictions);

module.exports = router;
