const express = require("express");
const router = express.Router();
const { register, logIn } = require("../controllers/authController");

router.route("/register").post(register);
router.route("/login").post(logIn);

module.exports = router;
