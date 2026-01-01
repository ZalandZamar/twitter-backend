const express = require("express");
const router = express.Router();
const handleLogOut = require("../controllers/logoutController");

router.route("/logout").get(handleLogOut);

module.exports = router;
