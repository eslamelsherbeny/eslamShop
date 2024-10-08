const express = require("express");

const {
  addToWishlist,
  removeFromWishlist,
  getUserWishlist,
} = require("../services/wishlistServices");

const authService = require("../services/authServices");

const router = express.Router();

router.use(authService.protect, authService.allowedTo("user"));

router.route("/").post(addToWishlist).get(getUserWishlist);

router.route("/:productId").delete(removeFromWishlist);

module.exports = router;
