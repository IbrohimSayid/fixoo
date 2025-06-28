const jwt = require('jsonwebtoken');
const User = require('../models/User');

// JWT tokenni tekshirish middleware
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access token required' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Foydalanuvchini ma'lumotlar bazasidan topish
    const user = User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(403).json({ 
      success: false, 
      message: 'Invalid or expired token' 
    });
  }
};

// Rolli autorization (faqat ustalar uchun)
const requireSpecialist = (req, res, next) => {
  if (req.user && req.user.role === 'specialist') {
    next();
  } else {
    return res.status(403).json({ 
      success: false, 
      message: 'Specialist access required' 
    });
  }
};

// Rolli autorization (faqat mijozlar uchun)
const requireClient = (req, res, next) => {
  if (req.user && req.user.role === 'client') {
    next();
  } else {
    return res.status(403).json({ 
      success: false, 
      message: 'Client access required' 
    });
  }
};

// Admin access (kelajakda admin paneli uchun)
const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ 
      success: false, 
      message: 'Admin access required' 
    });
  }
};

// Ixtiyoriy authentication (token bo'lsa tekshirish, bo'lmasa ham davom etish)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      const user = User.findById(decoded.userId);
      
      if (user) {
        req.user = user;
      }
    }
    
    next();
  } catch (error) {
    // Token noto'g'ri bo'lsa ham davom etish
    next();
  }
};

module.exports = {
  authenticateToken,
  requireSpecialist,
  requireClient,
  requireAdmin,
  optionalAuth
}; 