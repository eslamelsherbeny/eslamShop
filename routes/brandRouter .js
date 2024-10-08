const express = require("express");

const {
  getBrandValidator,
  createBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} = require("../utils/validators/brandValidator ");

const {
  createBrand,
  getAllBrand,
  getBrand,
  updateBrand,
  deleteBrand,
  uploadBrandImage,
  resizeImage,
} = require("../services/brandServices ");
const authService = require("../services/authServices");

const router = express.Router();

router
  .route("/")
  .post(
    authService.protect,
    authService.allowedTo("admin", "manager"),
    uploadBrandImage,
    resizeImage,
    createBrandValidator,
    createBrand
  )
  .get(authService.protect, getAllBrand);

router
  .route("/:id")
  .get(authService.protect, getBrandValidator, getBrand)
  .put(
    authService.protect,
    authService.allowedTo("admin", "manager"),
    uploadBrandImage,
    resizeImage,
    updateBrandValidator,
    updateBrand
  )
  .delete(
    authService.protect,
    authService.allowedTo("admin", "manager"),
    deleteBrandValidator,
    deleteBrand
  );

module.exports = router;
