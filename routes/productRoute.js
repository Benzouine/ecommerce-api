const express = require("express");

const productController = require("../controllers/productController");
const {
  createProductValidator,
  getProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require("../utils/validators/productValidator");

const router = new express.Router();

router
  .route("/")
  .get(productController.getProducts)
  .post(
    productController.uploadProductImages,
    productController.resizeProductImages,
    createProductValidator,
    productController.createProduct
  );

router
  .route("/:id")
  .get(getProductValidator, productController.getProduct)
  .patch(
    productController.uploadProductImages,
    productController.resizeProductImages,
    updateProductValidator,
    productController.updateProduct
  )
  .delete(deleteProductValidator, productController.deleteProduct);

module.exports = router;
