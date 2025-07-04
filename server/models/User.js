const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Data file path
const DATA_FILE = path.join(__dirname, '../data/users.json');

// Ma'lumotlar papkasini yaratish
const DATA_DIR = path.dirname(DATA_FILE);
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

class User {
  constructor() {
    this.users = this.loadUsers();
  }

  // JSON fayldan foydalanuvchilarni yuklash
  loadUsers() {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data) || [];
      }
      return [];
    } catch (error) {
      console.error('Error loading users:', error);
      return [];
    }
  }

  // Faylga foydalanuvchilarni saqlash
  saveUsers() {
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(this.users, null, 2));
    } catch (error) {
      console.error('Error saving users:', error);
      throw error;
    }
  }

  // ID generatsiya qilish
  generateId() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  // Yangi foydalanuvchi yaratish
  async create(userData) {
    try {
      // Email yoki telefon mavjudligini tekshirish
      const existingUser = this.users.find(
        user => (userData.email && user.email === userData.email) || user.phone === userData.phone
      );
      
      if (existingUser) {
        throw new Error('User with this email or phone already exists');
      }

      // Parolni hash qilish
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      const newUser = {
        id: this.generateId(),
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phone: userData.phone,
        password: hashedPassword,
        role: userData.role || 'client', // 'specialist' yoki 'client'
        profession: userData.profession || null,
        address: userData.address || null,
        region: userData.region || null,
        district: userData.district || null,
        isAvailable: userData.role === 'specialist' ? true : null,
        rating: userData.role === 'specialist' ? 0 : null,
        reviewCount: userData.role === 'specialist' ? 0 : null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true
      };

      this.users.push(newUser);
      this.saveUsers();

      // Parolni qaytarmaslik
      const { password, ...userWithoutPassword } = newUser;
      return userWithoutPassword;
    } catch (error) {
      throw error;
    }
  }

  // Login
  async login(emailOrPhone, password) {
    try {
      console.log('Login attempt for:', emailOrPhone);
      
      const user = this.users.find(
        u => ((u.email && u.email === emailOrPhone) || u.phone === emailOrPhone) && u.isActive
      );

      if (!user) {
        console.log('User not found');
        throw new Error('User not found');
      }

      console.log('User found:', user.firstName, user.lastName, 'Role:', user.role);
      console.log('Stored password hash:', user.password);
      console.log('Provided password:', password);

      const isValidPassword = await bcrypt.compare(password, user.password);
      console.log('Password validation result:', isValidPassword);
      
      if (!isValidPassword) {
        throw new Error('Invalid password');
      }

      // JWT token yaratish
      const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      const { password: pwd, ...userWithoutPassword } = user;
      return { user: userWithoutPassword, token };
    } catch (error) {
      console.error('Login error in User model:', error);
      throw error;
    }
  }

  // ID bo'yicha foydalanuvchi topish
  findById(id, includePassword = false) {
    const user = this.users.find(u => u.id === id && u.isActive);
    if (user) {
      if (includePassword) {
        return user;
      }
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return null;
  }

  // Barcha foydalanuvchilarni olish
  findAll(filters = {}) {
    let filteredUsers = this.users.filter(u => u.isActive);

    if (filters.role) {
      filteredUsers = filteredUsers.filter(u => u.role === filters.role);
    }

    if (filters.region) {
      filteredUsers = filteredUsers.filter(u => u.region === filters.region);
    }

    if (filters.profession) {
      filteredUsers = filteredUsers.filter(u => u.profession === filters.profession);
    }

    return filteredUsers.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }

  // Ustalarni olish
  getSpecialists(filters = {}) {
    return this.findAll({ ...filters, role: 'specialist' });
  }

  // Mijozlarni olish
  getClients(filters = {}) {
    return this.findAll({ ...filters, role: 'client' });
  }

  // Profil yangilash
  updateProfile(id, updateData) {
    const userIndex = this.users.findIndex(u => u.id === id && u.isActive);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    // Parolni yangilash (agar berilgan bo'lsa)
    if (updateData.password) {
      updateData.password = bcrypt.hashSync(updateData.password, 10);
    }

    this.users[userIndex] = {
      ...this.users[userIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    this.saveUsers();

    const { password, ...userWithoutPassword } = this.users[userIndex];
    return userWithoutPassword;
  }

  // Akkauntni o'chirish (soft delete)
  deleteAccount(id) {
    const userIndex = this.users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    this.users[userIndex].isActive = false;
    this.users[userIndex].deletedAt = new Date().toISOString();
    this.saveUsers();

    return true;
  }

  // Statistika olish
  getStats() {
    const today = new Date().toISOString().split('T')[0];
    
    const totalUsers = this.users.filter(u => u.isActive).length;
    const totalSpecialists = this.users.filter(u => u.isActive && u.role === 'specialist').length;
    const totalClients = this.users.filter(u => u.isActive && u.role === 'client').length;
    
    const todayRegistered = this.users.filter(u => 
      u.createdAt.split('T')[0] === today
    ).length;
    
    const todayDeleted = this.users.filter(u => 
      u.deletedAt && u.deletedAt.split('T')[0] === today
    ).length;

    return {
      totalUsers,
      totalSpecialists,
      totalClients,
      todayRegistered,
      todayDeleted
    };
  }

  // Admin uchun parol hash'ini olish
  getPasswordHash(userId) {
    const user = this.users.find(u => u.id === userId);
    return user ? user.password : null;
  }



  // Admin login (maxsus funksiya)
  async adminLogin(firstName, lastName, password) {
    try {
      console.log('Admin login attempt for:', firstName, lastName);
      
      const admin = this.users.find(
        u => u.firstName === firstName && u.lastName === lastName && u.role === 'admin' && u.isActive
      );

      if (!admin) {
        console.log('Admin not found');
        throw new Error('Admin not found');
      }

      console.log('Admin found:', admin.firstName, admin.lastName);

      const isValidPassword = await bcrypt.compare(password, admin.password);
      console.log('Password validation result:', isValidPassword);
      
      if (!isValidPassword) {
        throw new Error('Invalid password');
      }

      // JWT token yaratish
      const token = jwt.sign(
        { userId: admin.id, role: admin.role, isSuperAdmin: admin.isSuperAdmin },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      const { password: pwd, ...adminWithoutPassword } = admin;
      return { admin: adminWithoutPassword, token };
    } catch (error) {
      console.error('Admin login error:', error);
      throw error;
    }
  }

  // Adminlarni olish
  getAdmins() {
    return this.users
      .filter(u => u.role === 'admin' && u.isActive)
      .map(admin => {
        const { password, ...adminWithoutPassword } = admin;
        return adminWithoutPassword;
      });
  }

  // Yangi admin yaratish (faqat super admin)
  async createAdmin(adminData, creatorId = null) {
    try {
      // Agar creatorId berilgan bo'lsa va "super-admin" bo'lmasa, tekshirish
      if (creatorId && creatorId !== 'super-admin') {
        const creator = this.users.find(u => u.id === creatorId && u.role === 'admin' && u.isSuperAdmin);
        if (!creator) {
          throw new Error('Only super admin can create new admins');
        }
      }

      // Email mavjudligini tekshirish
      const existingAdmin = this.users.find(u => u.email === adminData.email);
      if (existingAdmin) {
        throw new Error('Admin with this email already exists');
      }

      // Parolni hash qilish
      const hashedPassword = await bcrypt.hash(adminData.password, 10);

      const newAdmin = {
        id: this.generateId(),
        firstName: adminData.firstName,
        lastName: adminData.lastName,
        email: adminData.email,
        phone: adminData.phone || null,
        password: hashedPassword,
        role: 'admin',
        isSuperAdmin: false, // Yangi adminlar doim oddiy admin
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true
      };

      this.users.push(newAdmin);
      this.saveUsers();

      const { password, ...adminWithoutPassword } = newAdmin;
      return adminWithoutPassword;
    } catch (error) {
      throw error;
    }
  }

  // Admin o'chirish (faqat super admin)
  deleteAdmin(adminId, deleterId) {
    try {
      // Deleter super admin ekanligini tekshirish
      const deleter = this.users.find(u => u.id === deleterId && u.role === 'admin' && u.isSuperAdmin);
      if (!deleter) {
        throw new Error('Only super admin can delete admins');
      }

      // O'chiriladigan adminni topish
      const adminIndex = this.users.findIndex(u => u.id === adminId && u.role === 'admin');
      if (adminIndex === -1) {
        throw new Error('Admin not found');
      }

      // Super adminni o'chirib bo'lmaydi
      if (this.users[adminIndex].isSuperAdmin) {
        throw new Error('Cannot delete super admin');
      }

      this.users[adminIndex].isActive = false;
      this.users[adminIndex].deletedAt = new Date().toISOString();
      this.saveUsers();

      return true;
    } catch (error) {
      throw error;
    }
  }

  // Super admin yaratish (faqat birinchi marta)
  async createSuperAdmin() {
    try {
      // Super admin mavjudligini tekshirish
      const existingSuperAdmin = this.users.find(u => u.role === 'admin' && u.isSuperAdmin && u.isActive);
      if (existingSuperAdmin) {
        console.log('Super admin already exists');
        return existingSuperAdmin;
      }

      // Parolni hash qilish
      const hashedPassword = await bcrypt.hash('sofiya_7', 10);

      const superAdmin = {
        id: this.generateId(),
        firstName: 'Ibrohim',
        lastName: 'Zabixullayev',
        email: 'admin@fixoo.uz',
        phone: '+998901234567',
        password: hashedPassword,
        role: 'admin',
        isSuperAdmin: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true
      };

      this.users.push(superAdmin);
      this.saveUsers();

      console.log('Super admin created successfully');
      const { password, ...adminWithoutPassword } = superAdmin;
      return adminWithoutPassword;
    } catch (error) {
      console.error('Error creating super admin:', error);
      throw error;
    }
  }

  // Foydalanuvchini bloklash/ochish (admin uchun)
  blockUser(userId, isBlocked) {
    try {
      const userIndex = this.users.findIndex(u => u.id === userId);
      if (userIndex === -1) {
        throw new Error('User not found');
      }

      // Adminlarni bloklash mumkin emas
      if (this.users[userIndex].role === 'admin') {
        throw new Error('Cannot block admin users');
      }

      this.users[userIndex].isActive = !isBlocked;
      this.users[userIndex].updatedAt = new Date().toISOString();
      
      if (isBlocked) {
        this.users[userIndex].blockedAt = new Date().toISOString();
      } else {
        delete this.users[userIndex].blockedAt;
      }

      this.saveUsers();

      const { password, ...userWithoutPassword } = this.users[userIndex];
      return userWithoutPassword;
    } catch (error) {
      throw error;
    }
  }

  // Foydalanuvchini butunlay o'chirish (admin uchun)
  deleteUser(userId) {
    try {
      const userIndex = this.users.findIndex(u => u.id === userId);
      if (userIndex === -1) {
        throw new Error('User not found');
      }

      // Adminlarni o'chirish mumkin emas
      if (this.users[userIndex].role === 'admin') {
        throw new Error('Cannot delete admin users');
      }

      // Foydalanuvchini massivdan olib tashlash
      this.users.splice(userIndex, 1);
      this.saveUsers();

      return true;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new User(); 