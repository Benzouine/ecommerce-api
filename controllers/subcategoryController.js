// Importing necessary modules
const slugify = require("slugify"); // Module to create URL slugs from strings
const asyncHandler = require("express-async-handler"); // Middleware for handling exceptions inside async express routes
const Subcategory = require("../models/subcategory"); // Mongoose model for subcategories
const ApiError = require("../utils/ApiError"); // Custom ApiError for handling API errors

// Middleware to set category ID in request body
exports.setCategoryIdToBody = (req, res, next) => {
  if (!req.body.category) req.body.category = req.params.categoryId; // Set category ID from URL parameter to request body if not present
  next(); // Proceed to next middleware or route handler
};

// Middleware to create filter object for database queries
exports.createFilterObject = (req, res, next) => {
  let filterObj = {};
  if (req.params.categoryId) filterObj = { category: req.params.categoryId }; // Filter subcategories by category ID if provided
  req.filterObject = filterObj; // Attach filter object to the request
  next(); // Proceed to next middleware or route handler
};

// @desc  Route handler to get list of subcategories
// @route   GET /api/v1/subcategories
// @access  Public
exports.getSubcategories = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1; // Parse page number from query, default to 1
  const limit = req.query.limit * 1 || 5; // Parse limit from query, default to 5
  const skip = (page - 1) * limit; // Calculate the number of documents to skip

  // Find subcategories with pagination
  const subcategories = await Subcategory.find(req.filterObject)
    .skip(skip)
    .limit(limit);
  //.populate({path:"category",select:"name -_id"});

  // Send response
  res
    .status(200)
    .json({ results: subcategories.length, page, data: subcategories });
});

// @desc  Route handler to create a new subcategory
// @route   POST /api/v1/subcategories
// @access  Private
exports.createSubcategory = asyncHandler(async (req, res) => {
  // Create a new subcategory with the provided body and a slug
  const subcategory = await Subcategory.create({
    ...req.body,
    slug: slugify(req.body.name), // Generate a slug from the name
  });
  // Send response
  res.status(201).json({ status: "success", data: subcategory });
});

// @desc Route handler to get a single subcategory by ID
// @route   GET /api/v1/subcategories/:id
// @access  Public
exports.getSubcategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params; // Extract ID from URL parameters

  // Find a subcategory by its ID
  const subcategory = await Subcategory.findById(id); //.populate({path:"category",select:"name -_id"});

  // If not found, throw an ApiError
  if (!subcategory) {
    return next(new ApiError(`No subcategory for this id ${id}`, 404));
  }

  // Send response
  res.status(200).json({ status: "success", data: subcategory });
});

// @desc Route handler to update a subcategory
// @route   PATCH  /api/v1/subcategories/:id
// @access  Private
exports.updateSubcategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params; // Extract ID from URL parameters

  // Update the subcategory and return the updated document
  const subcategory = await Subcategory.findOneAndUpdate(
    { _id: id },
    { ...req.body, slug: slugify(req.body.name) }, // Update with provided data and regenerate slug
    { new: true } // Return the updated document
  );

  // If not found, throw an ApiError
  if (!subcategory) next(new ApiError(`No subcategory for this id ${id}`, 404));

  // Send response
  res.status(200).json({ status: "success", data: subcategory });
});

// @desc Route handler to delete a subcategory
// @route   DELETE  /api/v1/subcategories/:id
// @access  Private
exports.deleteSubcategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params; // Extract ID from URL parameters

  // Delete the subcategory
  const subcategory = await Subcategory.findByIdAndDelete(id);

  // If not found, throw an ApiError
  if (!subcategory) next(new ApiError(`No subcategory for this id ${id}`, 404));

  // Send a no content response
  res.status(204).send();
});
