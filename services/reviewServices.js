const ReviewModel = require("../models/reviewModel");

const factory = require("./handlersFactory");

// create category

exports.setProductIdToBody = async (req, res, next) => {
  if (!req.body.product) {
    req.body.product = req.params.productId;
    req.body.user = req.user._id;
  }

  next();
};

exports.createReview = factory.createOne(ReviewModel);

// get all Review

exports.createFilterObject = (req, res, next) => {
  let filterObject = {};
  if (req.params.productId) filterObject = { product: req.params.productId };

  req.filterObject = filterObject;
  next();
};

exports.getAllReview = factory.getAll(ReviewModel);

// get specific Review

exports.getReview = factory.getOne(ReviewModel);

// update Review

exports.updateReview = factory.updateOne(ReviewModel);

// delete Review
exports.deleteReview = factory.deleteOne(ReviewModel);
