const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const orderRoutes = require('./routes/orders');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit ni oshirdim
  message: {
    success: false,
    message: 'Juda ko\'p so\'rovlar yuborildi, keyinroq qayta urinib ko\'ring'
  }
});

app.use('/api/', limiter);

// CORS configuration - Bitta joyda barcha sozlamalar
const corsOptions = {
  origin: function (origin, callback) {
    // Origin yo'q bo'lsa (masalan, mobile app yoki Postman) ruxsat berish
    if (!origin) return callback(null, true);
    
    const allowedOrigins = process.env.NODE_ENV === 'production' 
      ? [
          "https://fixoouzadmin.netlify.app",
          "https://fixoo-frontend.netlify.app",
          "https://fixoouz.netlify.app"
        ]
      : [
          "http://localhost:3000",
          "http://127.0.0.1:3000",
          "http://localhost:3001", 
          "http://127.0.0.1:3001",
          "https://fixoouzadmin.netlify.app",
          "https://fixoo-frontend.netlify.app",
          "https://fixoouz.netlify.app"
        ];
        
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS ruxsat berilmagan origin:', origin);
      callback(null, true); // Development uchun barcha originlarga ruxsat
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept', 'Cache-Control'],
  exposedHeaders: ['Content-Length', 'X-Total-Count'],
  preflightContinue: false,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control');
  res.status(200).end();
});

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files middleware - Avatar va boshqa upload'lar uchun
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Logging middleware
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Health check endpoint for Render.com
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Fixoo Server ishlayapti',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime()
  });
});

// Debug CORS endpoint
app.get('/debug/cors', (req, res) => {
  res.json({
    success: true,
    corsConfig: {
      environment: process.env.NODE_ENV || 'development',
      allowedOrigins: process.env.NODE_ENV === 'production' 
        ? [
            'https://fixoouzadmin.netlify.app',
            'https://fixoo-frontend.netlify.app', 
            'https://your-frontend.netlify.app',
            ...(process.env.ALLOWED_ORIGINS || '').split(',').filter(Boolean)
          ]
        : ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:3001', 'http://127.0.0.1:3001'],
      requestOrigin: req.headers.origin,
      allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept']
    }
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);

// Welcome endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Fixoo API Server',
    version: '1.0.0',
    docs: '/api/docs',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      orders: '/api/orders'
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint topilmadi',
    path: req.originalUrl
  });
});

// Global error handler
app.use((error, req, res, next) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error('Server Error:', error);
  }
  
  res.status(error.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' 
      ? 'Server xatosi yuz berdi' 
      : error.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: error.stack })
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received. Shutting down gracefully...');
  process.exit(0);
});

// Render.com serverini uyqu holatiga o'tishdan saqlash uchun keepalive
const keepAlive = () => {
  const url = `http://localhost:${PORT}/health`;
  
  setInterval(async () => {
    try {
      const response = await fetch(url);
      console.log(`🔄 Keepalive ping: ${response.status} - ${new Date().toISOString()}`);
    } catch (error) {
      console.log('❌ Keepalive ping failed:', error.message);
    }
  }, 10 * 60 * 1000); // Har 10 daqiqada
};

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Fixoo Server ${PORT}-portda ishlamoqda!`);
  console.log(`📋 Health check: http://localhost:${PORT}/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  
  if (process.env.NODE_ENV !== 'production') {
    console.log(`📖 API docs: http://localhost:${PORT}/`);
  }

  // Faqat production'da keepalive ishga tushirish
  if (process.env.NODE_ENV === 'production') {
    console.log('🔄 Keepalive tizimi ishga tushirildi');
    keepAlive();
  }
}); 