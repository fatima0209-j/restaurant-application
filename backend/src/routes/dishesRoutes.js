import express from "express";
import multer from "multer";
import path from "path";
import { verifyToken, verifyAdmin } from "../middleware/authAdmin.js";
import { getDishes, addDish, updateDish, deleteDish } from "../controllers/dishController.js";

const router = express.Router();

// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // files go to /uploads
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Public
router.get("/", getDishes);

// Protected
router.post("/", verifyToken, verifyAdmin, upload.single("image"), addDish);
router.put("/:id", verifyToken, verifyAdmin, upload.single("image"), updateDish); 
router.delete("/:id", verifyToken, verifyAdmin, deleteDish);                       

export default router;
