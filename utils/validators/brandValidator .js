const { check, body } = require("express-validator");
const slugify = require("slugify");
const validatorMiddleware = require("../../middleWares/validatorMiddleware");

exports.getBrandValidator = [
  check("id").isMongoId().withMessage("invalid Brand id format"),

  validatorMiddleware,
];

exports.createBrandValidator = [
  check("name")
    .notEmpty()
    .withMessage("Brand name is required")
    .isLength({ min: 2, max: 32 })
    .withMessage("Brand name must be between 2 and 32 characters"),
  body("name").custom((value, { req }) => {
    req.body.slug = slugify(value);
    return true;
  }),
  validatorMiddleware,
];

exports.updateBrandValidator = [
  check("id").isMongoId().withMessage("invalid Brand id format"),
  body("name")
    .optional()
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),
  validatorMiddleware,
];

exports.deleteBrandValidator = [
  check("id").isMongoId().withMessage("invalid Brand id format"),
  validatorMiddleware,
];
