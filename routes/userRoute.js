const express = require("express");

const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const {
  createUserValidator,
  getUserValidator,
  updateUserValidator,
  deleteUserValidator,
  changeUserPasswordValidator,
} = require("../utils/validators/userValidator");

const router = express.Router();

router
  .route("/")
  .get(userController.getUsers)
  .post(
    authController.protect,
    authController.checkRoles("admin", "manager"),
    userController.uploadUserImage,
    userController.resizeImage,
    createUserValidator,
    userController.createUser
  );
router
  .route("/:id")
  .get(getUserValidator, userController.getUser)
  .patch(
    authController.protect,
    authController.checkRoles("admin", "manager"),
    userController.uploadUserImage,
    userController.resizeImage,
    updateUserValidator,
    userController.updateUser
  )
  .delete(
    authController.protect,
    authController.checkRoles("admin"),
    deleteUserValidator,
    userController.deleteUser
  );

router.patch(
  "/:id/active",
  authController.protect,
  authController.checkRoles("admin", "manager"),
  userController.isUserActive
);

router.patch(
   
  "/:id/change-password",
  authController.protect,
  changeUserPasswordValidator,
  userController.changeUserPassword
);

module.exports = router;
