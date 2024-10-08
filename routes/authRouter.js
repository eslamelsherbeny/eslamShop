const express = require("express");

const {
  signUpValidator,
  logInValidator,
  resetPasswordValidator,
} = require("../utils/validators/authValidator");

const {
  signup,
  login,
  forgetPassword,
  verifyPasswordResetCode,
  resetPassword,
} = require("../services/authServices");

const router = express.Router();

router.route("/signup").post(signUpValidator, signup);

router.route("/login").post(logInValidator, login);

router.post("/forgetPassword", forgetPassword);

router.post("/verifyPasswordResetCode", verifyPasswordResetCode);

router.post("/resetPassword", resetPasswordValidator, resetPassword);

module.exports = router;
