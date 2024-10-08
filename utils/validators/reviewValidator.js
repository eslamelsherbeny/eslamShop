const { check } = require("express-validator");
const validatorMiddleware = require("../../middleWares/validatorMiddleware");
const Review = require("../../models/reviewModel");

exports.getReviewValidator = [
  check("id").isMongoId().withMessage("invalid review id format"),

  validatorMiddleware,
];

exports.createReviewValidator = [
  check("title").optional(),
  check("rating")
    .notEmpty()
    .withMessage("review rating is required")
    .isFloat({ min: 1, max: 5 })
    .withMessage("review rating must be between 1 and 5"),
  check("user").isMongoId().withMessage("invalid user id format"),
  check("product")
    .isMongoId()
    .withMessage("invalid product id format")
    .custom((value, { req }) =>
      Review.findOne({ user: req.user._id, product: req.body.product }).then(
        (review) => {
          if (review) {
            return Promise.reject(
              new Error("You already submitted a review for this product")
            );
          }
        }
      )
    ),
  validatorMiddleware,
];

exports.updateReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("invalid review id format")
    .custom((value, { req }) =>
      Review.findById(value).then((review) => {
        if (!review) {
          return Promise.reject(
            new Error(`invalid review id to this id${value}`)
          );
        }
        if (review.user._id.toString() !== req.user._id.toString()) {
          return Promise.reject(
            new Error(`you are not allowed to update this review`)
          );
        }
      })
    ),

  validatorMiddleware,
];

exports.deleteReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("invalid review id format")
    .custom((value, { req }) => {
      if (req.user.role === "user") {
        return Review.findById(value).then((review) => {
          if (!review) {
            return Promise.reject(
              new Error(`invalid review id to this id${value}`)
            );
          }
          if (review.user._id.toString() !== req.user._id.toString()) {
            return Promise.reject(
              new Error(`you are not allowed to delete this review`)
            );
          }
        });
      }
    }),
  validatorMiddleware,
];
