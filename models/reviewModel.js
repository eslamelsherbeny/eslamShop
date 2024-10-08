const mongoose = require("mongoose");
const Product = require("./productModel");

const reviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    rating: {
      type: Number,
      min: [1, "Rating must be between 1 and 5"],
      max: [5, "Rating must be between 1 and 5"],
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: [true, "review must belong to a Product"],
    },

    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "review must belong to a user"],
    },
  },
  { timestamps: true }
);

reviewSchema.statics.calcAverageRatingsAndQuantity = async function (
  productId
) {
  const result = await this.aggregate([
    {
      $match: { product: productId },
    },
    {
      $group: {
        _id: "$product",
        numRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  if (result.length > 0) {
    const roundedAvgRating = Math.round(result[0].avgRating * 10) / 10;

    await Product.findByIdAndUpdate(productId, {
      ratingQuantity: result[0].numRating,
      ratingAverage: roundedAvgRating,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      ratingsQuantity: 0,
      ratingsAverage: 0,
    });
  }
};

reviewSchema.post("save", function () {
  this.constructor.calcAverageRatingsAndQuantity(this.product);
});

reviewSchema.post("remove", function () {
  this.constructor.calcAverageRatingsAndQuantity(this.product);
});

// console.log(stats);

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name ",
  });
  next();
});

module.exports = mongoose.model("Review", reviewSchema);
