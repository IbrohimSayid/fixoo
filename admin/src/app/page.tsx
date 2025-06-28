'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  UserCheck, 
  ShoppingCart, 
  TrendingUp,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Edit3,
  Save,
  X,
  User,
  Mail,
  Phone,
  Lock,
  LineChart,
  TrendingDown,
  Zap,
  Target,
  Award,
  Search
} from 'lucide-react';
import { ordersAPI, usersAPI } from '@/lib/api';
import { isAuthenticated, getCurrentAdmin, AdminUser, updateAdminToken } from '@/lib/auth';

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  
  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editSuccess, setEditSuccess] = useState(false);
  
  // Form states
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Stats states with initial values for better UX
  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    totalSpecialists: 0,
    totalClients: 0,
    todayRegistered: 0
  });
  
  const [orderStats, setOrderStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    acceptedOrders: 0,
    completedOrders: 0,
    todayOrders: 0
  });

  const [chartData, setChartData] = useState<any[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState('');
  const [dateRangeStart, setDateRangeStart] = useState('');
  const [dateRangeEnd, setDateRangeEnd] = useState('');

  useEffect(() => {
    checkAuthAndLoadData();
    
    // Real-time auto refresh har 30 sekundda
    const interval = setInterval(() => {
      loadDashboardData();
    }, 30000); // 30 sekund
    
    return () => clearInterval(interval);
  }, []);

  const checkAuthAndLoadData = async () => {
    try {
      // Check authentication
      if (!isAuthenticated()) {
        router.push('/login');
        return;
      }

      const currentAdmin = getCurrentAdmin();
      if (!currentAdmin) {
        router.push('/login');
        return;
      }

      setAdmin(currentAdmin);
      await loadDashboardData();
    } catch (error) {
      console.error('Auth check error:', error);
      router.push('/login');
    }
  };

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load all data in parallel
      const [usersResponse, ordersResponse, chartResponse] = await Promise.all([
        usersAPI.getAll(),
        ordersAPI.getStats(),
        ordersAPI.getChartData(30)
      ]);

      console.log('Dashboard API responses:', { usersResponse, ordersResponse, chartResponse });

      // Process users data
      if (usersResponse.success && usersResponse.data) {
        const users = usersResponse.data.users || [];
        const today = new Date().toISOString().split('T')[0];
        
        setUserStats({
          totalUsers: users.length,
          totalSpecialists: users.filter((u: any) => u.role === 'specialist').length,
          totalClients: users.filter((u: any) => u.role === 'client').length,
          todayRegistered: users.filter((u: any) => u.createdAt?.split('T')[0] === today).length
        });
      }

      // Process orders data
      if (ordersResponse.success && ordersResponse.data) {
        setOrderStats(ordersResponse.data);
      } else {
        console.error('Orders stats error:', ordersResponse);
        // Set default values if API fails
        setOrderStats({
          totalOrders: 0,
          pendingOrders: 0,
          acceptedOrders: 0,
          completedOrders: 0,
          todayOrders: 0
        });
      }

      // Process chart data
      if (chartResponse.success && chartResponse.data) {
        setChartData(chartResponse.data);
      } else {
        console.error('Chart data error:', chartResponse);
        setChartData([]);
      }

      // Update last refresh time
      setLastUpdate(new Date());

    } catch (err: any) {
      console.error('Dashboard data loading error:', err);
      setError('Ma\'lumotlarni yuklashda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = async (date: string) => {
    setSelectedDate(date);
    if (date) {
      try {
        const response = await ordersAPI.getByDate(date);
        if (response.success) {
          console.log('Selected date data:', response.data);
          // Update chart or show data for selected date
        }
      } catch (error) {
        console.error('Date filter error:', error);
      }
    }
  };

  const handleDateRangeChange = async () => {
    if (dateRangeStart && dateRangeEnd) {
      try {
        const response = await ordersAPI.getByDateRange(dateRangeStart, dateRangeEnd);
        if (response.success) {
          console.log('Date range data:', response.data);
          // Update chart with date range data
          const dailyStats = response.data.dailyStats;
          const chartDataFromRange = Object.entries(dailyStats).map(([date, stats]: [string, any]) => ({
            date,
            totalOrders: stats.totalOrders,
            completed: stats.completed,
            pending: stats.pending
          }));
          setChartData(chartDataFromRange);
        }
      } catch (error) {
        console.error('Date range filter error:', error);
      }
    }
  };

  // Modal functions
  const openEditModal = () => {
    if (admin) {
      setEditForm({
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        phone: admin.phone || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setEditError(null);
      setEditSuccess(false);
      setShowEditModal(true);
    }
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditForm({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setEditError(null);
    setEditSuccess(false);
  };

  const handleEditFormChange = (field: string, value: string) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
    setEditError(null);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError(null);

    try {
      // Validation
      if (!editForm.firstName.trim() || !editForm.lastName.trim()) {
        setEditError('Ism va familiya majburiy');
        return;
      }

      if (editForm.newPassword && editForm.newPassword !== editForm.confirmPassword) {
        setEditError('Yangi parollar mos kelmaydi');
        return;
      }

      if (editForm.newPassword && editForm.newPassword.length < 6) {
        setEditError('Yangi parol kamida 6 ta belgidan iborat bo\'lishi kerak');
        return;
      }

      // Prepare update data
      const updateData: any = {
        firstName: editForm.firstName.trim(),
        lastName: editForm.lastName.trim(),
        email: editForm.email.trim(),
        phone: editForm.phone.trim()
      };

      if (editForm.newPassword) {
        updateData.currentPassword = editForm.currentPassword;
        updateData.newPassword = editForm.newPassword;
      }

      // Call API to update admin profile
      const response = await usersAPI.updateAdminProfile(admin!.id, updateData);

      if (response.success) {
        // Update local admin data
        const updatedAdmin = {
          ...admin!,
          firstName: updateData.firstName,
          lastName: updateData.lastName,
          email: updateData.email,
          phone: updateData.phone
        };
        
        setAdmin(updatedAdmin);
        updateAdminToken(updatedAdmin);
        
        setEditSuccess(true);
        setTimeout(() => {
          closeEditModal();
        }, 1500);
      } else {
        setEditError(response.message || 'Admin ma\'lumotlarini yangilashda xatolik');
      }
    } catch (error: any) {
      console.error('Update admin error:', error);
      setEditError('Server xatosi yuz berdi');
    } finally {
      setEditLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-8">
            {/* Animated rings */}
            <div className="w-32 h-32 rounded-full border-4 border-purple-500/30 relative mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-500 animate-spin"></div>
              <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-cyan-500 animate-spin animation-delay-200" style={{animationDirection: 'reverse'}}></div>
              <div className="absolute inset-4 rounded-full border-4 border-transparent border-t-pink-500 animate-spin animation-delay-400"></div>
              
              {/* Center icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-gradient-to-br from-purple-500 to-cyan-500 p-4 rounded-2xl shadow-2xl">
                  <Activity className="h-8 w-8 text-white animate-pulse" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-white">Fixoo Admin Panel</h2>
            <p className="text-gray-300 text-lg">Dashboard yuklanmoqda...</p>
            
            {/* Progress dots */}
            <div className="flex justify-center space-x-2 mt-6">
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-cyan-500 rounded-full animate-bounce animation-delay-200"></div>
              <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce animation-delay-400"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-pink-900 to-purple-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="relative mb-8">
            <div className="bg-gradient-to-br from-red-500 to-pink-500 p-6 rounded-3xl shadow-2xl mx-auto w-24 h-24 flex items-center justify-center">
              <X className="h-12 w-12 text-white" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-pink-500 rounded-3xl opacity-20 animate-ping w-24 h-24 mx-auto"></div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-white">Xatolik yuz berdi</h2>
            <div className="bg-red-500/20 border border-red-400/30 text-red-200 px-6 py-4 rounded-xl backdrop-blur-sm">
              {error}
            </div>
          <button 
            onClick={loadDashboardData}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-medium"
          >
            Qayta yuklash
          </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-white via-blue-50 to-purple-50 shadow-lg border-b border-gray-200 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg shadow-lg">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Fixoo Admin Panel
                </h1>
                <div className="flex items-center space-x-2">
                  <p className="text-sm text-gray-600">Xush kelibsiz,</p>
                  <button
                    onClick={openEditModal}
                    className="flex items-center space-x-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors duration-300 hover:bg-blue-50 px-2 py-1 rounded-lg"
                  >
                    <span>{admin?.firstName} {admin?.lastName}</span>
                    <Edit3 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-white/70 backdrop-blur-sm rounded-lg px-3 py-2 border border-gray-200 shadow-sm">
                <div className="text-sm text-gray-600">
                {new Date().toLocaleDateString('uz-UZ', { 
                  year: 'numeric', 
                  month: 'long', 
                    day: 'numeric',
                    weekday: 'long'
                })}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="text-xs text-gray-500">
                  Yangilangan: {lastUpdate.toLocaleTimeString('uz-UZ')}
                </div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Admin Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-screen overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Admin Ma'lumotlarni Tahrirlash</h3>
                    <p className="text-white/80 text-sm">Shaxsiy ma'lumotlaringizni yangilang</p>
                  </div>
                </div>
                <button
                  onClick={closeEditModal}
                  className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors duration-300"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {editError && (
                <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
                  {editError}
                </div>
              )}

              {editSuccess && (
                <div className="mb-4 p-3 bg-green-100 border border-green-300 text-green-700 rounded-lg text-sm">
                  Ma'lumotlar muvaffaqiyatli yangilandi!
                </div>
              )}

              <form onSubmit={handleEditSubmit} className="space-y-4">
                {/* First Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="h-4 w-4 inline mr-1" />
                    Ism
                  </label>
                  <input
                    type="text"
                    value={editForm.firstName}
                    onChange={(e) => handleEditFormChange('firstName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 placeholder-gray-500"
                    placeholder="Ismingizni kiriting"
                    required
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="h-4 w-4 inline mr-1" />
                    Familiya
                  </label>
                  <input
                    type="text"
                    value={editForm.lastName}
                    onChange={(e) => handleEditFormChange('lastName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 placeholder-gray-500"
                    placeholder="Familiyangizni kiriting"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="h-4 w-4 inline mr-1" />
                    Email
                  </label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => handleEditFormChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 placeholder-gray-500"
                    placeholder="Email manzilingizni kiriting"
                    required
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="h-4 w-4 inline mr-1" />
                    Telefon (ixtiyoriy)
                  </label>
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => handleEditFormChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 placeholder-gray-500"
                    placeholder="+998 90 123 45 67"
                  />
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Parolni o'zgartirish (ixtiyoriy)</h4>
                </div>

                {/* Current Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Lock className="h-4 w-4 inline mr-1" />
                    Joriy parol
                  </label>
                  <input
                    type="password"
                    value={editForm.currentPassword}
                    onChange={(e) => handleEditFormChange('currentPassword', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 placeholder-gray-500"
                    placeholder="Joriy parolingizni kiriting"
                  />
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Lock className="h-4 w-4 inline mr-1" />
                    Yangi parol
                  </label>
                  <input
                    type="password"
                    value={editForm.newPassword}
                    onChange={(e) => handleEditFormChange('newPassword', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 placeholder-gray-500"
                    placeholder="Yangi parolingizni kiriting"
                  />
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Lock className="h-4 w-4 inline mr-1" />
                    Yangi parolni tasdiqlang
                  </label>
                  <input
                    type="password"
                    value={editForm.confirmPassword}
                    onChange={(e) => handleEditFormChange('confirmPassword', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 placeholder-gray-500"
                    placeholder="Yangi parolni qayta kiriting"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={editLoading}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {editLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Saqlanmoqda...</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        <span>Saqlash</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Users */}
          <div className="bg-gradient-to-br from-white via-blue-50 to-blue-100 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-blue-100 hover:border-blue-200 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Jami Foydalanuvchilar</p>
                <p className="text-3xl font-bold text-gray-900 mb-1">{userStats.totalUsers}</p>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <p className="text-sm text-green-600 font-medium">+{userStats.todayRegistered} bugun</p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-xl shadow-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          {/* Specialists */}
          <div className="bg-gradient-to-br from-white via-green-50 to-green-100 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-green-100 hover:border-green-200 transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Ustalar</p>
                <p className="text-3xl font-bold text-gray-900 mb-1">{userStats.totalSpecialists}</p>
                <div className="flex items-center space-x-1">
                  <div className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full font-medium">
                    {Math.round((userStats.totalSpecialists / userStats.totalUsers) * 100) || 0}% jamidan
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-xl shadow-lg">
                <UserCheck className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          {/* Clients */}
          <div className="bg-gradient-to-br from-white via-purple-50 to-purple-100 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-purple-100 hover:border-purple-200 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Mijozlar</p>
                <p className="text-3xl font-bold text-gray-900 mb-1">{userStats.totalClients}</p>
                <div className="flex items-center space-x-1">
                  <div className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full font-medium">
                    {Math.round((userStats.totalClients / userStats.totalUsers) * 100) || 0}% jamidan
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-xl shadow-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
        </div>

          {/* Today's Registered */}
          <div className="bg-gradient-to-br from-white via-orange-50 to-orange-100 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-orange-100 hover:border-orange-200 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Bugun Qo'shilgan</p>
                <p className="text-3xl font-bold text-orange-600 mb-1">{userStats.todayRegistered}</p>
                <div className="flex items-center space-x-1">
                  <div className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full font-medium">
                    Yangi foydalanuvchilar
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-4 rounded-xl shadow-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Orders Section */}
        <div className="space-y-6 mb-8">
          {/* Orders Stats - Flex Horizontal */}
          <div className="bg-gradient-to-br from-white via-gray-50 to-blue-50 rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Buyurtmalar Statistikasi</h3>
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl shadow-lg">
                <ShoppingCart className="h-6 w-6 text-white" />
              </div>
            </div>
            
            {/* Horizontal Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="group hover:scale-105 transition-transform duration-300">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm opacity-90 mb-1">Jami Buyurtmalar</p>
                      <p className="text-3xl font-bold">{orderStats.totalOrders}</p>
                    </div>
                    <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
              
              <div className="group hover:scale-105 transition-transform duration-300">
                <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm opacity-90 mb-1">Kutilayotgan</p>
                      <p className="text-3xl font-bold">{orderStats.pendingOrders}</p>
                    </div>
                    <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
                  </div>
                </div>
              </div>
              
              <div className="group hover:scale-105 transition-transform duration-300">
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm opacity-90 mb-1">Bajarilgan</p>
                      <p className="text-3xl font-bold">{orderStats.completedOrders}</p>
                    </div>
                    <div className="w-3 h-3 bg-white rounded-full animate-ping"></div>
                  </div>
                </div>
              </div>
              
              <div className="group hover:scale-105 transition-transform duration-300">
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm opacity-90 mb-1">Bugun Berilgan</p>
                      <p className="text-3xl font-bold">{orderStats.todayOrders}</p>
                    </div>
                    <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Progress Summary */}
            <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200 p-6 shadow-inner">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-900">Umumiy Bajarish Ko'rsatkichi</h4>
                <div className="text-2xl font-bold text-gray-900">
                  {Math.round(((orderStats.completedOrders / orderStats.totalOrders) * 100) || 0)}%
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 shadow-inner">
                <div 
                  className="bg-gradient-to-r from-green-500 via-green-600 to-green-700 h-4 rounded-full transition-all duration-1000 ease-out shadow-lg relative overflow-hidden"
                  style={{ 
                    width: `${Math.round(((orderStats.completedOrders / orderStats.totalOrders) * 100) || 0)}%` 
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                </div>
              </div>
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>Bajarilgan: {orderStats.completedOrders}</span>
                <span>Jami: {orderStats.totalOrders}</span>
              </div>
            </div>
          </div>

          {/* Chart Section - Full Width */}
          <div>
            <div className="bg-gradient-to-br from-white via-blue-50 to-purple-50 rounded-xl border border-gray-200 p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl shadow-lg">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Buyurtmalar Analytics Dashboard</h3>
                    <p className="text-sm text-gray-600 flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                      Kunlik tahlil va trend ko'rsatkichlari
                    </p>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-green-100 to-blue-100 px-4 py-2 rounded-xl border border-green-200">
                  <span className="text-sm font-semibold text-gray-700 flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-ping"></div>
                    Live Data
                  </span>
                </div>
              </div>
              
              {/* Date Controls */}
              <div className="mb-6">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                    Sana bo'yicha filtrlash
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-2">
                        Ma'lum kun
                      </label>
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => handleDateChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white shadow-sm hover:shadow-md text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-2">
                        Dan
                      </label>
                      <input
                        type="date"
                        value={dateRangeStart}
                        onChange={(e) => setDateRangeStart(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white shadow-sm hover:shadow-md text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-2">
                        Gacha
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="date"
                          value={dateRangeEnd}
                          onChange={(e) => setDateRangeEnd(e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white shadow-sm hover:shadow-md text-gray-900"
                        />
                        <button
                          onClick={handleDateRangeChange}
                          className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 shadow-sm"
                        >
                          <Search className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modern Area Chart */}
              <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl border border-gray-200 p-6 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl shadow-lg">
                      <BarChart3 className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Buyurtmalar Analytics</h3>
                      <p className="text-sm text-gray-600 flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                        Real-time ma'lumotlar
                      </p>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2 rounded-xl border">
                    <span className="text-sm font-semibold text-gray-700">7 Kun</span>
                  </div>
                </div>

                {chartData.length > 0 ? (
                  <div className="space-y-6">
                    {/* Chart Container */}
                    <div className="relative h-64 bg-white rounded-lg p-4 shadow-inner">
                      {/* Background Grid */}
                      <div className="absolute inset-4">
                        {/* Horizontal lines */}
                        {[...Array(5)].map((_, i) => (
                          <div 
                            key={i} 
                            className="absolute w-full border-t border-gray-100"
                            style={{ top: `${(i * 100) / 4}%` }}
                          ></div>
                        ))}
                        {/* Vertical lines */}
                        {[...Array(7)].map((_, i) => (
                          <div 
                            key={i} 
                            className="absolute h-full border-l border-gray-100"
                            style={{ left: `${(i * 100) / 6}%` }}
                          ></div>
                        ))}
                      </div>

                      {/* Area Chart */}
                      <svg className="w-full h-full relative z-10" viewBox="0 0 400 180">
                        <defs>
                          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3"/>
                            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.05"/>
                          </linearGradient>
                        </defs>
                        
                        {/* Area fill */}
                        <path
                          d={`M ${chartData.slice(-7).map((item, index) => {
                            const x = (index * 400) / 6;
                            const maxOrders = Math.max(...chartData.slice(-7).map(d => d.totalOrders), 1);
                            const y = 160 - (item.totalOrders / maxOrders) * 140;
                            return `${x},${y}`;
                          }).join(' L ')} L 400,160 L 0,160 Z`}
                          fill="url(#areaGradient)"
                        />
                        
                        {/* Chart line */}
                        <path
                          d={`M ${chartData.slice(-7).map((item, index) => {
                            const x = (index * 400) / 6;
                            const maxOrders = Math.max(...chartData.slice(-7).map(d => d.totalOrders), 1);
                            const y = 160 - (item.totalOrders / maxOrders) * 140;
                            return `${x},${y}`;
                          }).join(' L ')}`}
                          fill="none"
                          stroke="#3B82F6"
                          strokeWidth="3"
                          className="drop-shadow-sm"
                        />
                        
                        {/* Data points */}
                        {chartData.slice(-7).map((item, index) => {
                          const x = (index * 400) / 6;
                          const maxOrders = Math.max(...chartData.slice(-7).map(d => d.totalOrders), 1);
                          const y = 160 - (item.totalOrders / maxOrders) * 140;
                          
                          return (
                            <g key={index} className="group">
                              {/* Glow effect */}
                              <circle
                                cx={x}
                                cy={y}
                                r="8"
                                fill="#3B82F6"
                                opacity="0.2"
                                className="group-hover:opacity-40 transition-opacity duration-300"
                              />
                              {/* Main point */}
                              <circle
                                cx={x}
                                cy={y}
                                r="4"
                                fill="#3B82F6"
                                className="group-hover:r-6 transition-all duration-300"
                              />
                              {/* White center */}
                              <circle
                                cx={x}
                                cy={y}
                                r="2"
                                fill="white"
                                className="group-hover:r-3 transition-all duration-300"
                              />
                              
                              {/* Interactive area */}
                              <circle
                                cx={x}
                                cy={y}
                                r="15"
                                fill="transparent"
                                className="cursor-pointer"
                              />
                              
                              {/* Enhanced Tooltip */}
                              <g className="opacity-0 group-hover:opacity-100 transition-all duration-300">
                                <rect
                                  x={x - 35}
                                  y={y - 55}
                                  width="70"
                                  height="40"
                                  fill="#1F2937"
                                  rx="8"
                                  className="drop-shadow-lg"
                                />
                                <text
                                  x={x}
                                  y={y - 35}
                                  textAnchor="middle"
                                  className="text-sm fill-white font-bold"
                                >
                                  {item.totalOrders}
                                </text>
                                <text
                                  x={x}
                                  y={y - 22}
                                  textAnchor="middle"
                                  className="text-xs fill-gray-300"
                                >
                                  buyurtma
                                </text>
                              </g>
                            </g>
                          );
                        })}
                      </svg>
                    </div>

                    {/* Date Labels */}
                    <div className="flex justify-between text-xs text-gray-500 px-4">
                      {chartData.slice(-7).map((item, index) => (
                        <div key={index} className="text-center">
                          <div className="font-medium">
                            {new Date(item.date).toLocaleDateString('uz-UZ', { 
                              day: '2-digit'
                            })}
                          </div>
                          <div className="text-xs text-gray-400">
                            {new Date(item.date).toLocaleDateString('uz-UZ', { 
                              month: 'short' 
                            })}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Enhanced Summary Cards */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white shadow-lg transform hover:scale-105 transition-transform duration-300">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-2xl font-bold">
                              {chartData.slice(-7).reduce((sum, item) => sum + item.totalOrders, 0)}
                            </div>
                            <div className="text-sm opacity-90">Jami</div>
                          </div>
                          <Target className="h-6 w-6 opacity-80" />
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white shadow-lg transform hover:scale-105 transition-transform duration-300">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-2xl font-bold">
                              {Math.round(chartData.slice(-7).reduce((sum, item) => sum + item.totalOrders, 0) / 7)}
                            </div>
                            <div className="text-sm opacity-90">O'rtacha</div>
                          </div>
                          <BarChart3 className="h-6 w-6 opacity-80" />
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white shadow-lg transform hover:scale-105 transition-transform duration-300">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-2xl font-bold flex items-center">
                              +12%
                              <TrendingUp className="h-4 w-4 ml-1" />
                            </div>
                            <div className="text-sm opacity-90">O'sish</div>
                          </div>
                          <Award className="h-6 w-6 opacity-80" />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <div className="relative">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                          <BarChart3 className="h-8 w-8 text-white animate-pulse" />
                        </div>
                        <div className="absolute inset-0 w-16 h-16 bg-blue-400 rounded-2xl opacity-20 animate-ping mx-auto"></div>
                      </div>
                      <p className="text-gray-600 font-medium">Ma'lumotlar yuklanmoqda...</p>
                      <div className="flex justify-center space-x-1 mt-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce animation-delay-200"></div>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce animation-delay-400"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Today's Activity */}
        <div className="bg-gradient-to-br from-white via-gray-50 to-indigo-50 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-t-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Bugungi Faollik</h3>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span className="text-sm text-white/80">Real vaqt</span>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center group hover:scale-105 transition-all duration-300">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 w-20 h-20 mx-auto mb-4 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:from-blue-600 group-hover:to-blue-700">
                  <Users className="h-8 w-8 text-white mx-auto" />
                </div>
                <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-blue-100">
                  <p className="text-3xl font-bold text-gray-900 mb-1">{userStats.todayRegistered}</p>
                  <p className="text-sm text-gray-600">Bugun ro'yxatdan o'tgan yangi foydalanuvchilar</p>
                </div>
              </div>
              
              <div className="text-center group hover:scale-105 transition-all duration-300">
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 w-20 h-20 mx-auto mb-4 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:from-green-600 group-hover:to-green-700">
                  <ShoppingCart className="h-8 w-8 text-white mx-auto" />
                </div>
                <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-green-100">
                  <p className="text-3xl font-bold text-gray-900 mb-1">{orderStats.todayOrders}</p>
                  <p className="text-sm text-gray-600">Bugun berilgan buyurtmalar</p>
                </div>
              </div>
              
              <div className="text-center group hover:scale-105 transition-all duration-300">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 w-20 h-20 mx-auto mb-4 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:from-purple-600 group-hover:to-purple-700">
                  <TrendingUp className="h-8 w-8 text-white mx-auto" />
                </div>
                <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-purple-100">
                  <p className="text-3xl font-bold text-gray-900 mb-1">{Math.round(((orderStats.completedOrders / orderStats.totalOrders) * 100) || 0)}%</p>
                  <p className="text-sm text-gray-600">Bajarilgan buyurtmalar nisbati</p>
                </div>
              </div>
            </div>
            
            {/* Additional Activity Metrics */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-4 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-80">Eng faol vaqt</p>
                    <p className="text-lg font-bold">14:00 - 18:00</p>
                  </div>
                  <Activity className="h-6 w-6 opacity-80" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-lg p-4 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-80">Muvaffaqiyat darajasi</p>
                    <p className="text-lg font-bold">{Math.round(((orderStats.completedOrders / orderStats.totalOrders) * 100) || 0)}%</p>
                  </div>
                  <PieChart className="h-6 w-6 opacity-80" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}