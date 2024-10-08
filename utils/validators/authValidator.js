const { check, body } = require("express-validator");

const slugify = require("slugify");
const validatorMiddleware = require("../../middleWares/validatorMiddleware");
const Users = require("../../models/userModel");

exports.signUpValidator = [
  check("name")
    .notEmpty()
    .withMessage("User name is required")
    .isLength({ min: 2 })
    .withMessage("the name is too short"),
  body("name").custom((value, { req }) => {
    req.body.slug = slugify(value);
    return true;
  }),

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

  validatorMiddleware,
];

exports.logInValidator = [
  check("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("invalid email address"),

  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  validatorMiddleware,
];
exports.resetPasswordValidator = [
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

  validatorMiddleware,
];
