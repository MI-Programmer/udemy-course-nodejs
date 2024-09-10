import { validationResult } from "express-validator";

import Post from "../models/post.js";
import User from "../models/user.js";
import { deleteFileImage } from "../utils/helper.js";
import socket from "../lib/socket.js";

const ITEMS_PER_PAGE = 2;

export const getPosts = async (req, res) => {
  const page = +req.query.page || 1;
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE)
      .populate("creator", "name");
    const totalItems = await Post.find().countDocuments();

    res
      .status(200)
      .json({ message: "Fetched posts successfully.", posts, totalItems });
  } catch (err) {
    next(err);
  }
};

export const getPost = async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error("Could not find post.");
      error.statusCode = 404;
      throw error;
    }
    post.imageUrl = `http://localhost:8080/${post.imageUrl}`;

    res.status(200).json({ message: "Post fetched.", post });
  } catch (err) {
    next(err);
  }
};

export const createPost = async (req, res, next) => {
  // VALIDATION
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect");
    error.statusCode = 422;
    error.data = errors.array();
    return next(error);
  }
  if (!req.file) {
    const error = new Error("No image provided.");
    error.statusCode = 422;
    return next(error);
  }
  const imageUrl = req.file.path.replace("\\", "/");

  try {
    const user = await User.findById(req.userId);
    let post = await Post.create({
      ...req.body,
      imageUrl,
      creator: user,
    });
    post = { ...post._doc, creator: { name: user.name } };
    user.posts.push(post._id);
    user.save();

    socket.getIO().emit("posts", { action: "create", post });
    res.status(201).json({
      message: "Post created successfully",
      post,
    });
  } catch (err) {
    next(err);
  }
};

export const updatePost = async (req, res, next) => {
  const errors = validationResult(req);
  const { postId } = req.params;

  // VALIDATION;
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect");
    error.statusCode = 422;
    error.data = errors.array();
    return next(error);
  }
  if (!req.body.image && !req.file) {
    const error = new Error("No file picked.");
    error.statusCode = 422;
    return next(error);
  }
  if (req.file) req.body.imageUrl = req.file.path.replace("\\", "/");

  try {
    const post = await Post.findById(postId).populate("creator", "name");
    if (!post) {
      deleteFileImage(req.file.path.replace("\\", "/"));
      const error = new Error("Could not find post.");
      error.statusCode = 404;
      throw error;
    }
    if (post.creator._id.toString() !== req.userId) {
      deleteFileImage(req.file.path.replace("\\", "/"));
      const error = new Error("Not authorized.");
      error.statusCode = 403;
      throw error;
    }

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { ...req.body },
      { new: true }
    );
    if (req.file) deleteFileImage(post.imageUrl);

    socket.getIO().emit("posts", { action: "update", post: updatedPost });
    res.status(200).json({
      message: "Post updated successfully",
      post,
    });
  } catch (err) {
    next(err);
  }
};

export const deletePost = async (req, res, next) => {
  const { postId } = req.params;

  try {
    const post = await Post.findOneAndDelete({
      _id: postId,
      creator: req.userId,
    });
    if (!post) {
      const error = new Error("Could not find post.");
      error.statusCode = 404;
      throw error;
    }
    await User.findByIdAndUpdate(req.userId, { $pull: { posts: postId } });

    deleteFileImage(post.imageUrl);
    socket.getIO().emit("posts", { action: "delete", post: { postId } });
    res.status(200).json({ message: "Post deleted successfully." });
  } catch (err) {
    next(err);
  }
};
