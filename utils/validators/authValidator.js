const { check } = require("express-validator");
const slugify = require("slugify");
const validatorMiddleware = require("../../middleware/validatorMiddleware");
const User = require("../../models/user");

exports.signUpValidator = [
  check("name")
    .notEmpty()
    .withMessage("User name is required.")
    .isLength({ min: 1 })
    .withMessage("User name should be at least 1 characters long.")
    .isLength({ max: 30 })
    .withMessage("User name should not exceed 30 characters.")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("email")
    .notEmpty()
    .withMessage("User email is required.")
    .isEmail()
    .withMessage("Invalid email address")
    .custom(async (val) => {
      const user = await User.findOne({ email: val });
      if (user) {
        throw new Error("Email already in use");
      }
    }),

  check("password")
    .notEmpty()
    .withMessage("User password is required.")
    .isLength({ min: 6 })
    .withMessage("User password should be at least 6 characters long.")
    .custom((password, { req }) => {
      if (password !== req.body.passwordConfirm) {
        throw new Error(
          "User password  & User password conformation don't match"
        );
      }
      return true;
    }),
  check("passwordConfirm")
    .notEmpty()
    .withMessage("User password conformation is required."),

  validatorMiddleware,
];

exports.signInValidator = [
  check("email")
    .notEmpty()
    .withMessage("User email is required.")
    .isEmail()
    .withMessage("Invalid email address"),

  check("password")
    .notEmpty()
    .withMessage("User password is required.")
    .isLength({ min: 6 })
    .withMessage("User password should be at least 6 characters long."),

  validatorMiddleware,
];
