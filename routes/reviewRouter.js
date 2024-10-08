const express = require("express");

const {
  createReviewValidator,
  updateReviewValidator,
  deleteReviewValidator,
} = require("../utils/validators/reviewValidator");

const {
  createReview,
  getAllReview,
  getReview,
  updateReview,
  deleteReview,
  setProductIdToBody,
  createFilterObject,
} = require("../services/reviewServices");

const authService = require("../services/authServices");

const router = express.Router({
  mergeParams: true,
});

router
  .route("/")
  .post(
    authService.protect,
    authService.allowedTo("user"),
    setProductIdToBody,
    createReviewValidator,
    createReview
  )
  .get(createFilterObject, getAllReview);

router
  .route("/:id")
  .get(getReview)
  .put(
    authService.protect,
    authService.allowedTo("user"),
    updateReviewValidator,
    updateReview
  )
  .delete(
    authService.protect,
    authService.allowedTo("user", "admin", "manager"),
    deleteReviewValidator,
    deleteReview
  );

module.exports = router;
