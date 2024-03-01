const express = require("express");

const productController = require("../controllers/productController");
const {
  createProductValidator,
  getProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require("../utils/validators/productValidator");
const authController = require("../controllers/authController");

const router = new express.Router();

router
  .route("/")
  .get(productController.getProducts)
  .post(
    authController.protect,
    authController.checkRoles("admin","manager"),
    productController.uploadProductImages,
    productController.resizeProductImages,
    createProductValidator,
    productController.createProduct
  );

router
  .route("/:id")
  .get(getProductValidator, productController.getProduct)
  .patch(
    authController.protect,
    authController.checkRoles("admin","manager"),
    productController.uploadProductImages,
    productController.resizeProductImages,
    updateProductValidator,
    productController.updateProduct
  )
  .delete(
    authController.protect,
    authController.checkRoles("admin"),
    deleteProductValidator,
    productController.deleteProduct
  );

module.exports = router;
