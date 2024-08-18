import path from "path";
import express from "express";
import { fileURLToPath } from "url";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.get("/users", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "user.html"));
});

export default router;
