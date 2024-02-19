const express = require("express");

const userController = require("../controllers/userController");
const {
  createUserValidator,
  getUserValidator,
  updateUserValidator,
  deleteUserValidator,
} = require("../utils/validators/userValidator");

const router = express.Router();

router
  .route("/")
  .get(userController.getUsers)
  .post(
    userController.uploadUserImage,
    userController.resizeImage,
    createUserValidator,
    userController.createUser
  );
router
  .route("/:id")
  .get(getUserValidator, userController.getUser)
  .patch(
    userController.uploadUserImage,
    userController.resizeImage,
    updateUserValidator,
    userController.updateUser
  )
  .delete(deleteUserValidator, userController.deleteUser);

module.exports = router;
