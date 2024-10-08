const { check, body } = require("express-validator");

const slugify = require("slugify");
const validatorMiddleware = require("../../middleWares/validatorMiddleware");

exports.getSubCategoryValidator = [
  check("id")
    .notEmpty()
    .withMessage("subcategory id is required")
    .isMongoId()
    .withMessage("invalid Subcategory id format"),
  validatorMiddleware,
];

exports.createSubCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Subcategory name is required")
    .isLength({ min: 2, max: 32 })
    .withMessage("category name must be between 2 and 32 characters"),
  check("category")
    .notEmpty()
    .withMessage("category id is required")
    .isMongoId()
    .withMessage("invalid category id format"),
  body("name").custom((value, { req }) => {
    req.body.slug = slugify(value);
    return true;
  }),
  validatorMiddleware,
];

exports.updateSubCategoryValidator = [
  check("id")
    .notEmpty()
    .withMessage("subcategory id is required")
    .isMongoId()
    .withMessage("invalid Subcategory id format"),
  body("name").custom((value, { req }) => {
    req.body.slug = slugify(value);
    return true;
  }),
  validatorMiddleware,
];

exports.deleteSubCategoryValidator = [
  check("id")
    .notEmpty()
    .withMessage("subcategory id is required")
    .isMongoId()
    .withMessage("invalid subcategory id format"),
  validatorMiddleware,
];
