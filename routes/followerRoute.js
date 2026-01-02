const express = require("express");
const router = express.Router();
const {
  getAllUserFollowers,
  createFollower,
  deleteFollower,
} = require("../controllers/followerController");

router.route("/:id").get(getAllUserFollowers);
router.route("/:id").post(createFollower);
router.route("/:id").delete(deleteFollower);

module.exports = router;
