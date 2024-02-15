const Product = require("../models/product");
const factory = require("./handlerFactory");

//@desc Create product
//@route POST /api/v1/products
//@access Private
exports.createProduct = factory.createDocument(Product);

//@desc Get list of products
//@route GET /api/v1/products
//@access Public
exports.getProducts = factory.getDocuments(Product);

//@desc Get product
//@route GET /api/v1/products/:id
//@access Private
exports.getProduct = factory.getOneDocument(Product);

//@desc Update specific product
//@route PATCH /api/v1/products/:id
//@access Private
exports.updateProduct = factory.updateDocument(Product);

//@desc Delete specific product
//@route DELETE /api/v1/products/:id
//@access Private
exports.deleteProduct = factory.deleteDocument(Product);
