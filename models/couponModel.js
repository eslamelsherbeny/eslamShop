// couponModel

const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "coupon name is required"],
      unique: [true, "coupon name must be unique"],
    },
    expiry: {
      type: Date,
      required: [true, "coupon expiry is required"],
    },
    discount: {
      type: Number,
      required: [true, "coupon discount is required"],
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Coupon", couponSchema);
