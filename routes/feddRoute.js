const express = require("express");
const router = express.Router();
const { getFollowingPosts } = require("../controllers/feedController");

router.route("/").get(getFollowingPosts);

module.exports = router;
