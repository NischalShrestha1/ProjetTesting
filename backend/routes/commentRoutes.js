import express from 'express';
import {
  createComment,
  getProductComments,
  updateComment,
  deleteComment,
  addReply,
  updateReply,
  deleteReply
} from '../controllers/commentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .post(protect, createComment);

router.route('/product/:productId')
  .get(getProductComments);

router.route('/:id')
  .put(protect, updateComment)
  .delete(protect, deleteComment);

router.route('/:id/replies')
  .post(protect, addReply);

router.route('/:commentId/replies/:replyId')
  .put(protect, updateReply)
  .delete(protect, deleteReply);

export default router;