import ProductRating from '../models/ProductRating.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import mongoose from 'mongoose';
import asyncHandler from 'express-async-handler';

// ✅ CREATE RATING - with enhanced validation and UX
export const createRating = asyncHandler(async (req, res) => {
  const { productId, rating, review } = req.body;
  const userId = req.user.id;

  // 🛡️ VALIDATION: Check if product exists
  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  // 🛡️ VALIDATION: One rating per user per product
  const existingRating = await ProductRating.findOne({ user: userId, product: productId });
  if (existingRating) {
    return res.status(400).json({
      success: false,
      message: 'You have already rated this product. Update your existing rating instead.'
    });
  }

  // 🛡️ VALIDATION: User must have purchased and received delivery before rating
  const userOrder = await Order.findOne({
    user: userId,
    'orderItems.product': productId,
    isDelivered: true
  });

  if (!userOrder) {
    return res.status(403).json({
      success: false,
      message: 'You can only rate products after they have been delivered to you.'
    });
  }

  const isVerifiedPurchase = true;

  // ✅ VALIDATION: Rating must be 1-5
  if (rating < 1 || rating > 5) {
    return res.status(400).json({
      success: false,
      message: 'Rating must be between 1 and 5 stars'
    });
  }

  // ✅ VALIDATION: Review length
  if (review && review.length > 500) {
    return res.status(400).json({
      success: false,
      message: 'Review cannot exceed 500 characters'
    });
  }

  // ✅ CREATE: Create new rating
  const newRating = await ProductRating.create({
    user: userId,
    product: productId,
    rating,
    review,
    isVerifiedPurchase
  });

  // ✅ UPDATE: Update product's rating summary
  await updateProductRatingSummary(productId);

  // ✅ RETURN: Populated rating with user info
  const populatedRating = await ProductRating.findById(newRating._id)
    .populate('user', 'username firstname lastname')
    .populate('product', 'name');

  res.status(201).json({
    success: true,
    data: populatedRating,
    message: 'Rating submitted successfully!'
  });
});

// ✅ GET RATINGS - with sorting and pagination for better UX
export const getProductRatings = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const {
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    sortOrder = 'desc' // desc = newest first
  } = req.query;

  const skip = (page - 1) * limit;
  const sortOptions = {
    [sortBy]: sortOrder === 'desc' ? -1 : 1
  };

  // ✅ FETCH: Get ratings with populated user info
  const ratings = await ProductRating.find({ product: productId })
    .populate('user', 'username firstname lastname')
    .sort(sortOptions)
    .skip(skip)
    .limit(parseInt(limit));

  const total = await ProductRating.countDocuments({ product: productId });

  // ✅ ANALYTICS: Calculate rating distribution for visualization
  const ratingDistribution = await ProductRating.aggregate([
    { $match: { product: new mongoose.Types.ObjectId(productId) } },
    { $group: { _id: '$rating', count: { $sum: 1 } } }
  ]);

  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  ratingDistribution.forEach(item => {
    distribution[item._id] = item.count;
  });

  // ✅ RETURN: Ratings with pagination and distribution
  res.json({
    success: true,
    data: {
      ratings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      },
      distribution
    }
  });
});

// ✅ GET USER RATING - for pre-filling form
export const getUserRating = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const userId = req.user.id;

  const rating = await ProductRating.findOne({
    user: userId,
    product: productId
  }).populate('user', 'username firstname lastname');

  if (!rating) {
    return res.status(404).json({
      success: false,
      message: 'Rating not found'
    });
  }

  res.json({
    success: true,
    data: rating
  });
});

// ✅ UPDATE RATING - with validation
export const updateRating = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { rating, review } = req.body;
  const userId = req.user.id;

  const ratingDoc = await ProductRating.findById(id);
  if (!ratingDoc) {
    return res.status(404).json({
      success: false,
      message: 'Rating not found'
    });
  }

  // 🛡️ AUTHORIZATION: Only owner can update
  if (ratingDoc.user.toString() !== userId) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this rating'
    });
  }

  // ✅ VALIDATION: Rating 1-5
  if (rating < 1 || rating > 5) {
    return res.status(400).json({
      success: false,
      message: 'Rating must be between 1 and 5 stars'
    });
  }

  // ✅ VALIDATION: Review length
  if (review && review.length > 500) {
    return res.status(400).json({
      success: false,
      message: 'Review cannot exceed 500 characters'
    });
  }

  // ✅ UPDATE: Update rating
  ratingDoc.rating = rating;
  ratingDoc.review = review;
  await ratingDoc.save();

  // ✅ UPDATE: Update product's rating summary
  await updateProductRatingSummary(ratingDoc.product);

  // ✅ RETURN: Updated rating
  const updatedRating = await ProductRating.findById(id)
    .populate('user', 'username firstname lastname')
    .populate('product', 'name');

  res.json({
    success: true,
    data: updatedRating,
    message: 'Rating updated successfully!'
  });
});

// ✅ DELETE RATING - with authorization
export const deleteRating = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const rating = await ProductRating.findById(id);
  if (!rating) {
    return res.status(404).json({
      success: false,
      message: 'Rating not found'
    });
  }

  // 🛡️ AUTHORIZATION: Only owner or admin can delete
  if (rating.user.toString() !== userId && !req.user.isAdmin) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete this rating'
    });
  }

  const productId = rating.product;
  await rating.deleteOne();

  // ✅ UPDATE: Update product's rating summary
  await updateProductRatingSummary(productId);

  res.json({
    success: true,
    message: 'Rating deleted successfully!'
  });
});

// ✅ HELPER: Update product's rating summary automatically
async function updateProductRatingSummary(productId) {
  const ratingStats = await ProductRating.aggregate([
    { $match: { product: new mongoose.Types.ObjectId(productId) } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        count: { $sum: 1 },
        distribution: { $push: '$rating' }
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
      averageRating: Math.round(stats.averageRating * 10) / 10,
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
