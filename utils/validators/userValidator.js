const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");
const slugify = require("slugify");
const User = require("../../models/user");

exports.getUserValidator = [
  check("id")
    .isMongoId()
    .withMessage("The provided User ID is not a valid MongoDB ObjectId."),
  validatorMiddleware,
];

exports.createUserValidator = [
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
    .withMessage("Invalid email ")
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("email already in user"));
        }
      })
    ),
  check("password")
    .notEmpty()
    .withMessage("User password is required.")
    .isLength({ min: 6 })
    .withMessage("User password should be at least 6 characters long."),
  check("phone")
    .optional()
    .isMobilePhone(["tr-TR"])
    .withMessage("Invalid phone number only TR Phone numbersaccepted !!"),

  check("profileImage").optional(),
  check("role").optional(),

  validatorMiddleware,
];

exports.updateUserValidator = [
  check("id")
    .isMongoId()
    .withMessage("The provided User ID is not a valid MongoDB ObjectId."),
  body("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Invalid email address")
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("E-mail already in user"));
        }
      })
    ),
  check("phone")
    .optional()
    .isMobilePhone(["tr-TR"])
    .withMessage("Invalid phone number only TR Phone numbersaccepted !!"),
  check("profileImg").optional(),
  check("role").optional(),
  validatorMiddleware,
];

exports.deleteUserValidator = [
  check("id")
    .isMongoId()
    .withMessage("The provided User ID is not a valid MongoDB ObjectId."),
  validatorMiddleware,
];
