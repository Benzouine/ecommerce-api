// Importing the Express framework to create a router
const express = require("express");

// Importing controller functions for category operations
const categoryController = require("../controllers/categoryController");
// Importing the subcategories router for nested routing
const subcategoriesRoute = require("../routes/subcategoryRoute");

// Importing validation middleware for different category operations
const {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("../utils/validators/categoryValidator");


// Creating a new router instance
const router = express.Router();

// Nested route setup: Any request to "/:categoryId/subcategories" will be handled by subcategoriesRoute
router.use("/:categoryId/subcategories", subcategoriesRoute);

// Route definitions for the base path ("/") of the category router
router
  .route("/")
  .get(categoryController.getCategories) // GET request to get all categories
  .post(
    createCategoryValidator, // Middleware to validate the category creation request
    categoryController.createCategory // Controller function to create a category
  );

// Route definitions for specific category by ID ("/:id")
router
  .route("/:id")
  .get(
    getCategoryValidator, // Middleware to validate the get category request
    categoryController.getCategory // Controller function to get a specific category
  )
  .patch(
    updateCategoryValidator, // Middleware to validate the update category request
    categoryController.updateCategory // Controller function to update a specific category
  )
  .delete(
    deleteCategoryValidator, // Middleware to validate the delete category request
    categoryController.deleteCategory // Controller function to delete a specific category
  );

// Exporting the router for use in the main application
module.exports = router;
