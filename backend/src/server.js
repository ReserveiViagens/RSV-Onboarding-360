const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import configurations and utilities
const logger = require('./utils/logger');
const { connectDatabase } = require('./config/database');
const { setupSwagger } = require('./config/swagger');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const customerRoutes = require('./routes/customers');
const travelPackageRoutes = require('./routes/travel-packages');
const bookingRoutes = require('./routes/bookings');
const paymentRoutes = require('./routes/payments');
const uploadRoutes = require('./routes/uploads');
const analyticsRoutes = require('./routes/analytics');
const workflowRoutes = require('./routes/workflows');
const projectRoutes = require('./routes/projects');
const financialRoutes = require('./routes/financial');
const integrationRoutes = require('./routes/integrations');
const securityRoutes = require('./routes/security');
const performanceRoutes = require('./routes/performance');
const backupRoutes = require('./routes/backup');
const trainingRoutes = require('./routes/training');

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const { authenticateToken } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: (process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000, // 15 minutes
  max: process.env.RATE_LIMIT_MAX || 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));
}

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use('/uploads', express.static('uploads'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Documentation
if (process.env.API_DOCS_ENABLED === 'true') {
  setupSwagger(app);
}

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', authenticateToken, userRoutes);
app.use('/api/customers', authenticateToken, customerRoutes);
app.use('/api/travel-packages', authenticateToken, travelPackageRoutes);
app.use('/api/bookings', authenticateToken, bookingRoutes);
app.use('/api/payments', authenticateToken, paymentRoutes);
app.use('/api/uploads', authenticateToken, uploadRoutes);
app.use('/api/analytics', authenticateToken, analyticsRoutes);
app.use('/api/workflows', authenticateToken, workflowRoutes);
app.use('/api/projects', authenticateToken, projectRoutes);
app.use('/api/financial', authenticateToken, financialRoutes);
app.use('/api/integrations', authenticateToken, integrationRoutes);
app.use('/api/security', authenticateToken, securityRoutes);
app.use('/api/performance', authenticateToken, performanceRoutes);
app.use('/api/backup', authenticateToken, backupRoutes);
app.use('/api/training', authenticateToken, trainingRoutes);

// API base route
app.get('/api', (req, res) => {
  res.json({
    message: 'Onboarding RSV API',
    version: '1.0.0',
    documentation: process.env.API_DOCS_ENABLED === 'true' ? '/api-docs' : 'Documentation disabled',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      bookings: '/api/bookings',
      payments: '/api/payments',
      uploads: '/api/uploads',
      analytics: '/api/analytics',
      workflows: '/api/workflows',
      projects: '/api/projects',
      financial: '/api/financial',
      integrations: '/api/integrations',
      security: '/api/security',
      performance: '/api/performance',
      backup: '/api/backup',
      training: '/api/training'
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `The requested route ${req.originalUrl} does not exist`,
    code: 'ROUTE_NOT_FOUND'
  });
});

// Error handling middleware (should be last)
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

// Start server
const startServer = async () => {
  try {
    // Connect to database
    await connectDatabase();
    
    // Start HTTP server
    const server = app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
      logger.info(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`🔗 Health check: http://localhost:${PORT}/health`);
      if (process.env.API_DOCS_ENABLED === 'true') {
        logger.info(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
      }
    });

    // Initialize WebSocket
    const { initializeWebSocket } = require('./utils/websocket');
    const io = initializeWebSocket(server);
    logger.info(`🔌 WebSocket server initialized on port ${PORT}`);

    // Handle server errors
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        logger.error(`Port ${PORT} is already in use`);
      } else {
        logger.error('Server error:', error);
      }
      process.exit(1);
    });

    return { server, io };
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server if this file is run directly
if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
