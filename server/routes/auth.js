const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

// Usta registratsiyasi
router.post('/register/specialist', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password, profession, address, region, district } = req.body;

    // Majburiy maydonlarni tekshirish
    if (!firstName || !lastName || !phone || !password || !profession || !region) {
      return res.status(400).json({
        success: false,
        message: 'Barcha majburiy maydonlarni to\'ldiring (ism, familiya, telefon, parol, kasb, hudud)'
      });
    }

    // Email formatini tekshirish (agar berilgan bo'lsa)
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Email formati noto\'g\'ri'
        });
      }
    }

    // Telefon formatini tekshirish
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Telefon raqami formati noto\'g\'ri'
      });
    }

    // Parol uzunligini tekshirish
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak'
      });
    }

    const userData = {
      firstName,
      lastName,
      email: email || null,
      phone,
      password,
      role: 'specialist',
      profession,
      address,
      region,
      district
    };

    const newUser = await User.create(userData);

    // JWT token yaratish
    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      { userId: newUser.id, role: newUser.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      message: 'Usta muvaffaqiyatli ro\'yxatdan o\'tdi',
      data: {
        user: newUser,
        token
      }
    });

  } catch (error) {
    console.error('Specialist registration error:', error);
    
    if (error.message === 'User with this email or phone already exists') {
      return res.status(409).json({
        success: false,
        message: 'Bu email yoki telefon raqami allaqachon ro\'yxatdan o\'tgan'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server xatosi',
      error: error.message
    });
  }
});

// Mijoz registratsiyasi
router.post('/register/client', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password, address, region, district } = req.body;

    // Majburiy maydonlarni tekshirish
    if (!firstName || !lastName || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Barcha majburiy maydonlarni to\'ldiring (ism, familiya, telefon, parol)'
      });
    }

    // Email formatini tekshirish (agar berilgan bo'lsa)
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Email formati noto\'g\'ri'
        });
      }
    }

    // Telefon formatini tekshirish
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Telefon raqami formati noto\'g\'ri'
      });
    }

    // Parol uzunligini tekshirish
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak'
      });
    }

    const userData = {
      firstName,
      lastName,
      email: email || null,
      phone,
      password,
      role: 'client',
      profession: null,
      address,
      region,
      district
    };

    const newUser = await User.create(userData);

    // JWT token yaratish
    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      { userId: newUser.id, role: newUser.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      message: 'Mijoz muvaffaqiyatli ro\'yxatdan o\'tdi',
      data: {
        user: newUser,
        token
      }
    });

  } catch (error) {
    console.error('Client registration error:', error);
    
    if (error.message === 'User with this email or phone already exists') {
      return res.status(409).json({
        success: false,
        message: 'Bu email yoki telefon raqami allaqachon ro\'yxatdan o\'tgan'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server xatosi',
      error: error.message
    });
  }
});

// Usta tizimga kirish
router.post('/login/specialist', async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;

    if (!emailOrPhone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email/telefon va parol majburiy'
      });
    }

    const result = await User.login(emailOrPhone, password);
    
    // Foydalanuvchi rolini tekshirish
    if (result.user.role !== 'specialist') {
      return res.status(403).json({
        success: false,
        message: 'Siz usta sifatida ro\'yxatdan o\'tmagansiz'
      });
    }

    res.json({
      success: true,
      message: 'Usta muvaffaqiyatli kirdi',
      data: result
    });

  } catch (error) {
    console.error('Specialist login error:', error);
    
    if (error.message === 'User not found') {
      return res.status(404).json({
        success: false,
        message: 'Foydalanuvchi topilmadi'
      });
    }
    
    if (error.message === 'Invalid password') {
      return res.status(401).json({
        success: false,
        message: 'Noto\'g\'ri parol'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server xatosi',
      error: error.message
    });
  }
});

// Mijoz tizimga kirish
router.post('/login/client', async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;

    if (!emailOrPhone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email/telefon va parol majburiy'
      });
    }

    const result = await User.login(emailOrPhone, password);
    
    // Foydalanuvchi rolini tekshirish
    if (result.user.role !== 'client') {
      return res.status(403).json({
        success: false,
        message: 'Siz mijoz sifatida ro\'yxatdan o\'tmagansiz'
      });
    }

    res.json({
      success: true,
      message: 'Mijoz muvaffaqiyatli kirdi',
      data: result
    });

  } catch (error) {
    console.error('Client login error:', error);
    
    if (error.message === 'User not found') {
      return res.status(404).json({
        success: false,
        message: 'Foydalanuvchi topilmadi'
      });
    }
    
    if (error.message === 'Invalid password') {
      return res.status(401).json({
        success: false,
        message: 'Noto\'g\'ri parol'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server xatosi',
      error: error.message
    });
  }
});

