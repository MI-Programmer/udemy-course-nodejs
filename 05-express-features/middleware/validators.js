const { check, body } = require("express-validator");

const User = require("../models/user");

exports.productValidation = [
  body("title").isString().isLength({ min: 3 }).trim(),
  // body("image"),
  body("price").isFloat(),
  body("description").isLength({ min: 5, max: 300 }).trim(),
];

exports.loginValidation = [
  body("email", "Please enter a valid email.").isEmail().normalizeEmail(),
  body(
    "password",
    "Please enter a password with only numbers and text and at least 6 characters"
  )
    .isLength({ min: 6 })
    .isAlphanumeric()
    .trim(),
];

exports.signupValidation = [
  check("email")
    .isEmail()
    .withMessage("Please enter a valid email.")
    .custom(async (email) => {
      const existingEmail = await User.findOne({ email });
      if (existingEmail)
        throw new Error("Email is already exist, please pick a different one");
    })
    .normalizeEmail(),
  body(
    "password",
    "Please enter a password with only numbers and text and at least 6 characters"
  )
    .isLength({ min: 6 })
    .isAlphanumeric()
    .trim(),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password)
      throw new Error("Passwords have to match!");
    return true;
  }),
];
