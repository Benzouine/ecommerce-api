const asyncHandler = require("express-async-handler");
const sharp = require("sharp");

const Product = require("../models/product");
const factory = require("./handlerFactory");
const { uploadMixOfImages } = require("../middleware/imageUploadMiddleware");

exports.uploadProductImages = uploadMixOfImages([
  {
    name: "imageCover",
    maxCount: 1,
  },
  {
    name: "images",
    maxCount: 5,
  },
]);

exports.resizeProductImages = asyncHandler(async (req, res, next) => {

  if (req.files.imageCover) {
    
    const filename = `category-${Date.now()}.jpeg`;
    await sharp(req.files.imageCover[0].buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/products/${filename}`);
    req.body.imageCover = filename;
   
  }
  if (req.files.images && req.files.images.length > 0) {
    

    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (img, i) => {
       
        const imageName = `product-${Date.now()}-${i + 1}.jpeg`;
        await sharp(img.buffer)
          .resize(600, 600)
          .toFormat("jpeg")
          .jpeg({ quality: 95 })
          .toFile(`uploads/products/${imageName}`);
        req.body.images.push(imageName);
      })
    );
    next();
  }
});

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
