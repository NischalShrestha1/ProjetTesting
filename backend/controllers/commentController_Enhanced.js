import ProductComment from '../models/ProductComment.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import mongoose from 'mongoose';
import asyncHandler from 'express-async-handler';

// ✅ CREATE COMMENT - with enhanced validation and UX
export const createComment = asyncHandler(async (req, res) => {
  const { productId, content } = req.body;
  const userId = req.user.id;

  // 🛡️ VALIDATION: Check if product exists
  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  // 🛡️ VALIDATION: Comment length
  if (!content || content.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Comment cannot be empty'
    });
  }

  if (content.length > 1000) {
    return res.status(400).json({
      success: false,
      message: 'Comment cannot exceed 1000 characters'
    });
  }

  // 🛡️ VALIDATION: User must have purchased and received delivery before commenting
  const userOrder = await Order.findOne({
    user: userId,
    'orderItems.product': productId,
    isDelivered: true
  });

  if (!userOrder) {
    return res.status(403).json({
      success: false,
      message: 'You can only comment on products after they have been delivered to you.'
    });
  }

  const isVerifiedPurchase = true;

  // ✅ CREATE: Create comment
  const newComment = await ProductComment.create({
    user: userId,
    product: productId,
    content: content.trim(),
    isVerifiedPurchase
  });

  // ✅ RETURN: Populated comment with user and replies
  const populatedComment = await ProductComment.findById(newComment._id)
    .populate('user', 'username firstname lastname')
    .populate('replies.user', 'username firstname lastname');

  res.status(201).json({
    success: true,
    data: populatedComment,
    message: 'Comment posted successfully!'
  });
});

// ✅ GET COMMENTS - with sorting and pagination
export const getProductComments = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const {
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;

  const skip = (page - 1) * limit;
  const sortOptions = {
    [sortBy]: sortOrder === 'desc' ? -1 : 1
  };

  // ✅ FETCH: Get comments with populated data
  const comments = await ProductComment.find({ product: productId })
    .populate('user', 'username firstname lastname')
    .populate('replies.user', 'username firstname lastname')
    .sort(sortOptions)
    .skip(skip)
    .limit(parseInt(limit));

  const total = await ProductComment.countDocuments({ product: productId });

  // ✅ RETURN: Comments with pagination
  res.json({
    success: true,
    data: {
      comments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
});

// ✅ UPDATE COMMENT - with validation
export const updateComment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const userId = req.user.id;

  const comment = await ProductComment.findById(id);
  if (!comment) {
    return res.status(404).json({
      success: false,
      message: 'Comment not found'
    });
  }

  // 🛡️ AUTHORIZATION: Only owner can update
  if (comment.user.toString() !== userId && !req.user.isAdmin) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this comment'
    });
  }

  // 🛡️ VALIDATION: Comment length
  if (!content || content.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Comment cannot be empty'
    });
  }

  if (content.length > 1000) {
    return res.status(400).json({
      success: false,
      message: 'Comment cannot exceed 1000 characters'
    });
  }

  // ✅ UPDATE: Update comment
  comment.content = content.trim();
  await comment.save();

  // ✅ RETURN: Updated comment
  const updatedComment = await ProductComment.findById(id)
    .populate('user', 'username firstname lastname')
    .populate('replies.user', 'username firstname lastname');

  res.json({
    success: true,
    data: updatedComment,
    message: 'Comment updated successfully!'
  });
});

// ✅ DELETE COMMENT - with authorization
export const deleteComment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const comment = await ProductComment.findById(id);
  if (!comment) {
    return res.status(404).json({
      success: false,
      message: 'Comment not found'
    });
  }

  // 🛡️ AUTHORIZATION: Only owner or admin can delete
  if (comment.user.toString() !== userId && !req.user.isAdmin) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete this comment'
    });
  }

  // ✅ DELETE: Delete comment (also deletes all replies)
  await comment.deleteOne();

  res.json({
    success: true,
    message: 'Comment deleted successfully!'
  });
});

// ✅ ADD REPLY - with validation
export const addReply = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const userId = req.user.id;

  const comment = await ProductComment.findById(id);
  if (!comment) {
    return res.status(404).json({
      success: false,
      message: 'Comment not found'
    });
  }

  // 🛡️ VALIDATION: Reply length
  if (!content || content.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Reply cannot be empty'
    });
  }

  if (content.length > 1000) {
    return res.status(400).json({
      success: false,
      message: 'Reply cannot exceed 1000 characters'
    });
  }

  // ✅ CREATE: Add reply to comment
  comment.replies.push({
    user: userId,
    content: content.trim()
  });

  await comment.save();

  // ✅ RETURN: Updated comment with new reply
  const updatedComment = await ProductComment.findById(id)
    .populate('user', 'username firstname lastname')
    .populate('replies.user', 'username firstname lastname');

  res.status(201).json({
    success: true,
    data: updatedComment,
    message: 'Reply added successfully!'
  });
});

// ✅ UPDATE REPLY - with validation and authorization
export const updateReply = asyncHandler(async (req, res) => {
  const { commentId, replyId } = req.params;
  const { content } = req.body;
  const userId = req.user.id;

  const comment = await ProductComment.findById(commentId);
  if (!comment) {
    return res.status(404).json({
      success: false,
      message: 'Comment not found'
    });
  }

  // ✅ FIND: Find the reply in the comment's replies array
  const reply = comment.replies.id(replyId);
  if (!reply) {
    return res.status(404).json({
      success: false,
      message: 'Reply not found'
    });
  }

  // 🛡️ AUTHORIZATION: Only owner can update
  if (reply.user.toString() !== userId && !req.user.isAdmin) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this reply'
    });
  }

  // 🛡️ VALIDATION: Reply length
  if (!content || content.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Reply cannot be empty'
    });
  }

  if (content.length > 1000) {
    return res.status(400).json({
      success: false,
      message: 'Reply cannot exceed 1000 characters'
    });
  }

  // ✅ UPDATE: Update reply content
  reply.content = content.trim();
  await comment.save();

  // ✅ RETURN: Updated comment
  const updatedComment = await ProductComment.findById(commentId)
    .populate('user', 'username firstname lastname')
    .populate('replies.user', 'username firstname lastname');

  res.json({
    success: true,
    data: updatedComment,
    message: 'Reply updated successfully!'
  });
});

// ✅ DELETE REPLY - with authorization
export const deleteReply = asyncHandler(async (req, res) => {
  const { commentId, replyId } = req.params;
  const userId = req.user.id;

  const comment = await ProductComment.findById(commentId);
  if (!comment) {
    return res.status(404).json({
      success: false,
      message: 'Comment not found'
    });
  }

  // ✅ FIND: Find the reply in the comment's replies array
  const reply = comment.replies.id(replyId);
  if (!reply) {
    return res.status(404).json({
      success: false,
      message: 'Reply not found'
    });
  }

  // 🛡️ AUTHORIZATION: Only owner or admin can delete
  if (reply.user.toString() !== userId && !req.user.isAdmin) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete this reply'
    });
  }

  // ✅ DELETE: Remove reply from array
  comment.replies.pull(replyId);
  await comment.save();

  // ✅ RETURN: Updated comment
  const updatedComment = await ProductComment.findById(commentId)
    .populate('user', 'username firstname lastname')
    .populate('replies.user', 'username firstname lastname');

  res.json({
    success: true,
    data: updatedComment,
    message: 'Reply deleted successfully!'
  });
});
