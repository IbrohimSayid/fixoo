const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const User = require('../models/User');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Uploads papkasini yaratish
const uploadsDir = path.join(__dirname, '../uploads/avatars');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer konfiguratsiyasi
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Faqat rasm fayllari qabul qilinadi!'));
    }
  }
});



// Barcha foydalanuvchilarni olish (public) - adminlarni exclude qilib
router.get('/', optionalAuth, (req, res) => {
  try {
    const { role, region, profession, page = 1, limit = 10, showPasswords } = req.query;
    
    const filters = {};
    if (role) filters.role = role;
    if (region) filters.region = region;
    if (profession) filters.profession = profession;

    const users = User.findAll(filters);

    // Adminlarni ro'yxatdan chiqarish - faqat specialist va client rolelarni ko'rsatish
    const nonAdminUsers = users.filter(user => user.role !== 'admin');

    // Agar admin bo'lsa va showPasswords=true bo'lsa, parollarni ko'rsatish
    const processedUsers = nonAdminUsers.map(user => {
      if (showPasswords === 'true') {
        // Admin uchun parollarni ochish (hashed holatda)
        return { ...user, password: User.getPasswordHash(user.id) };
      }
      return user;
    });

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedUsers = processedUsers.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: {
        users: paginatedUsers,
        pagination: {
          current: parseInt(page),
          limit: parseInt(limit),
          total: processedUsers.length,
          pages: Math.ceil(processedUsers.length / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server xatosi'
    });
  }
});

// Ustalarni olish
router.get('/specialists', optionalAuth, (req, res) => {
  try {
    const { region, profession, page = 1, limit = 10 } = req.query;
    
    const filters = {};
    if (region) filters.region = region;
    if (profession) filters.profession = profession;

    const specialists = User.getSpecialists(filters);

    // Faqat mavjud ustalarni ko'rsatish
    const availableSpecialists = specialists.filter(specialist => 
      specialist.isAvailable !== false
    );

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedSpecialists = availableSpecialists.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: {
        specialists: paginatedSpecialists,
        pagination: {
          current: parseInt(page),
          limit: parseInt(limit),
          total: availableSpecialists.length,
          pages: Math.ceil(availableSpecialists.length / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get specialists error:', error);
    res.status(500).json({
      success: false,
      message: 'Server xatosi'
    });
  }
});

// Mijozlarni olish (faqat admin yoki ustalar ko'rishi mumkin)
router.get('/clients', authenticateToken, (req, res) => {
  try {
    if (req.user.role === 'client') {
      return res.status(403).json({
        success: false,
        message: 'Bu ma\'lumotlarni ko\'rish huquqingiz yo\'q'
      });
    }

    const { region, page = 1, limit = 10 } = req.query;
    
    const filters = {};
    if (region) filters.region = region;

    const clients = User.getClients(filters);

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedClients = clients.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: {
        clients: paginatedClients,
        pagination: {
          current: parseInt(page),
          limit: parseInt(limit),
          total: clients.length,
          pages: Math.ceil(clients.length / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get clients error:', error);
    res.status(500).json({
      success: false,
      message: 'Server xatosi'
    });
  }
});

// Adminlarni olish
router.get('/admins', (req, res) => {
  try {
    console.log('Adminlarni olish so\'rovi keldi');
    const admins = User.getAdmins();
    console.log('Topilgan adminlar:', admins);

    res.json({
      success: true,
      data: {
        admins: admins
      }
    });

  } catch (error) {
    console.error('Get admins error:', error);
    res.status(500).json({
      success: false,
      message: 'Server xatosi'
    });
  }
});

// ID bo'yicha foydalanuvchi ma'lumotlarini olish
router.get('/:id', optionalAuth, (req, res) => {
  try {
    const { id } = req.params;
    
    // Agar id "admins" bo'lsa, uni skip qilish
    if (id === 'admins') {
      return res.status(404).json({
        success: false,
        message: 'Invalid user ID'
      });
    }
    
    const user = User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Foydalanuvchi topilmadi'
      });
    }

    // Agar o'zining profili bo'lmasa, ba'zi ma'lumotlarni yashirish
    const publicUser = { ...user };
    if (!req.user || req.user.id !== id) {
      delete publicUser.email;
      delete publicUser.phone;
      delete publicUser.address;
    }

    res.json({
      success: true,
      data: publicUser
    });

  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server xatosi'
    });
  }
});

// Kasb bo'yicha ustalarni filtrlash
router.get('/specialists/by-profession/:profession', optionalAuth, (req, res) => {
  try {
    const { profession } = req.params;
    const { region, page = 1, limit = 10 } = req.query;

    const filters = { profession };
    if (region) filters.region = region;

    const specialists = User.getSpecialists(filters);

    // Faqat mavjud ustalarni ko'rsatish
    const availableSpecialists = specialists.filter(specialist => 
      specialist.isAvailable !== false
    );

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedSpecialists = availableSpecialists.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: {
        specialists: paginatedSpecialists,
        profession,
        pagination: {
          current: parseInt(page),
          limit: parseInt(limit),
          total: availableSpecialists.length,
          pages: Math.ceil(availableSpecialists.length / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get specialists by profession error:', error);
    res.status(500).json({
      success: false,
      message: 'Server xatosi'
    });
  }
});

// Mintaqa bo'yicha foydalanuvchilarni filtrlash
router.get('/by-region/:region', optionalAuth, (req, res) => {
  try {
    const { region } = req.params;
    const { role, profession, page = 1, limit = 10 } = req.query;

    const filters = { region };
    if (role) filters.role = role;
    if (profession) filters.profession = profession;

    const users = User.findAll(filters);

    // Agar ustalar so'ralsa, faqat mavjudlarini ko'rsatish
    const filteredUsers = role === 'specialist' 
      ? users.filter(user => user.isAvailable !== false)
      : users;

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: {
        users: paginatedUsers,
        region,
        filters: { role, profession },
        pagination: {
          current: parseInt(page),
          limit: parseInt(limit),
          total: filteredUsers.length,
          pages: Math.ceil(filteredUsers.length / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get users by region error:', error);
    res.status(500).json({
      success: false,
      message: 'Server xatosi'
    });
  }
});

// Ustaning mavjudligini o'zgartirish (faqat usta o'zi)
router.put('/:id/availability', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const { isAvailable } = req.body;

    // Faqat o'zining holatini o'zgartirishi mumkin
    if (req.user.id !== id) {
      return res.status(403).json({
        success: false,
        message: 'Faqat o\'zingizning holatni o\'zgartirishingiz mumkin'
      });
    }

    // Faqat ustalar uchun
    if (req.user.role !== 'specialist') {
      return res.status(403).json({
        success: false,
        message: 'Bu funksiya faqat ustalar uchun'
      });
    }

    if (typeof isAvailable !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'isAvailable boolean qiymat bo\'lishi kerak'
      });
    }

    const updatedUser = User.updateProfile(id, { isAvailable });

    res.json({
      success: true,
      message: 'Mavjudlik holati yangilandi',
      data: updatedUser
    });

  } catch (error) {
    console.error('Update availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Server xatosi'
    });
  }
});

// Foydalanuvchi statistikasini olish (admin uchun)
router.get('/stats/overview', (req, res) => {
  try {
    // Hozircha admin tekshiruvini olib tashlash (keyinroq qo'shamiz)
    const stats = User.getStats();

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server xatosi'
    });
  }
});

// Yangi admin yaratish
router.post('/admins', (req, res) => {
  try {
    const { firstName, lastName, email, phone, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Ism, familiya, email va parol majburiy'
      });
    }

    // Hozircha super admin tekshiruvini olib tashlash
    const creatorId = 'super-admin'; // Temporary

    const newAdmin = User.createAdmin({
      firstName,
      lastName,
      email,
      phone,
      password
    }, creatorId);

    res.status(201).json({
      success: true,
      message: 'Admin muvaffaqiyatli yaratildi',
      data: newAdmin
    });

  } catch (error) {
    console.error('Create admin error:', error);
    
    if (error.message === 'Admin with this email already exists') {
      return res.status(409).json({
        success: false,
        message: 'Bu email bilan admin allaqachon mavjud'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server xatosi'
    });
  }
});

