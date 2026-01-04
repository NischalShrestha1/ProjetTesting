import Product from "../models/Product.js";

export const createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    const savedProduct = await Product.findById(product._id).populate("category");
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("category");
    // Ensure all products have category info, even if not populated
    const productsWithCategory = products.map(product => {
      // If category is not populated or is null, try to find it by tags
      if (!product.category || (typeof product.category === 'object' && !product.category._id)) {
        // Return product as-is, frontend will handle missing category
        return product;
      }
      return product;
    });
    res.json(productsWithCategory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate("category");
    
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
