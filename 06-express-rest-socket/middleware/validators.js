import { body } from "express-validator";

import User from "../models/user.js";

export const postValidation = [
  body("title").trim().isLength({ min: 5 }),
  body("content").trim().isLength({ min: 5 }),
];

export const userValidation = [
  body("email")
    .isEmail()
    .withMessage("Please enter a valid email")
    .custom(async (value, { req }) => {
      const user = await User.findOne({ email: value });
      if (user) throw new Error("E-Mail address already exists!");
    })
    .normalizeEmail(),
  body("name").notEmpty().trim(),
  body("password").isLength({ min: 5 }).trim(),
];
