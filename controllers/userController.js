const sharp = require("sharp");
const asyncHandler = require("express-async-handler");

const User = require("../models/user");
const factory = require("./handlerFactory");
const ApiError = require("../utils/ApiError");

const { uploadSingleImage } = require("../middleware/imageUploadMiddleware");

// Upload single image
exports.uploadUserImage = uploadSingleImage("profileImage");

// Image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new ApiError("No image uploaded", 400));
  }
  const filename = `avatar-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 95 })
    .toFile(`uploads/avatars/${filename}`);

  // Save image into our db
  req.body.profileImage = filename;

  next();
});

//@desc Create User
//@route POST /api/v1/users
//@access Private
exports.createUser = factory.createDocument(User);

//@desc Get list of Users
//@route GET /api/v1/users
//@access private
exports.getUsers = factory.getDocuments(User);

//@desc Get User
//@route GET /api/v1/users/:id
//@access Private
exports.getUser = factory.getOneDocument(User);

//@desc Update specific User
//@route PATCH /api/v1/users/:id
//@access Private
exports.updateUser = factory.updateDocument(User);

//@desc Delete specific User
//@route DELETE /api/v1/users/:id
//@access Private
exports.deleteUser = factory.deleteDocument(User);
