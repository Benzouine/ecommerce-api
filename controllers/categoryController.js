
const Category = require("../models/category");
const factory = require("./handlerFactory")


// @desc    Get list of categories
// @route   GET /api/v1/categories
// @access  Public

exports.getCategories = factory.getDocuments(Category)

// @desc    Get specific category by id
// @route   GET /api/v1/categories/:id
// @access  Public
exports.getCategory = factory.getOneDocument(Category)

// @desc    Create category
// @route   POST  /api/v1/categories
// @access  Private
exports.createCategory = factory.createDocument(Category)
// @desc    Update specific category
// @route   PUT /api/v1/categories/:id
// @access  Private
exports.updateCategory = factory.updateDocument(Category)

// @desc    Delete specific category
// @route   DELETE /api/v1/categories/:id
// @access  Private
exports.deleteCategory = factory.deleteDocument(Category)