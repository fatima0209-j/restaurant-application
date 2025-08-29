import Dish from "../models/Dish.js";
import fs from "fs";

export const getDishes = async (req, res) => {
  try {
    const dishes = await Dish.find();
    res.json({ success: true, data: dishes });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error while fetching dishes" });
  }
};

export const addDish = async (req, res) => {
  try {
    const { title, description, image } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: "Title is required" });
    }

    let imagePath = image; 
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    }

    const dish = new Dish({
      name: title,
      description,
      image: imagePath,
    });

    await dish.save();

    res.status(201).json({ success: true, message: "Dish added", data: dish });
  } catch (err) {
    console.error("Error while adding dish:", err.message);
    res.status(500).json({ success: false, message: "Server error while adding dish" });
  }
};

export const updateDish = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, image } = req.body;

    let updateData = {
      name: title,
      description,
    };

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    } else if (image) {
      updateData.image = image;
    }

    const dish = await Dish.findByIdAndUpdate(id, updateData, { new: true });

    if (!dish) {
      return res.status(404).json({ success: false, message: "Dish not found" });
    }

    res.json({ success: true, message: "Dish updated", data: dish });
  } catch (err) {
    console.error("Error updating dish:", err.message);
    res.status(500).json({ success: false, message: "Server error while updating dish" });
  }
};
2
export const deleteDish = async (req, res) => {
  try {
    const { id } = req.params;
    const dish = await Dish.findByIdAndDelete(id);

    if (!dish) {
      return res.status(404).json({ success: false, message: "Dish not found" });
    }

    // Optional: delete image file also
    if (dish.image && dish.image.startsWith("/uploads/")) {
      const filePath = `.${dish.image}`;
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.json({ success: true, message: "Dish deleted" });
  } catch (err) {
    console.error("Error deleting dish:", err.message);
    res.status(500).json({ success: false, message: "Server error while deleting dish" });
  }
};
