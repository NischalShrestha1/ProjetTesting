import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import csrf from "csurf";
import connectDB from "./config/db.js";
import errorHandler from "./middleware/errorHandler.js";
import { createServer } from "http";
import { Server } from "socket.io";

import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import ratingRoutes from "./routes/ratingRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import stockRoutes from "./routes/stockRoutes.js";
dotenv.config();
connectDB();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://localhost:3000','https://animerch-indol.vercel.app'],
    methods: ["GET", "POST"],
    credentials: true
  }
});

// CORS configuration to allow credentials
app.use(cors({
  origin: ['http://localhost:5173','http://localhost:5174','http://localhost:5175','http://localhost:3000','https://animerch-indol.vercel.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// CSRF protection middleware (uses cookie-based tokens)
const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);

// Route to provide CSRF token to clients
app.get("/api/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Routes
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/stock', stockRoutes);
app.use(errorHandler);

// Test route   

app.get("/", (req, res) => res.send("E-commerce API is running"));

// Debug route to check JWT_SECRET
app.get("/debug-jwt", (req, res) => {
  res.json({ 
    hasJwtSecret: !!process.env.JWT_SECRET,
    jwtSecretLength: process.env.JWT_SECRET?.length || 0
  });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('🔌 User connected:', socket.id);

  socket.on('join-user-room', (userId) => {
    socket.join(`user-${userId}`);
    console.log(`👤 User ${userId} joined their room`);
  });

  socket.on('disconnect', () => {
    console.log('🔌 User disconnected:', socket.id);
  });
});

// Make io available to routes
app.set('io', io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT} with WebSocket support`));
