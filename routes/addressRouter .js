const express = require("express");

const {
  addAddress,
  removeFromAddress,
  getUserAddresses,
} = require("../services/addressServices ");

const authService = require("../services/authServices");

const router = express.Router();

router.use(authService.protect, authService.allowedTo("user"));

router.route("/").post(addAddress).get(getUserAddresses);

router.route("/:addressId").delete(removeFromAddress);

module.exports = router;
