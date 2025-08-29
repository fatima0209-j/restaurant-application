import mongoose from "mongoose";

const dishSchema = new mongoose.Schema({
  name: { type: String, required: true },  
  description: { type: String },
  image: { type: String },                 
}, { timestamps: true });

export default mongoose.model("Dish", dishSchema);
