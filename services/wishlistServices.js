// creat wish list

const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

exports.addToWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { wishlist: req.body.productId },
    },
    {
      new: true,
    }
  );

  res.status(200).json({
    status: "success",
    result: user.wishlist.length,
    message: "product added to wishlist",
    data: user.wishlist,
  });
});

exports.removeFromWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { wishlist: req.params.productId },
    },
    {
      new: true,
    }
  );
  res.status(200).json({
    status: "success",
    result: user.wishlist.length,
    message: "product removed from wishlist",
    data: user.wishlist,
  });
});

exports.getUserWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("wishlist");
  res.status(200).json({
    status: "success",
    result: user.wishlist.length,
    data: user.wishlist,
  });
});
