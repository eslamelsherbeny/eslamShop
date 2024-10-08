const { check, body } = require("express-validator");
const slugify = require("slugify");
const validatorMiddleware = require("../../middleWares/validatorMiddleware");

exports.getCategoryValidator = [
  check("id").isMongoId().withMessage("invalid category id format"),
  validatorMiddleware,
];

exports.createCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("category name is required")
    .isLength({ min: 3, max: 32 })
    .withMessage("category name must be between 3 and 32 characters"),
  body("name").custom((value, { req }) => {
    req.body.slug = slugify(value);
    return true;
  }),
  validatorMiddleware,
];

exports.updateCategoryValidator = [
  check("id").isMongoId().withMessage("invalid category id format"),
  body("name")
    .optional()
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),
  validatorMiddleware,
];

exports.deleteCategoryValidator = [
  check("id").isMongoId().withMessage("invalid category id format"),
  validatorMiddleware,
];