// Umumiy tizimga kirish (rol aniqlanmagan holda)
router.post('/login', async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;

    if (!emailOrPhone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email/telefon va parol majburiy'
      });
    }

    const result = await User.login(emailOrPhone, password);

    res.json({
      success: true,
      message: 'Muvaffaqiyatli kirdingiz',
      data: result
    });

  } catch (error) {
    console.error('Login error:', error);
    
    if (error.message === 'User not found') {
      return res.status(404).json({
        success: false,
        message: 'Foydalanuvchi topilmadi'
      });
    }
    
    if (error.message === 'Invalid password') {
      return res.status(401).json({
        success: false,
        message: 'Noto\'g\'ri parol'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server xatosi',
      error: error.message
    });
  }
});

// Profil ma'lumotlarini olish
router.get('/profile', authenticateToken, (req, res) => {
  try {
    res.json({
      success: true,
      data: req.user
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server xatosi'
    });
  }
});

// Profil yangilash
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { firstName, lastName, email, phone, address, region, district, profession, isAvailable } = req.body;
    
    const updateData = {};
    
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;
    if (region) updateData.region = region;
    if (district) updateData.district = district;
    
    // Faqat ustalar uchun
    if (req.user.role === 'specialist') {
      if (profession) updateData.profession = profession;
      if (typeof isAvailable === 'boolean') updateData.isAvailable = isAvailable;
    }

    const updatedUser = User.updateProfile(req.user.id, updateData);

    res.json({
      success: true,
      message: 'Profil muvaffaqiyatli yangilandi',
      data: updatedUser
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Server xatosi'
    });
  }
});

// Parolni o'zgartirish
router.put('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Joriy va yangi parol majburiy'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Yangi parol kamida 6 ta belgidan iborat bo\'lishi kerak'
      });
    }

    // Joriy parolni tekshirish
    await User.login(req.user.email, currentPassword);

    // Yangi parolni o'rnatish
    User.updateProfile(req.user.id, { password: newPassword });

    res.json({
      success: true,
      message: 'Parol muvaffaqiyatli o\'zgartirildi'
    });

  } catch (error) {
    console.error('Password change error:', error);
    
    if (error.message === 'Invalid password') {
      return res.status(401).json({
        success: false,
        message: 'Joriy parol noto\'g\'ri'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server xatosi'
    });
  }
});

// Akkauntni o'chirish
router.delete('/account', authenticateToken, async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Parolni tasdiqlash majburiy'
      });
    }

    // Parolni tekshirish
    await User.login(req.user.email, password);

    // Akkauntni o'chirish
    User.deleteAccount(req.user.id);

    res.json({
      success: true,
      message: 'Akkaunt muvaffaqiyatli o\'chirildi'
    });

  } catch (error) {
    console.error('Account deletion error:', error);
    
    if (error.message === 'Invalid password') {
      return res.status(401).json({
        success: false,
        message: 'Parol noto\'g\'ri'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server xatosi'
    });
  }
});

// Token ni tekshirish
router.get('/verify', authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: 'Token haqiqiy',
    data: {
      userId: req.user.id,
      role: req.user.role
    }
  });
});

// Admin login
router.post('/admin/login', async (req, res) => {
  try {
    const { firstName, lastName, password } = req.body;

    // Basic validation
    if (!firstName || !lastName || !password) {
      return res.status(400).json({
        success: false,
        message: 'Ism, familiya va parol kiritish majburiy'
      });
    }

    console.log('Admin login request:', { firstName, lastName });

    const result = await User.adminLogin(firstName, lastName, password);

    console.log('Admin login successful:', result.admin.firstName, result.admin.lastName);

    res.json({
      success: true,
      message: 'Admin muvaffaqiyatli kirildi',
      data: {
        admin: result.admin,
        token: result.token
      }
    });

  } catch (error) {
    console.error('Admin login error:', error);

    // Xatolik turini aniqlash
    const statusCode = error.message === 'Admin not found' || error.message === 'Invalid password' ? 401 : 500;
    
    res.status(statusCode).json({
      success: false,
      message: error.message === 'Admin not found' || error.message === 'Invalid password' 
        ? 'Ism, familiya yoki parol noto\'g\'ri' 
        : 'Server xatosi'
    });
  }
});

// Admin logout (agar kerak bo'lsa)
router.post('/admin/logout', (req, res) => {
  // JWT tokenlar stateless, shuning uchun logout client tomonida amalga oshiriladi
  res.json({
    success: true,
    message: 'Admin muvaffaqiyatli chiqdi'
  });
});

module.exports = router; 