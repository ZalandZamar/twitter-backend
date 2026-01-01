const express = require("express");
const router = express.Router();
const {
  getAllPosts,
  getUserAllPosts,
  getUserPost,
  createPost,
  updatePost,
  deletePost,
} = require("../controllers/postController");

router.route("/").get(getAllPosts).post(createPost);
router.route("/:postId").get(getUserPost).patch(updatePost).delete(deletePost);
router.route("/user/:userId").get(getUserAllPosts);

module.exports = router;
