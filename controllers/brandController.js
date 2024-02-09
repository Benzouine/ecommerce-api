const slugify = require("slugify");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("express-async-handler");

const Brand = require("../models/brand");

//@desc Create brand
//@route POST /api/v1/brands
//@access Private
exports.createBrand = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const brand = await Brand.create({
    ...req.body,
    slug: slugify(name),
  });

  res.status(201).json({ status: "success", data: brand });
});

//@desc Get list of brands
//@route GET /api/v1/brands
//@access Public
exports.getBrands = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;

  const brands = await Brand.find({}).skip(skip).limit(limit);

  res
    .status(200)
    .json({ status: "success", results: brands.length, data: brands });
});

//@desc Get brand
//@route GET /api/v1/brands/:id
//@access Private

exports.getBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const brand = await Brand.findById(id);

  if (!brand) {
    return next(new ApiError(`No brand for this id ${id}`, 404));
  }
  res.status(200).json({ status: "success", data: brand });
});

//@desc Update specific brand
//@route PATCH /api/v1/brands/:id
//@access Private

exports.updateBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const brand = await Brand.findOneAndUpdate(
    { _id: id },
    { ...req.body, slug: slugify(req.body.name) },
    { new: true }
  );

  if (!brand) {
    return next(new ApiError(`No brand for this id ${id}`, 404));
  }
  res.status(200).json({ status: "success", data: brand });
});

//@desc Delete specific brand
//@route DELETE /api/v1/brands/:id
//@access Private

exports.deleteBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const brand = await Brand.findByIdAndDelete(id);
  if (!brand) {
    return next(new ApiError(`No brand for this id ${id}`, 404));
  }
  res.status(204).send();
});

