// Importing the Express framework to create a router
const express = require("express");

// Importing controller functions for subcategory operations
const subcategoryController = require("../controllers/subcategoryController");

// Importing validation middleware for different subcategory operations
const {
  createSubcategoryValidator,
  getSubcategoryValidator,
  updateSubcategoryValidator,
  deleteSubcategoryValidator,
} = require("../utils/validators/subcategoryValidator");

const authController = require("../controllers/authController");

// Creating a new router instance with mergeParams option enabled
// mergeParams: Allows access to parameters of other routers.
// For example, we can access categoryId from the category router
const router = express.Router({ mergeParams: true });

// Route definitions for the base path ("/") of the subcategory router
router
  .route("/")
  .get(
    subcategoryController.createFilterObject, // Middleware to create a filter object for querying
    subcategoryController.getSubcategories // Controller function to get subcategories
  )
  .post(
    authController.protect,
    authController.checkRoles("admin","manager"),
    subcategoryController.setCategoryIdToBody, // Middleware to set categoryId in the request body
    createSubcategoryValidator, // Middleware to validate the subcategory creation request
    subcategoryController.createSubcategory // Controller function to create a subcategory
  );

// Route definitions for specific subcategory by ID ("/:id")
router
  .route("/:id")
  .get(
    getSubcategoryValidator, // Middleware to validate the get subcategory request
    subcategoryController.getSubcategory // Controller function to get a specific subcategory
  )
  .patch(
    authController.protect,
    authController.checkRoles("admin","manager"),
    updateSubcategoryValidator, // Middleware to validate the update subcategory request
    subcategoryController.updateSubcategory // Controller function to update a specific subcategory
  )
  .delete(
    authController.protect,
    authController.checkRoles("admin"),
    deleteSubcategoryValidator, // Middleware to validate the delete subcategory request
    subcategoryController.deleteSubcategory // Controller function to delete a specific subcategory
  );

// Exporting the router for use in the main application
module.exports = router;
