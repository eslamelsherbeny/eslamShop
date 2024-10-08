// creat wish list

const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

exports.addAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { addresses: req.body },
    },
    {
      new: true,
    }
  );

  res.status(200).json({
    status: "success",
    result: user.addresses.length,
    message: "address added",
    data: user.addresses,
  });
});

exports.removeFromAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { addresses: { _id: req.params.addressId } },
    },
    {
      new: true,
    }
  );
  res.status(200).json({
    status: "success",
    result: user.addresses.length,
    message: "address removed",
    data: user.addresses,
  });
});

exports.getUserAddresses = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("addresses");
  res.status(200).json({
    status: "success",
    result: user.addresses.length,
    data: user.addresses,
  });
});
