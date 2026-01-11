import ProductRating from '../models/ProductRating.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import mongoose from 'mongoose';
import asyncHandler from 'express-async-handler';

// @desc    Create a rating for a product
// @route   POST /api/ratings
// @access  Private
export const createRating = asyncHandler(async (req, res) => {
  const { productId, rating, review } = req.body;
  const userId = req.user.id;

  // Check if product exists
  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Check if user has already rated this product
  const existingRating = await ProductRating.findOne({ user: userId, product: productId });
  if (existingRating) {
    res.status(400);
    throw new Error('You have already rated this product');
  }

  // Check if user has purchased this product (for verified purchase)
  const userOrder = await Order.findOne({
    user: userId,
    'orderItems.product': productId
  });

  const isVerifiedPurchase = !!userOrder;

  // Create rating
  const newRating = await ProductRating.create({
    user: userId,
    product: productId,
    rating,
    review,
    isVerifiedPurchase
  });

  // Update product's rating summary
  await updateProductRatingSummary(productId);

  const populatedRating = await ProductRating.findById(newRating._id)
    .populate('user', 'username firstname lastname')
    .populate('product', 'name');

  res.status(201).json(populatedRating);
});

// @desc    Get all ratings for a product
// @route   GET /api/ratings/product/:productId
// @access  Public
export const getProductRatings = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

  const skip = (page - 1) * limit;
  const sortOptions = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

  const ratings = await ProductRating.find({ product: productId })
    .populate('user', 'username firstname lastname')
    .sort(sortOptions)
    .skip(skip)
    .limit(parseInt(limit));

  const total = await ProductRating.countDocuments({ product: productId });

  // Calculate rating distribution
  const ratingDistribution = await ProductRating.aggregate([
    { $match: { product: new mongoose.Types.ObjectId(productId) } },
    { $group: { _id: '$rating', count: { $sum: 1 } } }
  ]);

  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  ratingDistribution.forEach(item => {
    distribution[item._id] = item.count;
  });

  res.json({
    ratings,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    },
    distribution
  });
});

// @desc    Get user's rating for a product
// @route   GET /api/ratings/user/:productId
// @access  Private
export const getUserRating = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const userId = req.user.id;

  const rating = await ProductRating.findOne({ 
    user: userId, 
    product: productId 
  }).populate('user', 'username firstname lastname');

  if (!rating) {
    return res.status(404).json({ message: 'Rating not found' });
  }

  res.json(rating);
});

// @desc    Update a rating
// @route   PUT /api/ratings/:id
// @access  Private
export const updateRating = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { rating, review } = req.body;
  const userId = req.user.id;

  const ratingDoc = await ProductRating.findById(id);
  if (!ratingDoc) {
    res.status(404);
    throw new Error('Rating not found');
  }

  // Check if user owns this rating
  if (ratingDoc.user.toString() !== userId) {
    res.status(403);
    throw new Error('Not authorized to update this rating');
  }

  ratingDoc.rating = rating;
  ratingDoc.review = review;
  await ratingDoc.save();

  // Update product's rating summary
  await updateProductRatingSummary(ratingDoc.product);

  const updatedRating = await ProductRating.findById(id)
    .populate('user', 'username firstname lastname')
    .populate('product', 'name');

  res.json(updatedRating);
});

// @desc    Delete a rating
// @route   DELETE /api/ratings/:id
// @access  Private
export const deleteRating = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const rating = await ProductRating.findById(id);
  if (!rating) {
    res.status(404);
    throw new Error('Rating not found');
  }

  // Check if user owns this rating
  if (rating.user.toString() !== userId) {
    res.status(403);
    throw new Error('Not authorized to delete this rating');
  }

  const productId = rating.product;
  await rating.deleteOne();

  // Update product's rating summary
  await updateProductRatingSummary(productId);

  res.json({ message: 'Rating deleted successfully' });
});

// Helper function to update product's rating summary
async function updateProductRatingSummary(productId) {
  const ratingStats = await ProductRating.aggregate([
    { $match: { product: new mongoose.Types.ObjectId(productId) } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        count: { $sum: 1 },
        distribution: {
          $push: '$rating'
        }
      }
    }
  ]);

  if (ratingStats.length > 0) {
    const stats = ratingStats[0];
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    
    stats.distribution.forEach(rating => {
      distribution[rating]++;
    });

    await Product.findByIdAndUpdate(productId, {
      averageRating: Math.round(stats.averageRating * 10) / 10, // Round to 1 decimal place
      ratingCount: stats.count,
      ratingDistribution: distribution
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      averageRating: 0,
      ratingCount: 0,
      ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    });
  }
}