// Admin o'chirish
router.delete('/admins/:id', (req, res) => {
  try {
    const { id } = req.params;

    // Hozircha super admin tekshiruvini olib tashlash
    const deleterId = 'super-admin'; // Temporary

    User.deleteAdmin(id, deleterId);

    res.json({
      success: true,
      message: 'Admin muvaffaqiyatli o\'chirildi'
    });

  } catch (error) {
    console.error('Delete admin error:', error);
    
    if (error.message === 'Admin not found') {
      return res.status(404).json({
        success: false,
        message: 'Admin topilmadi'
      });
    }
    
    if (error.message === 'Cannot delete super admin') {
      return res.status(403).json({
        success: false,
        message: 'Super adminni o\'chirib bo\'lmaydi'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server xatosi'
    });
  }
});

// Admin ma'lumotlarini yangilash
router.put('/admins/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, phone, currentPassword, newPassword } = req.body;

    console.log('Admin update request:', { id, firstName, lastName, email, phone });

    if (!firstName || !lastName || !email) {
      return res.status(400).json({
        success: false,
        message: 'Ism, familiya va email majburiy'
      });
    }

    // Admin mavjudligini tekshirish
    const admin = User.findById(id, true); // includePassword=true for password verification
    if (!admin || admin.role !== 'admin') {
      return res.status(404).json({
        success: false,
        message: 'Admin topilmadi'
      });
    }

    // Yangilash ma'lumotlari
    const updateData = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: phone?.trim() || null
    };

    // Agar parol o'zgartirilayotgan bo'lsa
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({
          success: false,
          message: 'Joriy parolni kiriting'
        });
      }

      // Joriy parolni tekshirish
      const bcrypt = require('bcrypt');
      const isValidPassword = bcrypt.compareSync(currentPassword, admin.password);
      
      if (!isValidPassword) {
        return res.status(400).json({
          success: false,
          message: 'Joriy parol noto\'g\'ri'
        });
      }

      // Yangi parolni hash qilish
      updateData.password = bcrypt.hashSync(newPassword, 10);
    }

    // Admin ma'lumotlarini yangilash
    const updatedAdmin = User.updateProfile(id, updateData);

    res.json({
      success: true,
      message: 'Admin ma\'lumotlari muvaffaqiyatli yangilandi',
      data: updatedAdmin
    });

  } catch (error) {
    console.error('Update admin error:', error);
    
    if (error.message === 'User not found') {
      return res.status(404).json({
        success: false,
        message: 'Admin topilmadi'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server xatosi'
    });
  }
});

