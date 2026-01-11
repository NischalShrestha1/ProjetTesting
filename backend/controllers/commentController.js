import ProductComment from '../models/ProductComment.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import mongoose from 'mongoose';
import asyncHandler from 'express-async-handler';

// @desc    Create a comment for a product
// @route   POST /api/comments
// @access  Private
export const createComment = asyncHandler(async (req, res) => {
  const { productId, content } = req.body;
  const userId = req.user.id;

  // Check if product exists
  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Check if user has purchased this product (for verified purchase)
  const userOrder = await Order.findOne({
    user: userId,
    'orderItems.product': productId
  });

  const isVerifiedPurchase = !!userOrder;

  // Create comment
  const newComment = await ProductComment.create({
    user: userId,
    product: productId,
    content,
    isVerifiedPurchase
  });

  const populatedComment = await ProductComment.findById(newComment._id)
    .populate('user', 'username firstname lastname')
    .populate('replies.user', 'username firstname lastname');

  res.status(201).json(populatedComment);
});

// @desc    Get all comments for a product
// @route   GET /api/comments/product/:productId
// @access  Public
export const getProductComments = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

  const skip = (page - 1) * limit;
  const sortOptions = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

  const comments = await ProductComment.find({ product: productId })
    .populate('user', 'username firstname lastname')
    .populate('replies.user', 'username firstname lastname')
    .sort(sortOptions)
    .skip(skip)
    .limit(parseInt(limit));

  const total = await ProductComment.countDocuments({ product: productId });

  res.json({
    comments,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

// @desc    Update a comment
// @route   PUT /api/comments/:id
// @access  Private
export const updateComment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const userId = req.user.id;

  const comment = await ProductComment.findById(id);
  if (!comment) {
    res.status(404);
    throw new Error('Comment not found');
  }

  // Check if user owns this comment
  if (comment.user.toString() !== userId) {
    res.status(403);
    throw new Error('Not authorized to update this comment');
  }

  comment.content = content;
  await comment.save();

  const updatedComment = await ProductComment.findById(id)
    .populate('user', 'username firstname lastname')
    .populate('replies.user', 'username firstname lastname');

  res.json(updatedComment);
});

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
// @access  Private
export const deleteComment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const comment = await ProductComment.findById(id);
  if (!comment) {
    res.status(404);
    throw new Error('Comment not found');
  }

  // Check if user owns this comment
  if (comment.user.toString() !== userId) {
    res.status(403);
    throw new Error('Not authorized to delete this comment');
  }

  await comment.deleteOne();
  res.json({ message: 'Comment deleted successfully' });
});

// @desc    Add reply to a comment
// @route   POST /api/comments/:id/replies
// @access  Private
export const addReply = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const userId = req.user.id;

  const comment = await ProductComment.findById(id);
  if (!comment) {
    res.status(404);
    throw new Error('Comment not found');
  }

  // Add reply
  comment.replies.push({
    user: userId,
    content
  });

  await comment.save();

  const updatedComment = await ProductComment.findById(id)
    .populate('user', 'username firstname lastname')
    .populate('replies.user', 'username firstname lastname');

  res.json(updatedComment);
});

// @desc    Update a reply
// @route   PUT /api/comments/:commentId/replies/:replyId
// @access  Private
export const updateReply = asyncHandler(async (req, res) => {
  const { commentId, replyId } = req.params;
  const { content } = req.body;
  const userId = req.user.id;

  const comment = await ProductComment.findById(commentId);
  if (!comment) {
    res.status(404);
    throw new Error('Comment not found');
  }

  const reply = comment.replies.find(r => r._id.toString() === replyId);
  if (!reply) {
    res.status(404);
    throw new Error('Reply not found');
  }

  // Check if user owns this reply
  if (reply.user.toString() !== userId) {
    res.status(403);
    throw new Error('Not authorized to update this reply');
  }

  reply.content = content;
  await comment.save();

  const updatedComment = await ProductComment.findById(commentId)
    .populate('user', 'username firstname lastname')
    .populate('replies.user', 'username firstname lastname');

  res.json(updatedComment);
});

// @desc    Delete a reply
// @route   DELETE /api/comments/:commentId/replies/:replyId
// @access  Private
export const deleteReply = asyncHandler(async (req, res) => {
  const { commentId, replyId } = req.params;
  const userId = req.user.id;

  const comment = await ProductComment.findById(commentId);
  if (!comment) {
    res.status(404);
    throw new Error('Comment not found');
  }

  const reply = comment.replies.find(r => r._id.toString() === replyId);
  if (!reply) {
    res.status(404);
    throw new Error('Reply not found');
  }

  // Check if user owns this reply
  if (reply.user.toString() !== userId) {
    res.status(403);
    throw new Error('Not authorized to delete this reply');
  }

  comment.replies.pull(replyId);
  await comment.save();

  const updatedComment = await ProductComment.findById(commentId)
    .populate('user', 'username firstname lastname')
    .populate('replies.user', 'username firstname lastname');

  res.json(updatedComment);
});