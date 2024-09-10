import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import User from "../models/user.js";

dotenv.config();

export const getStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);

    res.status(200).json({ status: user.status });
  } catch (error) {
    next(error);
  }
};

export const updateStatus = async (req, res, next) => {
  const { status } = req.body;
  if (!status) {
    const error = new Error("Status field is required");
    error.statusCode = 422;
    return next(error);
  }

  try {
    await User.findByIdAndUpdate(req.userId, { status });

    res.status(200).json({ message: "Status updated successfully", status });
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, name, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validations failed");
    error.statusCode = 422;
    error.data = errors.array();
    return next(error);
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({ email, name, password: hashedPassword });

    res.status(201).json({ message: "User created!", userId: user._id });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error("A user with this email could not be found");
      error.statusCode = 401;
      throw error;
    }

    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error("Wrong password!");
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign(
      { userId: user._id, email },
      process.env.SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );
    res.status(200).json({ token, userId: user._id });
  } catch (error) {
    next(error);
  }
};
