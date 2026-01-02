const express = require("express");
const router = express.Router();
const {
  getAllPostComments,
  createComment,
  updateComment,
  deleteComment,
} = require("../controllers/commentsController");

router.route("/:postId").get(getAllPostComments).post(createComment);
router.route("/:commentId").patch(updateComment).delete(deleteComment);

module.exports = router;
