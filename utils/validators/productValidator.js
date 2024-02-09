const { check } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");
const Category = require("../../models/category");

exports.getProductValidator = [
  check("id")
    .isMongoId()
    .withMessage("The provided product ID is not a valid MongoDB ObjectId."),
  validatorMiddleware,
];

exports.createProductValidator = [
  check("name")
    .notEmpty()
    .withMessage("Product name is required.")
    .isLength({ min: 3 })
    .withMessage("Product name should be at least 3 characters long.")
    .isLength({ max: 100 })
    .withMessage("Product name should not exceed 100 characters."),
  check("description")
    .notEmpty()
    .withMessage("Product description is required.")
    .isLength({ min: 20 })
    .withMessage("Description should be at least 20 characters long.")
    .isLength({ max: 2000 })
    .withMessage("Description should not exceed 2000 characters."),
  check("quantity")
    .notEmpty()
    .withMessage("Quantity of the product is required."),
  check("sold")
    .optional()
    .isNumeric()
    .withMessage("The 'sold' field must be a number."),
  check("price")
    .notEmpty()
    .withMessage("Product price is required.")
    .isNumeric()
    .withMessage("Product price must be a numeric value.")
    .isLength({ max: 32 })
    .withMessage("Price value is too long."),
  check("priceAfterDiscount")
    .optional()
    .isNumeric()
    .withMessage("Discounted price must be a numeric value.")
    .toFloat()
    .custom((value, { req }) => {
      if (req.body.price <= value) {
        throw new Error("Discounted price must be lower than the regular price.");
      }
      return true;
    }),
  check("colors")
    .optional()
    .isArray()
    .withMessage("Colors should be provided as an array of strings."),
  check("imageCover")
    .notEmpty()
    .withMessage("Cover image for the product is required."),
  check("images")
    .optional()
    .isArray()
    .withMessage("Product images should be provided as an array of strings."),
  check("category")
    .notEmpty()
    .isMongoId()
    .custom((categoryId) => {
      return Category.findById(categoryId).then((category) => {
        if (!category) {
          return Promise.reject("No category found with the provided ID.");
        }
      });
    }),
  check("subcategories")
    .optional()
    .isMongoId()
    .withMessage("Subcategory ID must be a valid MongoDB ObjectId.")
    .custom((subcategoriesIds) =>
      SubCategory.find({ _id: { $exists: true, $in: subcategoriesIds } }).then(
        (result) => {
          if (result.length < 1 || result.length !== subcategoriesIds.length) {
            return Promise.reject("One or more subcategory IDs are invalid.");
          }
        }
      )
    ),
  check("brand")
    .optional()
    .isMongoId()
    .withMessage("Brand ID must be a valid MongoDB ObjectId."),
  check("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage("Average rating must be a numeric value.")
    .isLength({ min: 1, max: 5 })
    .withMessage("Average rating must be between 1.0 and 5.0."),
  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("Quantity of ratings must be a numeric value."),
  validatorMiddleware,
];

exports.updateProductValidator = [
  check("id")
    .isMongoId()
    .withMessage("The provided product ID is not a valid MongoDB ObjectId."),
  validatorMiddleware,
];

exports.deleteProductValidator = [
  check("id")
    .isMongoId()
    .withMessage("The provided product ID is not a valid MongoDB ObjectId."),
  validatorMiddleware,
];
