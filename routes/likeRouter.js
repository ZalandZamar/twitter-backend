const express = require("express");
const router = express.Router();
const likePost = require("../controllers/likeController");

router.route("/:postId").post(likePost);

module.exports = router;
