const asyncHandler = require("express-async-handler");
const Cart = require("../models/cartModel");
const ApiError = require("../utils/apiError");
const Product = require("../models/productModel");
const Coupon = require("../models/couponModel");

// create category

const calculateTotalPrice = (cart) => {
  let totalPrice = 0;
  cart.cartItems.forEach((item) => {
    totalPrice += item.price * item.quantity;
  });
  cart.totalCartPrice = totalPrice;

  cart.totalPriceAfterDiscount = undefined;
  return totalPrice;
};

exports.addToCart = asyncHandler(async (req, res) => {
  const { productId, color } = req.body;
  let cart = await Cart.findOne({ user: req.user._id });
  const product = await Product.findById(productId);
  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      cartItems: [
        {
          product: productId,
          color,
          price: product.price,
        },
      ],
    });
  } else {
    const itemIndex = cart.cartItems.findIndex(
      (cartItem) =>
        cartItem.product.toString() === productId && cartItem.color === color
    );

    if (itemIndex > -1) {
      const cartItem = cart.cartItems[itemIndex];

      cartItem.quantity += 1;

      cart.cartItems[itemIndex] = cartItem;
    } else {
      cart.cartItems.push({ product: productId, color, price: product.price });
    }
  }

  calculateTotalPrice(cart);

  await cart.save();
  res.status(200).json({
    status: "success",
    message: " Product added Successfully to cart",
    data: cart,
  });
});

exports.getUserCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new ApiError("there is no cart for this user ", 404));
  }
  res.status(200).json({
    status: "success",
    message: "Cart fetched successfully",
    result: cart.cartItems.length,
    data: cart,
  });
});

exports.updateCartQuantity = asyncHandler(async (req, res, next) => {
  const { quantity } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new ApiError("Cart not found", 404));
  }
  const itemIndex = cart.cartItems.findIndex(
    (cartItem) => cartItem._id.toString() === req.params.id
  );

  if (itemIndex > -1) {
    const cartItem = cart.cartItems[itemIndex];
    cartItem.quantity = quantity;
    cart.cartItems[itemIndex] = cartItem;
  }
  calculateTotalPrice(cart);
  await cart.save();
  res.status(200).json({
    status: "success",
    result: cart.cartItems.length,
    message: "Cart item updated successfully",
    data: cart,
  });
});

exports.removeCartItem = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    {
      $pull: { cartItems: { _id: req.params.id } },
    },
    { new: true }
  );
  if (!cart) {
    return next(new ApiError("Cart not found", 404));
  }

  calculateTotalPrice(cart);
  await cart.save();
  res.status(200).json({
    status: "success",
    result: cart.cartItems.length,
    message: "Cart item deleted successfully",
    data: cart,
  });
});

exports.clearCart = asyncHandler(async (req, res, next) => {
  await Cart.findOneAndDelete({ user: req.user._id });
  res.status(204).send();
});

exports.applyCoupon = asyncHandler(async (req, res, next) => {
  const { couponName } = req.body;
  const coupon = await Coupon.findOne({
    name: couponName,
    expiry: { $gte: Date.now() },
  });

  if (!coupon) {
    return next(new ApiError("Coupon not found", 404));
  }
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new ApiError("Cart not found", 404));
  }

  const totalPrice = cart.totalCartPrice;

  const totalPriceAfterDiscount = (
    totalPrice -
    (totalPrice * coupon.discount) / 100
  ).toFixed(2);

  cart.totalPriceAfterDiscount = totalPriceAfterDiscount;
  await cart.save();
  res.status(200).json({
    status: "success",
    result: cart.cartItems.length,
    message: "Coupon applied successfully",
    data: cart,
  });
});
