const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const { authenticateToken, requireClient, requireSpecialist } = require('../middleware/auth');

// Yangi buyurtma yaratish (faqat mijozlar)
router.post('/', authenticateToken, requireClient, (req, res) => {
  try {
    const { title, description, profession, address, region, district, price, estimatedTime, urgency, images, clientNote } = req.body;

    // Majburiy maydonlarni tekshirish
    if (!title || !description || !profession || !address || !region) {
      return res.status(400).json({
        success: false,
        message: 'Majburiy maydonlarni to\'ldiring: title, description, profession, address, region'
      });
    }

    const orderData = {
      clientId: req.user.id,
      title,
      description,
      profession,
      address,
      region,
      district,
      price,
      estimatedTime,
      urgency,
      images,
      clientNote
    };

    const newOrder = Order.create(orderData);

    res.status(201).json({
      success: true,
      message: 'Buyurtma muvaffaqiyatli yaratildi',
      data: newOrder
    });

  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server xatosi'
    });
  }
});

// Barcha buyurtmalarni olish (filtrlash bilan)
router.get('/', (req, res) => {
  try {
    const { status, profession, region, page = 1, limit = 10 } = req.query;
    
    const filters = {};
    if (status) filters.status = status;
    if (profession) filters.profession = profession;
    if (region) filters.region = region;

    // Authentication header tekshirish
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    // Agar token bor bo'lsa, foydalanuvchini tekshirish
    if (token) {
      try {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        req.user = { id: decoded.userId, role: decoded.role };

        // Mijoz faqat o'zining buyurtmalarini ko'rishi mumkin
        if (req.user.role === 'client') {
          filters.clientId = req.user.id;
        }
        // Usta faqat o'zi qabul qilgan buyurtmalarni ko'rishi mumkin
        else if (req.user.role === 'specialist') {
          filters.specialistId = req.user.id;
        }
        // Admin barcha buyurtmalarni ko'rishi mumkin (filter qo'shilmaydi)
      } catch (error) {
        // Token noto'g'ri bo'lsa, barcha buyurtmalarni ko'rsatish (admin panel uchun)
        console.log('Invalid token, showing all orders for admin panel');
      }
    }
    // Token yo'q bo'lsa, barcha buyurtmalarni ko'rsatish (admin panel uchun)

    const orders = Order.findAll(filters);

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedOrders = orders.slice(startIndex, endIndex);

    // Har bir buyurtma uchun mijoz va usta ma'lumotlarini qo'shish
    const ordersWithUsers = paginatedOrders.map(order => {
      const client = User.findById(order.clientId);
      const specialist = order.specialistId ? User.findById(order.specialistId) : null;

      return {
        ...order,
        client: client ? {
          id: client.id,
          firstName: client.firstName,
          lastName: client.lastName,
          rating: client.rating
        } : null,
        specialist: specialist ? {
          id: specialist.id,
          firstName: specialist.firstName,
          lastName: specialist.lastName,
          profession: specialist.profession,
          rating: specialist.rating
        } : null
      };
    });

    res.json({
      success: true,
      data: {
        orders: ordersWithUsers,
        pagination: {
          current: parseInt(page),
          limit: parseInt(limit),
          total: orders.length,
          pages: Math.ceil(orders.length / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server xatosi'
    });
  }
});

// Pending buyurtmalarni olish (ustalar uchun)
router.get('/pending', authenticateToken, (req, res) => {
  try {
    const { profession, region, page = 1, limit = 10 } = req.query;
    
    const filters = {};
    if (profession) filters.profession = profession;
    if (region) filters.region = region;

    // Agar usta bo'lsa, faqat o'z kasbiga mos buyurtmalarni ko'rishi
    if (req.user.role === 'specialist' && req.user.profession) {
      filters.profession = req.user.profession;
    }

    const pendingOrders = Order.getPendingOrders(filters);

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedOrders = pendingOrders.slice(startIndex, endIndex);

    // Har bir buyurtma uchun mijoz ma'lumotlarini qo'shish
    const ordersWithClients = paginatedOrders.map(order => {
      const client = User.findById(order.clientId);

      return {
        ...order,
        client: client ? {
          id: client.id,
          firstName: client.firstName,
          lastName: client.lastName,
          region: client.region
        } : null
      };
    });

    res.json({
      success: true,
      data: {
        orders: ordersWithClients,
        pagination: {
          current: parseInt(page),
          limit: parseInt(limit),
          total: pendingOrders.length,
          pages: Math.ceil(pendingOrders.length / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get pending orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server xatosi'
    });
  }
});

// ID bo'yicha buyurtma olish
router.get('/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const order = Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Buyurtma topilmadi'
      });
    }

    // Faqat tegishli foydalanuvchilar ko'rishi mumkin
    if (req.user.role === 'client' && order.clientId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Bu buyurtmani ko\'rish huquqingiz yo\'q'
      });
    }

    if (req.user.role === 'specialist' && order.specialistId !== req.user.id && order.status !== 'pending') {
      return res.status(403).json({
        success: false,
        message: 'Bu buyurtmani ko\'rish huquqingiz yo\'q'
      });
    }

    // Mijoz va usta ma'lumotlarini qo'shish
    const client = User.findById(order.clientId);
    const specialist = order.specialistId ? User.findById(order.specialistId) : null;

    const orderWithUsers = {
      ...order,
      client: client ? {
        id: client.id,
        firstName: client.firstName,
        lastName: client.lastName,
        phone: req.user.id === order.specialistId || req.user.id === order.clientId ? client.phone : null,
        region: client.region,
        district: client.district
      } : null,
      specialist: specialist ? {
        id: specialist.id,
        firstName: specialist.firstName,
        lastName: specialist.lastName,
        phone: req.user.id === order.clientId || req.user.id === order.specialistId ? specialist.phone : null,
        profession: specialist.profession,
        rating: specialist.rating
      } : null
    };

    res.json({
      success: true,
      data: orderWithUsers
    });

  } catch (error) {
    console.error('Get order by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server xatosi'
    });
  }
});

