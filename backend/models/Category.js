import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  id: { type: String, required: false, unique: true }, // This can be used as a slug or identifier
  name: { type: String, required: true, unique: true },
  image: { type: String, required: false },
  description: { type: String, required: false },
}, { timestamps: true });

export default mongoose.model("Category", categorySchema);