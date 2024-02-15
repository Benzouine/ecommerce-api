
const factory = require("./handlerFactory")
const Brand = require("../models/brand");

//@desc Create brand
//@route POST /api/v1/brands
//@access Private
exports.createBrand = factory.createDocument(Brand)

//@desc Get list of brands
//@route GET /api/v1/brands
//@access Public
exports.getBrands =  factory.getDocuments(Brand);

//@desc Get brand
//@route GET /api/v1/brands/:id
//@access Private

exports.getBrand = factory.getOneDocument(Brand)

//@desc Update specific brand
//@route PATCH /api/v1/brands/:id
//@access Private

exports.updateBrand = factory.updateDocument(Brand)

//@desc Delete specific brand
//@route DELETE /api/v1/brands/:id
//@access Private

exports.deleteBrand = factory.deleteDocument(Brand)
