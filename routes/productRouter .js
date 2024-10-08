const express = require("express");
const {
  getProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require("../utils/validators/productValidator");
const {
  createProduct,
  getAllProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
  resizeImage,
} = require("../services/productServices ");

const authService = require("../services/authServices");

const reviewRouter = require("./reviewRouter");

const router = express.Router();

router.use("/:productId/reviews", reviewRouter);

router
  .route("/")
  .post(
    authService.protect,
    authService.allowedTo("admin", "manager"),
    uploadProductImage,
    resizeImage,
    createProductValidator,
    createProduct
  )
  .get(authService.protect, getAllProduct);

router
  .route("/:id")
  .get(authService.protect, getProductValidator, getProduct)
  .put(
    authService.protect,
    authService.allowedTo("admin", "manager"),
    updateProductValidator,
    updateProduct
  )
  .delete(
    authService.protect,
    authService.allowedTo("admin", "manager"),
    deleteProductValidator,
    deleteProduct
  );

module.exports = router;
