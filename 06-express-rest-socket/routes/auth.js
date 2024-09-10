import express from "express";

import { getStatus, login, signin, updateStatus } from "../controllers/auth.js";
import { userValidation } from "../middleware/validators.js";
import isAuth from "../middleware/isAuth.js";

const router = express.Router();

router.get("/status", isAuth, getStatus);

router.post("/login", login);

router.put("/status", isAuth, updateStatus);

router.put("/signup", userValidation, signin);

export default router;
