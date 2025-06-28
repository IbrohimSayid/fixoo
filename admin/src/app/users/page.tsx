'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  UserCheck, 
  Search, 
  MapPin,
  Phone,
  Mail,
  Calendar,
  Star,
  Shield,
  ShieldOff,
  Eye,
  EyeOff,
  UserX,
  Briefcase,
  Home,
  ChevronRight,
  Filter,
  ChevronLeft
} from 'lucide-react';
import { usersAPI } from '@/lib/api';
import { User } from '@/lib/types';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<'specialists' | 'clients'>('specialists');
  const [searchTerm, setSearchTerm] = useState('');
  const [showPasswords, setShowPasswords] = useState<{[key: string]: boolean}>({});
  const [currentPage, setCurrentPage] = useState(1);
  const USERS_PER_PAGE = 3;

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (typeof window !== 'undefined') {
      loadUsers();
      
      // Har 30 sekundda foydalanuvchilarni yangilash
      interval = setInterval(() => {
        loadUsers();
      }, 30000);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await usersAPI.getAll();
      console.log('Users API response:', response);
      
      // API javobidan to'g'ri ma'lumotlarni olish
      if (response.success && response.data) {
        if (response.data.users && Array.isArray(response.data.users)) {
          setUsers(response.data.users);
        } else if (Array.isArray(response.data)) {
          setUsers(response.data);
        } else {
          console.error('Unexpected users data format:', response.data);
          setUsers([]);
        }
      } else {
        console.error('Invalid response structure:', response);
        setUsers([]);
      }
    } catch (err: any) {
      console.error('Foydalanuvchilarni yuklashda xatolik:', err);
      setError('Foydalanuvchilarni yuklashda xatolik yuz berdi');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (userId: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const handleBlockUser = async (userId: string, isBlocked: boolean) => {
    try {
      setUsers(users.map(user => 
        user.id === userId ? { ...user, isActive: !isBlocked } : user
      ));
    } catch (error) {
      console.error('User blocking error:', error);
    }
  };

  // Foydalanuvchilarni filtrlash
  const specialists = users.filter(user => user.role === 'specialist');
  const clients = users.filter(user => user.role === 'client');

  const currentUsers = activeSection === 'specialists' ? specialists : clients;
  const filteredUsers = currentUsers.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    return user.firstName.toLowerCase().includes(searchLower) ||
           user.lastName.toLowerCase().includes(searchLower) ||
           (user.phone && user.phone.toLowerCase().includes(searchLower)) ||
           (user.email && user.email.toLowerCase().includes(searchLower)) ||
           (user.profession && user.profession.toLowerCase().includes(searchLower)) ||
           (user.region && user.region.toLowerCase().includes(searchLower)) ||
           (user.district && user.district.toLowerCase().includes(searchLower)) ||
           (user.address && user.address.toLowerCase().includes(searchLower));
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
  const startIndex = (currentPage - 1) * USERS_PER_PAGE;
  const endIndex = startIndex + USERS_PER_PAGE;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  // Reset current page when section or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeSection, searchTerm]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Foydalanuvchilar yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <UserX className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">{error}</p>
          <button 
            onClick={loadUsers}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Qayta yuklash
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-gray-900">Foydalanuvchilar Boshqaruvi</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Jami: {users.length} | Ustalar: {specialists.length} | Mijozlar: {clients.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Settings List Style */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                Foydalanuvchi turlari
              </h2>
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveSection('specialists')}
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeSection === 'specialists'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="flex items-center">
                    <UserCheck className="h-4 w-4 mr-2" />
                    Ustalar
                  </span>
                  <span className="flex items-center">
                    <span className="mr-2">{specialists.length}</span>
                    <ChevronRight className="h-4 w-4" />
                  </span>
                </button>
                <button
                  onClick={() => setActiveSection('clients')}
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeSection === 'clients'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    Mijozlar
                  </span>
                  <span className="flex items-center">
                    <span className="mr-2">{clients.length}</span>
                    <ChevronRight className="h-4 w-4" />
                  </span>
                </button>
              </nav>
            </div>

            {/* Statistics */}
            <div className="mt-6 bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                Statistika
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500">Bugun qo'shilgan</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {users.filter(u => u.createdAt.split('T')[0] === new Date().toISOString().split('T')[0]).length}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Faol foydalanuvchilar</p>
                  <p className="text-2xl font-bold text-green-600">
                    {users.filter(u => u.isActive).length}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Bloklangan</p>
                  <p className="text-2xl font-bold text-red-600">
                    {users.filter(u => !u.isActive).length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm">
              {/* Search Header */}
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {activeSection === 'specialists' ? 'Ustalar' : 'Mijozlar'} ro'yxati
                  </h2>
                  <div className="relative w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Qidirish..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Users List */}
              <div className="divide-y divide-gray-200">
                {filteredUsers.length === 0 ? (
                  <div className="px-6 py-8 text-center text-gray-500">
                    {activeSection === 'specialists' ? 'Ustalar' : 'Mijozlar'} topilmadi
                  </div>
                ) : (
                  paginatedUsers.map((user) => (
                    <div key={user.id} className={`px-6 py-4 hover:bg-gray-50 ${!user.isActive ? 'opacity-60' : ''}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className={`flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center overflow-hidden ${
                            activeSection === 'specialists' ? 'bg-green-100' : 'bg-blue-100'
                          }`}>
                            {user.avatar ? (
                              <img
                                src={`https://fixoo-server-f1rh.onrender.com${user.avatar}`}
                                alt={`${user.firstName} ${user.lastName}`}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              activeSection === 'specialists' ? (
                                <UserCheck className="h-6 w-6 text-green-600" />
                              ) : (
                                <Users className="h-6 w-6 text-blue-600" />
                              )
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-3">
                              <h3 className="text-sm font-medium text-gray-900">
                                {user.firstName} {user.lastName}
                              </h3>
                              <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${
                                user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {user.isActive ? 'Faol' : 'Bloklangan'}
                              </span>
                            </div>
                            
                            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                              <div className="flex items-center">
                                <Phone className="h-4 w-4 mr-2 text-gray-400" />
                                {user.phone}
                              </div>
                              <div className="flex items-center">
                                <Mail className="h-4 w-4 mr-2 text-gray-400" />
                                {user.email || '-'}
                              </div>
                              
                              {activeSection === 'specialists' && (
                                <>
                                  <div className="flex items-center">
                                    <Briefcase className="h-4 w-4 mr-2 text-gray-400" />
                                    {user.profession || '-'}
                                  </div>
                                  <div className="flex items-center">
                                    <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                                    {user.region}{user.district ? `, ${user.district}` : ''}
                                  </div>
                                </>
                              )}
                              
                              <div className="flex items-center col-span-full">
                                <Home className="h-4 w-4 mr-2 text-gray-400" />
                                {user.address || '-'}
                              </div>
                              
                              <div className="flex items-center col-span-full">
                                <div className="flex items-center">
                                  <span className="mr-2 text-gray-500">Parol:</span>
                                  <span className="font-mono">
                                    {showPasswords[user.id] ? user.password || '••••••••' : '••••••••'}
                                  </span>
                                  <button
                                    onClick={() => togglePasswordVisibility(user.id)}
                                    className="ml-2 text-gray-400 hover:text-gray-600"
                                  >
                                    {showPasswords[user.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                  </button>
                                </div>
                              </div>
                            </div>
                            
                            <div className="mt-2 text-xs text-gray-500">
                              Ro'yxatdan o'tgan: {new Date(user.createdAt).toLocaleDateString('uz-UZ'                )}
              </div>

              {/* Pagination */}
              {filteredUsers.length > USERS_PER_PAGE && (
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      <span className="font-medium">{startIndex + 1}</span>
                      &nbsp;-&nbsp;
                      <span className="font-medium">{Math.min(endIndex, filteredUsers.length)}</span>
                      &nbsp;dan&nbsp;
                      <span className="font-medium">{filteredUsers.length}</span>
                      &nbsp;ta natija
                    </div>
                    
                    <nav className="relative z-0 inline-flex shadow-sm -space-x-px" aria-label="Pagination">
                      {/* Previous Button */}
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border text-sm font-medium ${
                          currentPage === 1
                            ? 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>

                      {/* Page Numbers */}
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            page === currentPage
                              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      ))}

                      {/* Next Button */}
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border text-sm font-medium ${
                          currentPage === totalPages
                            ? 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </nav>
                  </div>
                </div>
              )}
            </div>
          </div>
                        
                        <div className="ml-4">
                          <button
                            onClick={() => handleBlockUser(user.id, user.isActive)}
                            className={`px-3 py-1 rounded text-xs font-medium ${
                              user.isActive 
                                ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                            }`}
                          >
                            {user.isActive ? 'Bloklash' : 'Ochish'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 