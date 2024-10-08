const { check, body } = require("express-validator");
const slugify = require("slugify");
const validatorMiddleware = require("../../middleWares/validatorMiddleware");
const Cateqory = require("../../models/categoryModel");

const SubCategory = require("../../models/subCategoryModel");

exports.createProductValidator = [
  check("title")
    .notEmpty()
    .withMessage("product name is required")
    .isLength({ min: 3, max: 32 })
    .withMessage("product name must be between 3 and 32 characters"),
  check("description")
    .notEmpty()
    .withMessage("product description is required")
    .isLength({ min: 3, max: 200 })
    .withMessage("product description must be between 3 and 200 characters"),
  check("price")
    .notEmpty()
    .withMessage("product price is required")
    .isNumeric()
    .withMessage("product price must be numeric")
    .isLength({ min: 1, max: 200 })
    .withMessage("product price must be between 1 and 200 characters"),
  check("quantity")
    .notEmpty()
    .withMessage("product quantity is required")
    .isNumeric()
    .withMessage("product quantity must be numeric"),
  check("category")
    .notEmpty()
    .withMessage("product category is required")
    .isMongoId()
    .withMessage("invalid category id format")
    .custom((categoryId) =>
      Cateqory.findById(categoryId).then((category) => {
        if (!category) throw new Error("category not found");
      })
    ),
  check("sold")
    .optional()
    .notEmpty()
    .withMessage("product sold is required")
    .isNumeric()
    .withMessage("product sold must be numeric"),
  check("priceAfterDiscount")
    .optional()
    .toFloat()
    .notEmpty()
    .withMessage("product price after discount is required")
    .isNumeric()
    .withMessage("product price after discount must be numeric")
    .custom((value, { req }) => {
      if (req.body.price <= value) {
        throw new Error("product price after discount must be less than price");
      }
      return true;
    }),
  check("brand")
    .optional()
    .notEmpty()
    .withMessage("product brand is required")
    .isMongoId()
    .withMessage("invalid brand id format"),
  check("subCategories")
    .optional()
    .notEmpty()
    .withMessage("product subCategory is required")
    .isMongoId()
    .withMessage("invalid subCategory id format")
    .custom((subCategoryId) =>
      SubCategory.find({ _id: { $exists: true, $in: subCategoryId } }).then(
        (result) => {
          if (result.length < 1 || result.length !== subCategoryId.length) {
            return Promise.reject(new Error("subCategory not found"));
          }
        }
      )
    )
    .custom((val, { req }) =>
      SubCategory.find({ category: req.body.category }).then(
        (subcategories) => {
          const subCategoriesinDb = [];
          subcategories.forEach((subCategory) => {
            subCategoriesinDb.push(subCategory._id.toString());
          });
          const checker = (target, arr) => target.every((v) => arr.includes(v));
          if (!checker(val, subCategoriesinDb)) {
            return Promise.reject(
              new Error("subCategory not belong to this category")
            );
          }
        }
      )
    ),
  check("ratingAverage")
    .optional()
    .notEmpty()
    .withMessage("product ratingAverage is required")
    .isNumeric()
    .withMessage("product ratingAverage must be numeric")
    .isLength({ min: 0, max: 5 })
    .withMessage("product ratingAverage must be between 0 and 5"),
  check("ratingQuantity")
    .optional()
    .notEmpty()
    .withMessage("product ratingQuantity is required")
    .isNumeric()
    .withMessage("product ratingQuantity must be numeric"),
  check("colors")
    .optional()
    .notEmpty()
    .withMessage("product colors is required")
    .isArray()
    .withMessage("product colors must be an array"),
  check("images")
    .optional()
    .notEmpty()
    .withMessage("product images is required")
    .isArray()
    .withMessage("product images must be an array"),
  check("imagesCover")
    .optional()
    .notEmpty()
    .withMessage("product cover image is required"),
  body("title").custom((value, { req }) => {
    req.body.slug = slugify(value);
    return true;
  }),
  validatorMiddleware,
];

exports.updateProductValidator = [
  check("id")
    .notEmpty()
    .withMessage("product id is required")
    .isMongoId()
    .withMessage("invalid product id format"),
  body("title")
    .optional()
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),
  validatorMiddleware,
];

exports.deleteProductValidator = [
  check("id")
    .notEmpty()
    .withMessage("product id is required")
    .isMongoId()
    .withMessage("invalid product id format"),
  validatorMiddleware,
];

exports.getProductValidator = [
  check("id").optional().isMongoId().withMessage("invalid product id format"),
  validatorMiddleware,
];
