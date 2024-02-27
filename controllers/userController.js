const sharp = require("sharp");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");

const User = require("../models/user");
const factory = require("./handlerFactory");
const ApiError = require("../utils/ApiError");

const { uploadSingleImage } = require("../middleware/imageUploadMiddleware");

// Upload single image
exports.uploadUserImage = uploadSingleImage("profileImage");

// Image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  if (req.file) {
    const filename = `avatar-${Date.now()}.jpeg`;
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/avatars/${filename}`);

    // Save image into our db
    req.body.profileImage = filename;
  }

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

exports.updateUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const document = await User.findByIdAndUpdate(
    id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      profileImage: req.body.profileImage,
      role: req.body.role,
      active: req.body.active,
    },
    {
      new: true,
    }
  );

  if (!document) {
    return next(new ApiError(`No document for this id ${id}`, 404));
  }
  res.status(200).json({ status: "success", data: document });
});

//@desc Update specific User
//@route PATCH /api/v1/users/:id
//@access Private

exports.changeUserPassword = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await User.findByIdAndUpdate(
      id,
      {
        password: await bcrypt.hash(req.body.password, 12),
        passwordChangedAt: Date.now(),
      },
      {
        new: true,
      }
    );
  
    if (!document) {
      return next(new ApiError(`No document for this id ${req.params.id}`, 404));
    }
    res.status(200).json({ data: document });
  });


//@desc Delete specific User
//@route DELETE /api/v1/users/:id
//@access Private
exports.deleteUser = factory.deleteDocument(User);

//@desc Delete specific User
//@route DELETE /api/v1/users/:id
//@access Private
exports.isUserActive = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const document = await User.findByIdAndUpdate(
    id,
    { active: false },
    {
      new: true,
    }
  );

  if (!document) {
    return next(new ApiError(`No document for this id ${id}`, 404));
  }
  res.status(204).send();
});
