import express from "express";

import {
  createPost,
  deletePost,
  getPost,
  getPosts,
  updatePost,
} from "../controllers/feed.js";
import { postValidation } from "../middleware/validators.js";
import isAuth from "../middleware/isAuth.js";

const router = express.Router();

router.get("/posts", isAuth, getPosts);

router.get("/posts/:postId", isAuth, getPost);

router.post("/post", isAuth, postValidation, createPost);

router.put("/posts/:postId", isAuth, postValidation, updatePost);

router.delete("/posts/:postId", isAuth, deletePost);

export default router;
