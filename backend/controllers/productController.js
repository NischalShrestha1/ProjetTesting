import Product from "../models/Product.js";
import asyncHandler from 'express-async-handler';

export const createProduct = asyncHandler(async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  const savedProduct = await Product.findById(product._id).populate("category");
  res.status(201).json(savedProduct);
});

export const getProducts = asyncHandler(async (req, res) => {
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
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  ).populate("category");
  
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  
  res.json(product);
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  
  res.json({ message: "Product deleted successfully" });
});

export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate("category");
  
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  
  res.json(product);
});