const express = require("express");

const brandController = require("../controllers/brandController");
const {
  createBrandValidator,
  getBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} = require("../utils/validators/brandValidator");

const authController = require("../controllers/authController");

const router = express.Router();

router
  .route("/")
  .get(brandController.getBrands)
  .post(
    authController.protect,
    authController.checkRoles("admin","manager"),
    brandController.uploadBrandImage,
    brandController.resizeImage,
    createBrandValidator,
    brandController.createBrand
  );
router
  .route("/:id")
  .get(getBrandValidator, brandController.getBrand)
  .patch(
    authController.protect,
    authController.checkRoles("admin","manager"),
    brandController.uploadBrandImage,
    brandController.resizeImage,
    updateBrandValidator,
    brandController.updateBrand
  )
  .delete(
    authController.protect,
    authController.checkRoles("admin"),
    deleteBrandValidator,
    brandController.deleteBrand
  );

module.exports = router;
