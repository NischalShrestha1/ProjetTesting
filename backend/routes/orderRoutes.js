import express from "express";
import { createOrder, getOrders, getOrderById, updateOrderStatus, getAllOrders, getOrderStats } from "../controllers/orderController.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

// All routes are protected
router.use(protect);

router.post("/", createOrder);
router.get("/", getOrders);
router.get("/:id", getOrderById);
router.put("/:id/status", updateOrderStatus);

// Admin routes
router.get("/admin/all", protect, admin, getAllOrders);
router.get("/admin/stats", protect, admin, getOrderStats);

// Test endpoint for debugging
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Orders routes are working",
    timestamp: new Date().toISOString()
  });
});

export default router;