// Buyurtmani qabul qilish (ustalar uchun)
router.post('/:id/accept', authenticateToken, requireSpecialist, (req, res) => {
  try {
    const { id } = req.params;
    const { specialistNote, estimatedPrice } = req.body;

    const updatedOrder = Order.acceptOrder(id, req.user.id, specialistNote, estimatedPrice);

    res.json({
      success: true,
      message: 'Buyurtma muvaffaqiyatli qabul qilindi',
      data: updatedOrder
    });

  } catch (error) {
    console.error('Accept order error:', error);
    
    if (error.message === 'Order not found') {
      return res.status(404).json({
        success: false,
        message: 'Buyurtma topilmadi'
      });
    }
    
    if (error.message === 'Order is not pending') {
      return res.status(400).json({
        success: false,
        message: 'Bu buyurtma allaqachon qabul qilingan yoki bekor qilingan'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server xatosi'
    });
  }
});

// Buyurtma holatini yangilash
router.put('/:id/status', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Holat majburiy'
      });
    }

    const validStatuses = ['in_progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Noto\'g\'ri holat. Mavjud holatlar: ' + validStatuses.join(', ')
      });
    }

    const updatedOrder = Order.updateStatus(id, status, req.user.id);

    res.json({
      success: true,
      message: 'Buyurtma holati yangilandi',
      data: updatedOrder
    });

  } catch (error) {
    console.error('Update order status error:', error);
    
    if (error.message === 'Order not found') {
      return res.status(404).json({
        success: false,
        message: 'Buyurtma topilmadi'
      });
    }
    
    if (error.message === 'Unauthorized to update this order') {
      return res.status(403).json({
        success: false,
        message: 'Bu buyurtmani yangilash huquqingiz yo\'q'
      });
    }
    
    if (error.message === 'Invalid status transition') {
      return res.status(400).json({
        success: false,
        message: 'Noto\'g\'ri holat o\'zgarishi'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server xatosi'
    });
  }
});

