// Importing necessary modules

const Subcategory = require("../models/subcategory"); // Mongoose model for subcategories
const factory = require("./handlerFactory");

// Middleware to set category ID in request body
exports.setCategoryIdToBody = (req, res, next) => {
  if (!req.body.category) req.body.category = req.params.categoryId; // Set category ID from URL parameter to request body if not present
  next(); // Proceed to next middleware or route handler
};

// Middleware to create filter object for database queries

exports.createFilterObject = (req, res, next) => {
  const filterObj = {};
  if (req.params.categoryId) {
    filterObj.category = req.params.categoryId;
  }
  req.filterObj = filterObj;
  next();
};

// @desc  Route handler to get list of subcategories
// @route   GET /api/v1/subcategories
// @access  Public
exports.getSubcategories = factory.getDocuments(Subcategory);

// @desc  Route handler to create a new subcategory
// @route   POST /api/v1/subcategories
// @access  Private
exports.createSubcategory = factory.createDocument(Subcategory);

// @desc Route handler to get a single subcategory by ID
// @route   GET /api/v1/subcategories/:id
// @access  Public
exports.getSubcategory = factory.getOneDocument(Subcategory);

// @desc Route handler to update a subcategory
// @route   PATCH  /api/v1/subcategories/:id
// @access  Private
exports.updateSubcategory = factory.updateDocument(Subcategory);

// @desc Route handler to delete a subcategory
// @route   DELETE  /api/v1/subcategories/:id
// @access  Private
exports.deleteSubcategory = factory.deleteDocument(Subcategory);
