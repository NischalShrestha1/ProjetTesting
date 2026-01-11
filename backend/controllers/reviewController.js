import Order from '../models/Order.js';
import Product from '../models/Product.js';
import asyncHandler from 'express-async-handler';

// ✅ CHECK DELIVERY STATUS - Check if user can review product
export const checkDeliveryStatus = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const userId = req.user.id;

  // 🛡️ CHECK: Verify user has purchased the product (delivery no longer required)
  const userOrder = await Order.findOne({
    user: userId,
    'orderItems.product': productId
  });

  const canReview = !!userOrder;

  res.json({
    success: true,
    canReview,
    message: canReview 
      ? 'You can review this product' 
      : 'You can only review products after you have purchased them.'
  });
});

// ✅ TEST: Create a test delivered order (for development testing)
export const createTestDeliveredOrder = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const userId = req.user.id;

  // Check if product exists
  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  // Check if already has a delivered order
  const existingOrder = await Order.findOne({
    user: userId,
    'orderItems.product': productId,
    isDelivered: true
  });

  if (existingOrder) {
    return res.status(400).json({
      success: false,
      message: 'You already have a delivered order for this product'
    });
  }

  // Create test delivered order
  const testOrder = await Order.create({
    user: userId,
    orderItems: [{
      product: productId,
      name: product.name,
      image: product.image,
      price: product.price,
      quantity: 1
    }],
    shippingAddress: {
      address: 'Test Address',
      phone: '1234567890'
    },
    paymentMethod: 'COD',
    itemsPrice: product.price,
    shippingPrice: 0,
    totalPrice: product.price,
    isPaid: true,
    paidAt: new Date(),
    isDelivered: true,
    deliveredAt: new Date(),
    status: 'Delivered'
  });

  res.status(201).json({
    success: true,
    message: 'Test delivered order created successfully. You can now rate this product.',
    data: testOrder
  });
});