// Buyurtmani baholash (mijozlar uchun)
router.post('/:id/rate', authenticateToken, requireClient, (req, res) => {
  try {
    const { id } = req.params;
    const { rating, review } = req.body;

    if (!rating) {
      return res.status(400).json({
        success: false,
        message: 'Baho majburiy'
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Baho 1 dan 5 gacha bo\'lishi kerak'
      });
    }

    const updatedOrder = Order.rateOrder(id, rating, review, req.user.id);

    // Ustaning umumiy reytingini yangilash
    if (updatedOrder.specialistId) {
      const specialist = User.findById(updatedOrder.specialistId);
      if (specialist) {
        const specialistOrders = Order.getSpecialistOrders(updatedOrder.specialistId);
        const ratedOrders = specialistOrders.filter(order => order.rating !== null);
        
        if (ratedOrders.length > 0) {
          const totalRating = ratedOrders.reduce((sum, order) => sum + order.rating, 0);
          const averageRating = (totalRating / ratedOrders.length).toFixed(1);
          
          User.updateProfile(updatedOrder.specialistId, {
            rating: parseFloat(averageRating),
            reviewCount: ratedOrders.length
          });
        }
      }
    }

    res.json({
      success: true,
      message: 'Buyurtma muvaffaqiyatli baholandi',
      data: updatedOrder
    });

  } catch (error) {
    console.error('Rate order error:', error);
    
    if (error.message === 'Order not found') {
      return res.status(404).json({
        success: false,
        message: 'Buyurtma topilmadi'
      });
    }
    
    if (error.message === 'Unauthorized to rate this order') {
      return res.status(403).json({
        success: false,
        message: 'Bu buyurtmani baholash huquqingiz yo\'q'
      });
    }
    
    if (error.message === 'Order must be completed to rate') {
      return res.status(400).json({
        success: false,
        message: 'Faqat bajarilgan buyurtmalarni baholash mumkin'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server xatosi'
    });
  }
});

// Buyurtmani yangilash (faqat mijozlar, pending holatda)
router.put('/:id', authenticateToken, requireClient, (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, profession, address, region, district, price, estimatedTime, urgency, images, clientNote } = req.body;

    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (profession) updateData.profession = profession;
    if (address) updateData.address = address;
    if (region) updateData.region = region;
    if (district) updateData.district = district;
    if (price) updateData.price = price;
    if (estimatedTime) updateData.estimatedTime = estimatedTime;
    if (urgency) updateData.urgency = urgency;
    if (images) updateData.images = images;
    if (clientNote) updateData.clientNote = clientNote;

    const updatedOrder = Order.updateOrder(id, updateData, req.user.id);

    res.json({
      success: true,
      message: 'Buyurtma muvaffaqiyatli yangilandi',
      data: updatedOrder
    });

  } catch (error) {
    console.error('Update order error:', error);
    
    if (error.message === 'Order not found') {
      return res.status(404).json({
        success: false,
        message: 'Buyurtma topilmadi'
      });
    }
    
    if (error.message === 'Unauthorized to update this order or order is not pending') {
      return res.status(403).json({
        success: false,
        message: 'Bu buyurtmani yangilash huquqingiz yo\'q yoki buyurtma pending holatda emas'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server xatosi'
    });
  }
});

// Buyurtma statistikasini olish (admin uchun)
router.get('/stats/overview', (req, res) => {
  try {
    const stats = Order.getStats();

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Get order stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server xatosi'
    });
  }
});

// Ma'lum kundagi buyurtmalar (admin uchun)
router.get('/stats/by-date/:date', (req, res) => {
  try {
    const { date } = req.params;
    
    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Sana kiritish majburiy'
      });
    }

    const stats = Order.getOrdersByDate(date);

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Get orders by date error:', error);
    res.status(500).json({
      success: false,
      message: 'Server xatosi'
    });
  }
});

