const express = require("express");

const router = express.Router();

const authController = require("../controllers/auth");
const {
  loginValidation,
  signupValidation,
} = require("../middleware/validators");
const { catchAsync } = require("../utils/catchAsync");

router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

router.get("/reset-password", authController.getResetPassword);

router.get("/new-password/:resetToken", authController.getNewPassword);

router.post("/login", loginValidation, catchAsync(authController.postLogin));

router.post("/signup", signupValidation, catchAsync(authController.postSignup));

router.post("/logout", catchAsync(authController.postLogout));

router.post("/reset-password", catchAsync(authController.postResetPassword));

router.post("/new-password", catchAsync(authController.postNewPassword));

module.exports = router;
