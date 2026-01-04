import express from "express";
import { getDashboardStats } from "../controllers/adminController.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

// All admin routes require protection and admin role
router.use(protect);
router.use(admin);

router.get("/stats", getDashboardStats);

export default router;