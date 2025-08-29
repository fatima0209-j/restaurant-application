import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import adminRoutes from "./src/routes/adminRoutes.js";
import reservationRoutes from "./src/routes/reservationRoutes.js";
import dishesRoutes from "./src/routes/dishesRoutes.js";

dotenv.config();
const app = express();

// Helpers for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// Serve uploaded images statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

app.use("/api/admin", adminRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/dishes", dishesRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
