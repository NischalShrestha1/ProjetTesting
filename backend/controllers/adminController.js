import Product from "../models/Product.js";
import Category from "../models/Category.js";
import Order from "../models/Order.js";
import User from "../models/User.js";

export const getDashboardStats = async (req, res, next) => {
  try {
    // Get counts
    const [totalProducts, totalCategories, totalOrders, totalUsers] = await Promise.all([
      Product.countDocuments(),
      Category.countDocuments(),
      Order.countDocuments(),
      User.countDocuments({ isAdmin: false })
    ]);

    // Get revenue data
    const revenueData = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]);

    // Get category distribution
    const categoryStats = await Product.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $lookup: { from: "categories", localField: "_id", foreignField: "_id", as: "category" } },
      { $unwind: "$category" },
      { $project: { name: "$category.name", count: 1 } }
    ]);

    // Get recent orders
    const recentOrders = await Order.find({})
      .populate('user', 'username email')
      .sort({ createdAt: -1 })
      .limit(5);

    // Get top products
    const topProducts = [];

    res.status(200).json({
      success: true,
      stats: {
        totalProducts,
        totalCategories,
        totalOrders,
        totalUsers,
        totalRevenue: revenueData[0]?.total || 0,
      },
      categoryStats,
      recentOrders,
      topProducts
    });
  } catch (error) {
    next(error);
  }
};