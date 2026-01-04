import express from "express";
import { register, login, getProfile, updateProfile, logout, getUsers, updateUser, deleteUser } from "../controllers/userController.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

// Register route
router.post("/register", register);

// Login route
router.post("/login", login);

// Logout route
router.get("/logout", logout);

// Protected routes
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

// Admin routes
router.get("/", protect, admin, getUsers);
router.put("/:id", protect, admin, updateUser);
router.delete("/:id", protect, admin, deleteUser);

// Debug endpoint
router.get("/debug", protect, (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user._id,
      email: req.user.email,
      isAdmin: req.user.isAdmin
    },
    message: "User authentication working"
  });
});

export default router;
