const slugify = require("slugify");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("express-async-handler");
const Product = require("../models/product");

exports.createProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.create({
    ...req.body,
    slug: slugify(req.body.name),
  });
  res.status(201).json({ data: product });
});

exports.getProducts = asyncHandler(async (req, res, next) => {
  const page = req.params.page * 1 || 1;
  const limit = req.params.limit * 1 || 5;
  const skip = (page - 1) * limit;

  const products = await Product.find({}).limit(limit).skip(skip);

  res
    .status(200)
    .json({ status: "success", results: products.length, data: products });
});

exports.getProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findById(id);

  if (!product) {
    return next(new ApiError(`No product for this id ${id}`, 404));
  }
  res.status(200).json({ status: "success", data: product });
});

exports.updateProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findOneAndUpdate({ _id: id },{ ...req.body,slug:slugify(req.body.name)}, {
    new: true,
  });
  if (!product) {
    return next(new ApiError(`No product for this id ${id}`, 404));
  }
  res.status(200).json({ status: "success", data: product });
});
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    return next(new ApiError(`No product for this id ${id}`, 404));
  }
  res.status(204).send();
});
