import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import { connectDB } from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import User from './models/User.js';
import { seedDB } from './seed/seedData.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import propertyRoutes from './routes/propertyRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import statsRoutes from './routes/statsRoutes.js';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS configuration
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    message: 'HouseHunt Backend REST API is running smoothly',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/stats', statsRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Start Server and connect Database
const startServer = async () => {
  try {
    await connectDB();

    // Auto-seed if database is empty
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('[Startup] Empty database detected. Seeding initial data automatically...');
      await seedDB();
    } else {
      console.log(`[Startup] Found ${userCount} existing users in database.`);
    }

    app.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(` HouseHunt REST API Server is running on Port ${PORT}`);
      console.log(` Health check: http://localhost:${PORT}/api/health`);
      console.log(` Mode: ${process.env.NODE_ENV || 'development'}`);
      console.log(`====================================================`);
    });
  } catch (error) {
    console.error(`Failed to initialize server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
