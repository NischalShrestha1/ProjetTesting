import express from "express";
import { createOrder, getOrders, getOrderById, updateOrderStatus, getAllOrders, getOrderStats } from "../controllers/orderController.js";
import { checkDeliveryStatus, createTestDeliveredOrder } from "../controllers/reviewController.js";
import { protect, admin } from "../middleware/auth.js";
import rateLimit from "express-rate-limit";

const router = express.Router();

const orderCreationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 order creation requests per window
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// All routes are protected
router.use(protect);

// Specific routes first (to avoid conflicts with /:id)
router.get("/check-delivery/:productId", checkDeliveryStatus);
router.post("/test-delivered/:productId", createTestDeliveredOrder);
router.get("/admin/all", admin, getAllOrders);
router.get("/admin/stats", admin, getOrderStats);

router.post("/", orderCreationLimiter, createOrder);
router.get("/", getOrders);
router.get("/:id", getOrderById);
router.put("/:id/status", updateOrderStatus);

// Test endpoint for debugging
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Orders routes are working",
    timestamp: new Date().toISOString()
  });
});

export default router;