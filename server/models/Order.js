const fs = require('fs');
const path = require('path');

// Data file path
const DATA_FILE = path.join(__dirname, '../data/orders.json');

// Ma'lumotlar papkasini yaratish
const DATA_DIR = path.dirname(DATA_FILE);
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

class Order {
  constructor() {
    this.orders = this.loadOrders();
  }

  // Fayldan buyurtmalarni yuklash
  loadOrders() {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data) || [];
      }
      return [];
    } catch (error) {
      console.error('Error loading orders:', error);
      return [];
    }
  }

  // Faylga buyurtmalarni saqlash
  saveOrders() {
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(this.orders, null, 2));
    } catch (error) {
      console.error('Error saving orders:', error);
      throw error;
    }
  }

  // ID generatsiya qilish
  generateId() {
    return 'ORD-' + Date.now().toString() + Math.random().toString(36).substr(2, 6).toUpperCase();
  }

  // Yangi buyurtma yaratish
  create(orderData) {
    try {
      const newOrder = {
        id: this.generateId(),
        clientId: orderData.clientId,
        specialistId: orderData.specialistId || null,
        title: orderData.title,
        description: orderData.description,
        profession: orderData.profession,
        address: orderData.address,
        region: orderData.region,
        district: orderData.district,
        price: orderData.price || null,
        estimatedTime: orderData.estimatedTime || null,
        urgency: orderData.urgency || 'normal', // 'urgent', 'normal', 'flexible'
        status: 'pending', // 'pending', 'accepted', 'in_progress', 'completed', 'cancelled'
        images: orderData.images || [],
        clientNote: orderData.clientNote || null,
        specialistNote: orderData.specialistNote || null,
        rating: null,
        review: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        acceptedAt: null,
        completedAt: null
      };

      this.orders.push(newOrder);
      this.saveOrders();

      return newOrder;
    } catch (error) {
      throw error;
    }
  }

  // ID bo'yicha buyurtma topish
  findById(id) {
    return this.orders.find(order => order.id === id);
  }

  // Barcha buyurtmalarni olish
  findAll(filters = {}) {
    let filteredOrders = [...this.orders];

    if (filters.clientId) {
      filteredOrders = filteredOrders.filter(order => order.clientId === filters.clientId);
    }

    if (filters.specialistId) {
      filteredOrders = filteredOrders.filter(order => order.specialistId === filters.specialistId);
    }

    if (filters.status) {
      filteredOrders = filteredOrders.filter(order => order.status === filters.status);
    }

    if (filters.profession) {
      filteredOrders = filteredOrders.filter(order => order.profession === filters.profession);
    }

    if (filters.region) {
      filteredOrders = filteredOrders.filter(order => order.region === filters.region);
    }

    // Sanasiga qarab tartibga solish (yangilari yuqorida)
    return filteredOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  // Pending buyurtmalarni olish (ustalar uchun)
  getPendingOrders(filters = {}) {
    return this.findAll({ ...filters, status: 'pending' });
  }

  // Mijozning buyurtmalarini olish
  getClientOrders(clientId) {
    return this.findAll({ clientId });
  }

  // Ustaning buyurtmalarini olish
  getSpecialistOrders(specialistId) {
    return this.findAll({ specialistId });
  }

  // Buyurtmani qabul qilish (usta tomonidan)
  acceptOrder(orderId, specialistId, specialistNote = null, estimatedPrice = null) {
    const orderIndex = this.orders.findIndex(order => order.id === orderId);
    if (orderIndex === -1) {
      throw new Error('Order not found');
    }

    if (this.orders[orderIndex].status !== 'pending') {
      throw new Error('Order is not pending');
    }

    this.orders[orderIndex] = {
      ...this.orders[orderIndex],
      specialistId,
      specialistNote,
      price: estimatedPrice || this.orders[orderIndex].price,
      status: 'accepted',
      acceptedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.saveOrders();
    return this.orders[orderIndex];
  }

  // Buyurtma holatini yangilash
  updateStatus(orderId, status, userId) {
    const orderIndex = this.orders.findIndex(order => order.id === orderId);
    if (orderIndex === -1) {
      throw new Error('Order not found');
    }

    const order = this.orders[orderIndex];

    // Faqat tegishli foydalanuvchi holatni o'zgartirishi mumkin
    if (order.clientId !== userId && order.specialistId !== userId) {
      throw new Error('Unauthorized to update this order');
    }

    const updateData = {
      status,
      updatedAt: new Date().toISOString()
    };

    if (status === 'in_progress' && order.status === 'accepted') {
      // Ish boshlanishi
    } else if (status === 'completed' && order.status === 'in_progress') {
      updateData.completedAt = new Date().toISOString();
    } else if (status === 'cancelled') {
      // Bekor qilish
    } else {
      throw new Error('Invalid status transition');
    }

    this.orders[orderIndex] = {
      ...order,
      ...updateData
    };

    this.saveOrders();
    return this.orders[orderIndex];
  }

  // Buyurtmani baholash
  rateOrder(orderId, rating, review, clientId) {
    const orderIndex = this.orders.findIndex(order => order.id === orderId);
    if (orderIndex === -1) {
      throw new Error('Order not found');
    }

    const order = this.orders[orderIndex];

    if (order.clientId !== clientId) {
      throw new Error('Unauthorized to rate this order');
    }

    if (order.status !== 'completed') {
      throw new Error('Order must be completed to rate');
    }

    this.orders[orderIndex] = {
      ...order,
      rating: parseInt(rating),
      review,
      updatedAt: new Date().toISOString()
    };

    this.saveOrders();
    return this.orders[orderIndex];
  }

  // Buyurtma ma'lumotlarini yangilash
  updateOrder(orderId, updateData, userId) {
    const orderIndex = this.orders.findIndex(order => order.id === orderId);
    if (orderIndex === -1) {
      throw new Error('Order not found');
    }

    const order = this.orders[orderIndex];

    // Faqat mijoz pending holatdagi buyurtmasini yangilashi mumkin
    if (order.clientId !== userId || order.status !== 'pending') {
      throw new Error('Unauthorized to update this order or order is not pending');
    }

    this.orders[orderIndex] = {
      ...order,
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    this.saveOrders();
    return this.orders[orderIndex];
  }

  // Statistika olish
  getStats() {
    const today = new Date().toISOString().split('T')[0];
    
    const totalOrders = this.orders.length;
    const pendingOrders = this.orders.filter(order => order.status === 'pending').length;
    const acceptedOrders = this.orders.filter(order => order.status === 'accepted').length;
    const inProgressOrders = this.orders.filter(order => order.status === 'in_progress').length;
    const completedOrders = this.orders.filter(order => order.status === 'completed').length;
    const cancelledOrders = this.orders.filter(order => order.status === 'cancelled').length;
    
    const todayOrders = this.orders.filter(order => 
      order.createdAt.split('T')[0] === today
    ).length;
    
    const todayAccepted = this.orders.filter(order => 
      order.acceptedAt && order.acceptedAt.split('T')[0] === today
    ).length;

    const todayCompleted = this.orders.filter(order => 
      order.completedAt && order.completedAt.split('T')[0] === today
    ).length;

    return {
      totalOrders,
      pendingOrders,
      acceptedOrders,
      inProgressOrders,
      completedOrders,
      cancelledOrders,
      todayOrders,
      todayAccepted,
      todayCompleted
    };
  }

  // Haftalik statistika
  getWeeklyStats() {
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const weeklyOrders = this.orders.filter(order => 
      new Date(order.createdAt) >= weekAgo
    );

    const dailyStats = {};
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      
      dailyStats[dateStr] = {
        orders: weeklyOrders.filter(order => order.createdAt.split('T')[0] === dateStr).length,
        completed: weeklyOrders.filter(order => 
          order.completedAt && order.completedAt.split('T')[0] === dateStr
        ).length
      };
    }

    return dailyStats;
  }

  // Buyurtmani o'chirish
  deleteOrder(orderId, userId) {
    const orderIndex = this.orders.findIndex(order => order.id === orderId);
    if (orderIndex === -1) {
      throw new Error('Order not found');
    }

    const order = this.orders[orderIndex];

    // Faqat mijoz o'zining buyurtmasini o'chirishi mumkin yoki usta o'zi qabul qilgan buyurtmani
    if (order.clientId !== userId && order.specialistId !== userId) {
      throw new Error('Unauthorized to delete this order');
    }

    this.orders.splice(orderIndex, 1);
    this.saveOrders();
    
    return { message: 'Order deleted successfully' };
  }



  // Ma'lum kundagi buyurtmalar statistikasi
  getOrdersByDate(date) {
    const targetDate = new Date(date).toISOString().split('T')[0];
    
    const dayOrders = this.orders.filter(order => 
      order.createdAt.split('T')[0] === targetDate
    );

    return {
      date: targetDate,
      totalOrders: dayOrders.length,
      pending: dayOrders.filter(order => order.status === 'pending').length,
      accepted: dayOrders.filter(order => order.status === 'accepted').length,
      inProgress: dayOrders.filter(order => order.status === 'in_progress').length,
      completed: dayOrders.filter(order => order.status === 'completed').length,
      cancelled: dayOrders.filter(order => order.status === 'cancelled').length,
      orders: dayOrders
    };
  }

  // Kun oralig'idagi buyurtmalar statistikasi
  getOrdersByDateRange(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Kun boshidan kun oxirigacha
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    const rangeOrders = this.orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= start && orderDate <= end;
    });

    // Kunlik statistika
    const dailyStats = {};
    const currentDate = new Date(start);
    
    while (currentDate <= end) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const dayOrders = rangeOrders.filter(order => 
        order.createdAt.split('T')[0] === dateStr
      );

      dailyStats[dateStr] = {
        date: dateStr,
        totalOrders: dayOrders.length,
        pending: dayOrders.filter(order => order.status === 'pending').length,
        accepted: dayOrders.filter(order => order.status === 'accepted').length,
        inProgress: dayOrders.filter(order => order.status === 'in_progress').length,
        completed: dayOrders.filter(order => order.status === 'completed').length,
        cancelled: dayOrders.filter(order => order.status === 'cancelled').length
      };

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return {
      startDate: startDate,
      endDate: endDate,
      totalOrders: rangeOrders.length,
      dailyStats: dailyStats,
      summary: {
        pending: rangeOrders.filter(order => order.status === 'pending').length,
        accepted: rangeOrders.filter(order => order.status === 'accepted').length,
        inProgress: rangeOrders.filter(order => order.status === 'in_progress').length,
        completed: rangeOrders.filter(order => order.status === 'completed').length,
        cancelled: rangeOrders.filter(order => order.status === 'cancelled').length
      }
    };
  }

  // Chart uchun ma'lumotlar (oxirgi 30 kun)
  getChartData(days = 30) {
    const today = new Date();
    const startDate = new Date(today.getTime() - (days - 1) * 24 * 60 * 60 * 1000);
    
    const chartData = [];
    const currentDate = new Date(startDate);

    while (currentDate <= today) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const dayOrders = this.orders.filter(order => 
        order.createdAt.split('T')[0] === dateStr
      );

      chartData.push({
        date: dateStr,
        totalOrders: dayOrders.length,
        completed: dayOrders.filter(order => order.status === 'completed').length,
        pending: dayOrders.filter(order => order.status === 'pending').length
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return chartData;
  }
}

module.exports = new Order(); 