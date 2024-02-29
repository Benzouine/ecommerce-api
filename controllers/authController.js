const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

const ApiError = require("../utils/ApiError");
const User = require("../models/user");
const createToken = require("../utils/createToken");

exports.signup = asyncHandler(async (req, res, next) => {
  // 1- Create user
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  // 2- Generate token
  console.log(user._id);
  const token = createToken(user._id);

  res.status(201).json({ status: "success", data: user, token });
});

exports.signin = asyncHandler(async (req, res, next) => {
  // 1- test on user
  const user = await User.findOne({
    email: req.body.email,
  });

  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiError("Incorrect email or password", 401));
  }

  // 2- Generate token

  const token = createToken(user._id);

  const userForResponse = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    active: user.active,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  res.status(201).json({ status: "success", data: userForResponse, token });
});
