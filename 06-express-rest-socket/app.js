import path from "path";
import { fileURLToPath } from "url";

import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import { v4 as uuid } from "uuid";
import dotenv from "dotenv";

import socket from "./lib/socket.js";
import feedRoutes from "./routes/feed.js";
import authRoutes from "./routes/auth.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, `${uuid()}-${file.originalname}`);
  },
});
const fileFilter = (req, file, cb) => {
  const type = file.mimetype;
  if (type === "image/png" || type === "image/jpg" || type === "image/jpeg") {
    cb(null, true);
  } else cb(null, false);
};

const app = express();
dotenv.config();
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(multer({ storage, fileFilter }).single("image"));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/feed", feedRoutes);
app.use("/auth", authRoutes);

app.use((error, req, res, next) => {
  const { statusCode = 500, message, data } = error;
  console.log(error);
  res.status(statusCode).json({ message, data });
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to mongo database");
    const server = app.listen(8080, () => {
      console.log("Server is listening on port 8080");
    });

    const io = socket.init(server);
    io.on("connection", () => {
      console.log("Client connected!");
    });
  })
  .catch((error) => {
    console.error("Failed to connect to the database", error);
  });
