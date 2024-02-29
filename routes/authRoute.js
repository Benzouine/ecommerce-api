const express = require("express");

const authController = require("../controllers/authController");
const {
  signUpValidator, signInValidator,
 
} = require("../utils/validators/authValidator");

const router = express.Router();

router
  .post("/signup",
    signUpValidator,
    authController.signup
  );

  router
   .post("/signin",
  signInValidator,
  authController.signin
);


module.exports = router;
