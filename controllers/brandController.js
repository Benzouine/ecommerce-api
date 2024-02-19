// const sharp = require("sharp");
// const asyncHandler = require("express-async-handler");

// const factory = require("./handlerFactory");
// const Brand = require("../models/brand");
// const {
//   imageUploadMiddleware,
// } = require("../middleware/imageUploadMiddleware");



// exports.uploadBrandImage = imageUploadMiddleware("image")




// exports.resizeImage = asyncHandler(async (req, res, next) => {
//   const filename = `brand-${Date.now()}.jpeg`;
//   await sharp(req.file.buffer)
//   .resize(600, 600)
//   .toFormat("jpeg")
//   .jpeg({ quality: 90 })
//   .toFile(`uploads/brands/${filename}`);
//   req.body.image = filename;
//   next();
// });



const sharp = require("sharp");
const asyncHandler = require("express-async-handler");

const factory = require("./handlerFactory");
const Brand = require("../models/brand");
const {  uploadSingleImage } = require("../middleware/imageUploadMiddleware");
const ApiError = require("../utils/ApiError");


// Upload single image
exports.uploadBrandImage = uploadSingleImage('image');

// Image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new ApiError("No image uploaded",400));
  }
  const filename = `brand-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFile(`uploads/brands/${filename}`);

  // Save image into our db
  req.body.image = filename;

  next();
});



//@desc Create brand
//@route POST /api/v1/brands
//@access Private
exports.createBrand = factory.createDocument(Brand);

//@desc Get list of brands
//@route GET /api/v1/brands
//@access Public
exports.getBrands = factory.getDocuments(Brand);

//@desc Get brand
//@route GET /api/v1/brands/:id
//@access Private

exports.getBrand = factory.getOneDocument(Brand);

//@desc Update specific brand
//@route PATCH /api/v1/brands/:id
//@access Private

exports.updateBrand = factory.updateDocument(Brand);

//@desc Delete specific brand
//@route DELETE /api/v1/brands/:id
//@access Private

exports.deleteBrand = factory.deleteDocument(Brand);
