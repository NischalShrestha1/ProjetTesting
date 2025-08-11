import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: false }, // Add this
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  description: { type: String },
  rating: { type: Number, default: 0 }, // Add this
  tags: { type: [String], default: [] }, // Add this
}, { timestamps: true });

export default mongoose.model("Product", productSchema);