// Super admin yaratish
router.post('/create-super-admin', (req, res) => {
  try {
    const superAdmin = User.createSuperAdmin();

    res.status(201).json({
      success: true,
      message: 'Super admin yaratildi',
      data: superAdmin
    });

  } catch (error) {
    console.error('Create super admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Server xatosi'
    });
  }
});

// Ustalarni qidirish (mijozlar uchun)
router.post('/specialists/search', optionalAuth, (req, res) => {
  try {
    const { profession, region, district, firstName, lastName } = req.body;

    // Majburiy parametrlarni tekshirish
    if (!profession || !region || !district) {
      return res.status(400).json({
        success: false,
        message: 'Kasb, viloyat va tuman kiritish majburiy',
        required: ['profession', 'region', 'district']
      });
    }

    console.log('Specialist search request:', { profession, region, district, firstName, lastName });

    // Asosiy filtrlar
    const filters = { 
      role: 'specialist',
      profession,
      region,
      district 
    };

    const specialists = User.findAll(filters);
    console.log(`Found ${specialists.length} specialists with basic filters`);

    // Faqat faol ustalarni ko'rsatish
    let availableSpecialists = specialists.filter(specialist => 
      specialist.isAvailable !== false && specialist.isActive === true
    );

    // Agar authenticated user usta bo'lsa, o'zini exclude qilish
    if (req.user && req.user.role === 'specialist') {
      availableSpecialists = availableSpecialists.filter(specialist => 
        specialist.id !== req.user.id
      );
      console.log(`Excluded self (${req.user.id}) from results`);
    }

    console.log(`Found ${availableSpecialists.length} available specialists`);

    // Ism-familiya bo'yicha qidirish (ixtiyoriy)
    if (firstName || lastName) {
      const searchName = `${firstName || ''} ${lastName || ''}`.trim().toLowerCase();
      if (searchName) {
        availableSpecialists = availableSpecialists.filter(specialist => {
          const fullName = `${specialist.firstName} ${specialist.lastName}`.toLowerCase();
          return fullName.includes(searchName);
        });
        console.log(`After name filter: ${availableSpecialists.length} specialists`);
      }
    }

    res.json({
      success: true,
      message: `${availableSpecialists.length} ta usta topildi`,
      data: {
        specialists: availableSpecialists,
        filters: {
          profession,
          region,
          district,
          firstName: firstName || null,
          lastName: lastName || null
        },
        total: availableSpecialists.length
      }
    });

  } catch (error) {
    console.error('Search specialists error:', error);
    res.status(500).json({
      success: false,
      message: 'Server xatosi'
    });
  }
});

