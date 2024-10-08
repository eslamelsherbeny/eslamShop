const express = require("express");

const {
  addToCart,
  getUserCart,
  removeCartItem,
  clearCart,
  updateCartQuantity,
  applyCoupon,
} = require("../services/cartServices  ");

const authService = require("../services/authServices");

const router = express.Router();

router.use(authService.protect, authService.allowedTo("user"));

router.route("/").post(addToCart).get(getUserCart).delete(clearCart);

router.put("/applyCoupon", applyCoupon);

router.route("/:id").put(updateCartQuantity).delete(removeCartItem);

module.exports = router;
