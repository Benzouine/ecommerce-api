const { check, body } = require("express-validator");
const bcrypt = require("bcrypt");
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

  check("phone")
    .optional()
    .isMobilePhone(["tr-TR"])
    .withMessage("Invalid phone number only TR Phone numbers accepted !!"),

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
    .optional()
    .isEmail()
    .withMessage("Invalid email address")
    .custom(async (val, { req }) => {
      const user = await User.findOne({ email: val });
      if (user) {
        throw new Error("Email already in use");
      }
    }),
  check("phone")
    .optional()
    .isMobilePhone(["tr-TR"])
    .withMessage("Invalid phone number only TR Phone numbers accepted !!"),
  check("profileImage").optional(),
  check("role").optional(),
  validatorMiddleware,
];

exports.changeUserPasswordValidator = [
  check("id")
    .isMongoId()
    .withMessage("The provided User ID is not a valid MongoDB ObjectId"),
  check("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),
  check("password")
    .notEmpty()
    .withMessage("User password is required")
    .custom(async (password, { req }) => {
      // 1) Verify current password
      const user = await User.findById(req.params.id);
      if (!user) {
        throw new Error("There is no user for this id");
      }
      const isCompared = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (!isCompared) {
        throw new Error("Incorrect current password");
      }

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

exports.deleteUserValidator = [
  check("id")
    .isMongoId()
    .withMessage("The provided User ID is not a valid MongoDB ObjectId."),
  validatorMiddleware,
];