// Avatar yuklash
router.post('/upload-avatar', authenticateToken, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Fayl tanlanmagan'
      });
    }

    const userId = req.user.userId;
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;

    // Eski avatar'ni o'chirish
    const user = User.findById(userId);
    if (user && user.avatar) {
      const oldAvatarPath = path.join(__dirname, '..', user.avatar);
      if (fs.existsSync(oldAvatarPath)) {
        fs.unlinkSync(oldAvatarPath);
      }
    }

    // User profile'da avatar'ni yangilash
    const updatedUser = User.updateProfile(userId, { avatar: avatarUrl });

    res.json({
      success: true,
      message: 'Avatar muvaffaqiyatli yuklandi',
      data: {
        avatar: avatarUrl,
        user: updatedUser
      }
    });

  } catch (error) {
    console.error('Avatar upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Server xatosi'
    });
  }
});

// Avatar o'chirish
router.delete('/remove-avatar', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Eski avatar'ni o'chirish
    const user = User.findById(userId);
    if (user && user.avatar) {
      const oldAvatarPath = path.join(__dirname, '..', user.avatar);
      if (fs.existsSync(oldAvatarPath)) {
        fs.unlinkSync(oldAvatarPath);
      }
    }

    // User profile'dan avatar'ni olib tashlash
    const updatedUser = User.updateProfile(userId, { avatar: null });

    res.json({
      success: true,
      message: 'Avatar muvaffaqiyatli o\'chirildi',
      data: {
        user: updatedUser
      }
    });

  } catch (error) {
    console.error('Avatar remove error:', error);
    res.status(500).json({
      success: false,
      message: 'Server xatosi'
    });
  }
});

// Foydalanuvchini bloklash/ochish (admin uchun)
router.put('/:id/block', (req, res) => {
  try {
    const { id } = req.params;
    const { isBlocked } = req.body;

    if (typeof isBlocked !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'isBlocked boolean qiymat bo\'lishi kerak'
      });
    }

    const updatedUser = User.blockUser(id, isBlocked);

    res.json({
      success: true,
      message: `Foydalanuvchi ${isBlocked ? 'bloklandi' : 'blokdan chiqarildi'}`,
      data: updatedUser
    });

  } catch (error) {
    console.error('Block user error:', error);
    
    if (error.message === 'User not found') {
      return res.status(404).json({
        success: false,
        message: 'Foydalanuvchi topilmadi'
      });
    }
    
    if (error.message === 'Cannot block admin users') {
      return res.status(403).json({
        success: false,
        message: 'Admin foydalanuvchilarni bloklash mumkin emas'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server xatosi'
    });
  }
});

// Foydalanuvchini o'chirish (admin uchun)
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;

    User.deleteUser(id);

    res.json({
      success: true,
      message: 'Foydalanuvchi muvaffaqiyatli o\'chirildi'
    });

  } catch (error) {
    console.error('Delete user error:', error);
    
    if (error.message === 'User not found') {
      return res.status(404).json({
        success: false,
        message: 'Foydalanuvchi topilmadi'
      });
    }
    
    if (error.message === 'Cannot delete admin users') {
      return res.status(403).json({
        success: false,
        message: 'Admin foydalanuvchilarni o\'chirish mumkin emas'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server xatosi'
    });
  }
});

module.exports = router; 