const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");
const Category = require("../../models/category");
const slugify = require("slugify");
const Subcategory = require("../../models/subcategory");

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
    .withMessage("Product name should not exceed 100 characters.")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
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
        throw new Error(
          "Discounted price must be lower than the regular price."
        );
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
    // .custom() is likely a method of a validation library (like express-validator).
    // It takes a function that performs custom validation. The function receives 'subcategoryIds' as an argument.
    .custom((subcategoryIds) =>
      // 'Subcategory.find()' is a Mongoose query that searches for documents in the 'Subcategory' collection.
      // The query is filtering documents where '_id' exists and is in the 'subcategoryIds' array.
      Subcategory.find({ _id: { $exists: true, $in: subcategoryIds } }).then(
        (result) => {
          // Check if the number of found subcategories is less than 1 or not equal to the length of 'subcategoryIds'.
          // This means either some IDs were not found, or extra unidentified IDs were found.
          if (result.length < 1 || result.length !== subcategoryIds.length) {
            // If the check fails, reject the promise with a suitable error message.
            return Promise.reject(
              "Some subcategory IDs provided do not exist."
            );
          }
        }
      )
    )
    .custom((val, { req }) =>
      Subcategory.find({ category: req.body.category }).then(
        (subcategories) => {
          const subCategoriesIdsInDB = subcategories.map((item) =>
            item._id.toString()
          );
          const subCategoriesIdsSet = new Set(subCategoriesIdsInDB);

          if (!val.every((id) => subCategoriesIdsSet.has(id))) {
            return Promise.reject(
              new Error(
                "Some subcategories do not belong to the specified category"
              )
            );
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
  body("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

exports.deleteProductValidator = [
  check("id")
    .isMongoId()
    .withMessage("The provided product ID is not a valid MongoDB ObjectId."),
  validatorMiddleware,
];
