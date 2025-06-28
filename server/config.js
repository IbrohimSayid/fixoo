// Server Configuration
module.exports = {
  // Server
  port: process.env.PORT || 5000,
  env: process.env.NODE_ENV || 'development',
  
  // Security
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  
  // Rate Limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100
  },
  
  // File Upload
  upload: {
    maxFileSize: '10mb',
    uploadDir: 'uploads'
  },
  
  // CORS
  corsOrigins: process.env.NODE_ENV === 'production' 
    ? ['https://fixoo.uz', 'https://admin.fixoo.uz']
    : ['http://localhost:3000', 'http://localhost:3001'],
    
  // Pagination
  pagination: {
    defaultLimit: 10,
    maxLimit: 100
  }
}; 