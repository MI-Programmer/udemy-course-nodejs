import path from "path";
import express from "express";
import { fileURLToPath } from "url";

import shopRoutes from "./routes/shop.js";
import userRoutes from "./routes/user.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));

app.use(shopRoutes);
app.use(userRoutes);

app.listen(3000);
