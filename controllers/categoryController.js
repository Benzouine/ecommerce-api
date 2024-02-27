const sharp = require("sharp");
const asyncHandler = require("express-async-handler");

const Category = require("../models/category");
const factory = require("./handlerFactory");
const ApiError = require("../utils/ApiError");
const {
    uploadSingleImage,
} = require("../middleware/imageUploadMiddleware");


// Upload single image
exports.uploadCategoryImage = uploadSingleImage('image');

// Image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {

  if (req.file) {
  const filename = `category-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat('jpeg')
    .jpeg({ quality: 95 })
    .toFile(`uploads/categories/${filename}`);

  // Save image into our db
  req.body.image = filename;
  }
  next();
});




// @desc    Get list of categories
// @route   GET /api/v1/categories
// @access  Public

exports.getCategories = factory.getDocuments(Category);

// @desc    Get specific category by id
// @route   GET /api/v1/categories/:id
// @access  Public
exports.getCategory = factory.getOneDocument(Category);

// @desc    Create category
// @route   POST  /api/v1/categories
// @access  Private
exports.createCategory = factory.createDocument(Category);
// @desc    Update specific category
// @route   PUT /api/v1/categories/:id
// @access  Private
exports.updateCategory = factory.updateDocument(Category);

// @desc    Delete specific category
// @route   DELETE /api/v1/categories/:id
// @access  Private
exports.deleteCategory = factory.deleteDocument(Category);
