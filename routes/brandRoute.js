const express = require("express");

const brandController = require("../controllers/brandController");
const {
  createBrandValidator,
  getBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} = require("../utils/validators/brandValidator");

const router = express.Router();

router
  .route("/")
  .get(brandController.getBrands)
  .post(
    brandController.uploadBrandImage,
    brandController.resizeImage,
    createBrandValidator,
    brandController.createBrand
  );
router
  .route("/:id")
  .get(getBrandValidator, brandController.getBrand)
  .patch(
    brandController.uploadBrandImage,
    brandController.resizeImage,
    updateBrandValidator,
    brandController.updateBrand
  )
  .delete(deleteBrandValidator, brandController.deleteBrand);

module.exports = router;
