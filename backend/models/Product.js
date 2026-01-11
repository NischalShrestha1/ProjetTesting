import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: false },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  description: { type: String },
  tags: { type: [String], default: [] },
  sizes: { 
    type: [String], 
    default: ["S", "M", "L", "XL"],
    enum: ["XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL", "5XL"]
  },
  
  // Stock management
  stock: { 
    type: Number, 
    required: true, 
    default: 0,
    min: 0
  },
  lowStockThreshold: {
    type: Number,
    default: 10,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Rating summary (calculated from ratings)
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  ratingCount: {
    type: Number,
    default: 0,
    min: 0
  },
  ratingDistribution: {
    type: Map,
    of: Number,
    default: {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0
    }
  }
}, { timestamps: true });

// Index for stock queries
productSchema.index({ stock: 1 });
productSchema.index({ isActive: 1 });
productSchema.index({ averageRating: -1 });

export default mongoose.model("Product", productSchema);

