const { check, body } = require("express-validator");
const bcrypt = require("bcrypt");
const slugify = require("slugify");
const validatorMiddleware = require("../../middleWares/validatorMiddleware");
const Users = require("../../models/userModel");

exports.getUserValidator = [
  check("id").isMongoId().withMessage("invalid User id format"),

  validatorMiddleware,
];

exports.createUserValidator = [
  check("name")
    .notEmpty()
    .withMessage("User name is required")
    .isLength({ min: 2 })
    .withMessage("the name is too short"),
  body("name").custom((value, { req }) => {
    req.body.slug = slugify(value);
    return true;
  }),
  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  check("confirmPassword")
    .notEmpty()
    .withMessage("Please confirm your password")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),

  check("profileImg").optional(),

  check("role").optional(),

  check("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("invalid email address")
    .custom((value) =>
      Users.findOne({ email: value }).then((user) => {
        if (user) {
          return Promise.reject(new Error("email already exists"));
        }
      })
    ),

  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("invalid mobile number"),

  validatorMiddleware,
];

exports.updateUserValidator = [
  check("id").isMongoId().withMessage("invalid User id format"),
  check("name")
    .optional()
    .isLength({ min: 2 })
    .withMessage("the name is too short"),

  body("name").custom((value, { req }) => {
    req.body.slug = slugify(value);
    return true;
  }),

  check("profileImg").optional(),

  check("role").optional(),

  check("email")
    .optional()
    .isEmail()
    .withMessage("invalid email address")
    .custom((value) =>
      Users.findOne({ email: value }).then((user) => {
        if (user) {
          return Promise.reject(new Error("email already exists"));
        }
      })
    ),

  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("invalid mobile number"),
  validatorMiddleware,
];

exports.changePasswordValidator = [
  check("id").isMongoId().withMessage("invalid User id format"),
  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .custom(async (value, { req }) => {
      const user = await Users.findById(req.params.id);

      if (!user) {
        throw new Error("user not found");
      }
      const iscorrectPassword = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );

      if (!iscorrectPassword) {
        throw new Error("current password is incorrect");
      }
    }),
  check("confirmPassword")
    .notEmpty()
    .withMessage("Please confirm your password")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
  check("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),
  validatorMiddleware,
];

exports.changeMyPasswordValidator = [
  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .custom(async (value, { req }) => {
      const user = await Users.findById(req.user._id);

      const iscorrectPassword = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );

      if (!iscorrectPassword) {
        throw new Error("current password is incorrect");
      }
    }),
  check("confirmPassword")
    .notEmpty()
    .withMessage("Please confirm your password")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
  check("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),
  validatorMiddleware,
];

exports.deleteUserValidator = [
  check("id").isMongoId().withMessage("invalid User id format"),
  validatorMiddleware,
];

exports.updateLoggedUserValidator = [
  check("name")
    .optional()
    .isLength({ min: 2 })
    .withMessage("the name is too short"),

  body("name").custom((value, { req }) => {
    req.body.slug = slugify(value);
    return true;
  }),

  check("email")
    .optional()
    .isEmail()
    .withMessage("invalid email address")
    .custom((value) =>
      Users.findOne({ email: value }).then((user) => {
        if (user) {
          return Promise.reject(new Error("email already exists"));
        }
      })
    ),

  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("invalid mobile number"),
  validatorMiddleware,
];
