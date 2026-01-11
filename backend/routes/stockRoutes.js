import express from 'express';
import { protect, admin } from '../middleware/auth.js';
import Product from '../models/Product.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

const stockLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs for stock operations
});

// Get low stock products
router.get('/low-stock', protect, admin, stockLimiter, async (req, res) => {
  try {
    const products = await Product.find({
      $expr: {
        $and: [
          { stock: { $gt: 0 } },
          { stock: { $lte: '$lowStockThreshold' } }
        ]
      }
    }).populate('category');
    
    res.json(products);
  } catch (error) {
    console.error('Error fetching low stock products:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get out of stock products
router.get('/out-of-stock', protect, admin, stockLimiter, async (req, res) => {
  try {
    const products = await Product.find({ stock: 0 }).populate('category');
    
    res.json(products);
  } catch (error) {
    console.error('Error fetching out of stock products:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update stock
router.put('/:productId', protect, stockLimiter, async (req, res) => {
  try {

    
    const { stock, lowStockThreshold } = req.body;
    
    const product = await Product.findByIdAndUpdate(
      req.params.productId,
      { 
        stock: parseInt(stock) || 0,
        lowStockThreshold: parseInt(lowStockThreshold) || 10
      },
      { new: true }
    );
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.emit('stock-update', {
        productId: req.params.productId,
        stock: parseInt(stock) || 0,
        lowStockThreshold: parseInt(lowStockThreshold) || 10
      });
    }

    res.json(product);
  } catch (error) {
    console.error('Error updating stock:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;