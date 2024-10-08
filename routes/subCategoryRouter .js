const express = require("express");
const {
  createSubCategory,
  getSubCategory,
  getAllSubCategory,
  updateSubCategory,
  deleteSubCategory,
  setCategoryIdToBody,
  createFilterObject,
} = require("../services/subcategoryServices ");

const {
  createSubCategoryValidator,
  getSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
} = require("../utils/validators/subCategoryValidator ");

const authService = require("../services/authServices");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(
    authService.protect,
    authService.allowedTo("admin", "manager"),
    setCategoryIdToBody,
    createSubCategoryValidator,
    createSubCategory
  )
  .get(authService.protect, createFilterObject, getAllSubCategory);

router
  .route("/:id")
  .get(authService.protect, getSubCategoryValidator, getSubCategory)
  .put(
    authService.protect,
    authService.allowedTo("admin", "manager"),
    updateSubCategoryValidator,
    updateSubCategory
  )
  .delete(
    authService.protect,
    authService.allowedTo("admin", "manager"),
    deleteSubCategoryValidator,
    deleteSubCategory
  );

module.exports = router;
