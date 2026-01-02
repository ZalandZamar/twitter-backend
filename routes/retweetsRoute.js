const express = require("express");
const router = express.Router();
const {
  getAllPostRetweets,
  createRetweet,
  updateRetweet,
  deleteRetweet,
} = require("../controllers/retweetsController");

router.route("/:postId").get(getAllPostRetweets).post(createRetweet);
router.route("/:retweetId").patch(updateRetweet).delete(deleteRetweet);

module.exports = router;
