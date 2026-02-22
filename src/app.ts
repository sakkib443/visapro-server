// ===================================================================
// VisaPro - Main Application File
// Express app setup with all routes and middleware
// মূল এপ্লিকেশন ফাইল - সব routes এবং middleware এখানে connect হয়েছে
// ===================================================================

import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import cookieParser from 'cookie-parser';

// ==================== Middleware Imports ====================
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFoundHandler from './app/middlewares/notFoundHandler';
import config from './app/config';

// ==================== Route Imports ====================
import { AuthRoutes } from './app/modules/auth/auth.routes';
import { UserRoutes } from './app/modules/user/user.routes';
import { uploadRoutes } from './app/modules/upload/upload.routes';
import { BlogRoutes } from './app/modules/blog/blog.routes';

// ==================== App Initialization ====================
const app: Application = express();

// ==================== Global Middlewares ====================
// JSON body parser
app.use(express.json({ limit: '10mb' }));

// URL encoded parser
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parser (for refresh token)
app.use(cookieParser());

// CORS configuration - supports multiple origins for production
const allowedOrigins = [
  config.frontend_url,
  'http://localhost:3000',
  'https://visapro.vercel.app',
  'https://visapro.com.bd',
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(null, true); // Allow all origins in production for API
      }
    },
    credentials: true, // Allow cookies
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ==================== Health Check Route ====================
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: '🚀 VisaPro API Server is running!',
    version: '1.0.0',
    environment: config.env,
    timestamp: new Date().toISOString(),
  });
});

// ==================== API Health Check ====================
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'API is healthy',
    uptime: process.uptime(),
  });
});

// ==================== API Routes ====================
// Authentication routes (public)
app.use('/api/auth', AuthRoutes);

// User routes (authenticated)
app.use('/api/users', UserRoutes);

// Upload routes (authenticated)
app.use('/api/upload', uploadRoutes);

// Blog routes (blog posts and comments)
app.use('/api/blogs', BlogRoutes);

// ==================== Error Handling ====================
// 404 Not Found handler (must be after all routes)
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(globalErrorHandler);

export default app;
