import express from "express";
import { createProduct, getProducts, updateProduct, deleteProduct } from "../controllers/productController.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, admin, createProduct);
router.get("/", getProducts);
router.put("/:id", protect, admin, updateProduct);
router.delete("/:id", protect, admin, deleteProduct);

export default router;
