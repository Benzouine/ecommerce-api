// Importing the check function from express-validator for request validation
const { check } = require("express-validator");

// Importing a custom middleware for handling the validation results
const validatorMiddleware = require("../../middleware/validatorMiddleware");

// Validator for GET request to fetch a subcategory by ID
exports.getSubcategoryValidator = [
  check("id").isMongoId().withMessage("Invalid subcategory id format"), // Check if 'id' is a valid MongoDB ObjectId
  validatorMiddleware, // Custom middleware to handle validation results
];

// Validator for POST request to create a subcategory
exports.createSubcategoryValidator = [
  check("name")
    .notEmpty() // Ensure 'name' field is not empty
    .withMessage("Subcategory required")
    .isLength({ min: 3 }) // Check if 'name' length is at least 3 characters
    .withMessage("Too short subcategory name")
    .isLength({ max: 33 }) // Check if 'name' length does not exceed 33 characters
    .withMessage("Too long subcategory name"),
  check("category")
    .notEmpty() // Ensure 'category' field is not empty
    .withMessage("Subcategory required")
    .isMongoId() // Check if 'category' is a valid MongoDB ObjectId
    .withMessage("Invalid category id format"),
  validatorMiddleware, // Custom middleware to handle validation results
];

// Validator for PATCH request to update a subcategory
exports.updateSubcategoryValidator = [
  check("id").isMongoId().withMessage("Invalid subcategory is format"), // Check if 'id' is a valid MongoDB ObjectId
  validatorMiddleware, // Custom middleware to handle validation results
];

// Validator for DELETE request to delete a subcategory
exports.deleteSubcategoryValidator = [
  check("id").isMongoId().withMessage("Invalid subcategory is format"), // Check if 'id' is a valid MongoDB ObjectId
  validatorMiddleware, // Custom middleware to handle validation results
];
