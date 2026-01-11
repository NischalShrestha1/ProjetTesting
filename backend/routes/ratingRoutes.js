import express from 'express';
import {
  createRating,
  getProductRatings,
  getUserRating,
  updateRating,
  deleteRating
} from '../controllers/ratingController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .post(protect, createRating);

router.route('/user/:productId')
  .get(protect, getUserRating);

router.route('/product/:productId')
  .get(getProductRatings);

router.route('/:id')
  .put(protect, updateRating)
  .delete(protect, deleteRating);

export default router;