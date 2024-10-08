const express = require("express");

const {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("../utils/validators/categoryValidator");
const {
  createCategory,
  getAllCategory,
  getCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
  resizeImage,
} = require("../services/categoryServices");

const authService = require("../services/authServices");

const subCategoryRouter = require("./subCategoryRouter ");

const router = express.Router();

router.use("/:categoryId/subcategories", subCategoryRouter);

router
  .route("/")
  .post(
    authService.protect,
    authService.allowedTo("admin", "manager"),
    uploadCategoryImage,
    resizeImage,
    createCategoryValidator,
    createCategory
  )
  .get(authService.protect, getAllCategory);

router
  .route("/:id")
  .get(authService.protect, getCategoryValidator, getCategory)
  .put(
    authService.protect,
    authService.allowedTo("admin", "manager"),
    uploadCategoryImage,
    resizeImage,
    updateCategoryValidator,
    updateCategory
  )
  .delete(
    authService.protect,
    authService.allowedTo("admin", "manager"),
    deleteCategoryValidator,
    deleteCategory
  );

module.exports = router;