// Kun oralig'idagi buyurtmalar (admin uchun)
router.get('/stats/by-range', (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Boshlanish va tugash sanasi kiritish majburiy'
      });
    }

    const stats = Order.getOrdersByDateRange(startDate, endDate);

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Get orders by range error:', error);
    res.status(500).json({
      success: false,
      message: 'Server xatosi'
    });
  }
});

// Chart uchun ma'lumotlar (admin uchun)
router.get('/stats/chart', (req, res) => {
  try {
    const { days = 30 } = req.query;
    
    const chartData = Order.getChartData(parseInt(days));

    res.json({
      success: true,
      data: chartData
    });

  } catch (error) {
    console.error('Get chart data error:', error);
    res.status(500).json({
      success: false,
      message: 'Server xatosi'
    });
  }
});

// Buyurtmalarni vaqt bo'yicha o'chirish
router.delete('/history/bulk', authenticateToken, (req, res) => {
  try {
    const { period, orderIds } = req.body;
    
    let deletedCount = 0;
    let message = '';

    if (orderIds && Array.isArray(orderIds)) {
      // Tanlangan buyurtmalarni o'chirish
      orderIds.forEach(orderId => {
        try {
          Order.deleteOrder(orderId, req.user.id);
          deletedCount++;
        } catch (error) {
          console.log(`Error deleting order ${orderId}:`, error.message);
        }
      });
      message = `${deletedCount} ta tanlangan buyurtma o'chirildi`;
    } else if (period) {
      // Vaqt bo'yicha o'chirish
      const now = new Date();
      let cutoffDate;

      switch (period) {
        case '1day':
          cutoffDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          message = '1 kunlik buyurtmalar tarixi o\'chirildi';
          break;
        case '1week':
          cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          message = '1 haftalik buyurtmalar tarixi o\'chirildi';
          break;
        case '1month':
          cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          message = '1 oylik buyurtmalar tarixi o\'chirildi';
          break;
        case 'all':
          cutoffDate = new Date('1970-01-01');
          message = 'Barcha buyurtmalar tarixi o\'chirildi';
          break;
        default:
          return res.status(400).json({
            success: false,
            message: 'Noto\'g\'ri period. Mavjud qiymatlar: 1day, 1week, 1month, all'
          });
      }

      // Foydalanuvchining buyurtmalarini olish
      const filters = {};
      if (req.user.role === 'client') {
        filters.clientId = req.user.id;
      } else if (req.user.role === 'specialist') {
        filters.specialistId = req.user.id;
      }

      const userOrders = Order.findAll(filters);
      
      // Vaqt filtri bo'yicha o'chirish
      userOrders.forEach(order => {
        const orderDate = new Date(order.createdAt);
        if (orderDate <= cutoffDate) {
          try {
            Order.deleteOrder(order.id, req.user.id);
            deletedCount++;
          } catch (error) {
            console.log(`Error deleting order ${order.id}:`, error.message);
          }
        }
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Period yoki orderIds ko\'rsatilishi kerak'
      });
    }

    res.json({
      success: true,
      message,
      data: {
        deletedCount
      }
    });

  } catch (error) {
    console.error('Bulk delete orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server xatosi'
    });
  }
});

// Bitta buyurtmani o'chirish
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;

    Order.deleteOrder(id, req.user.id);

    res.json({
      success: true,
      message: 'Buyurtma muvaffaqiyatli o\'chirildi'
    });

  } catch (error) {
    console.error('Delete order error:', error);
    
    if (error.message === 'Order not found') {
      return res.status(404).json({
        success: false,
        message: 'Buyurtma topilmadi'
      });
    }
    
    if (error.message === 'Unauthorized to delete this order') {
      return res.status(403).json({
        success: false,
        message: 'Bu buyurtmani o\'chirish huquqingiz yo\'q'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server xatosi'
    });
  }
});

module.exports = router; 