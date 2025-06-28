'use client';

import { useState, useEffect } from 'react';
import { 
  Shield, 
  ShieldCheck, 
  Plus, 
  Trash2, 
  Edit3,
  Eye,
  EyeOff,
  UserPlus,
  AlertCircle
} from 'lucide-react';
import { usersAPI } from '@/lib/api';
import { getCurrentAdmin, isSuperAdmin } from '@/lib/auth';

interface Admin {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  isSuperAdmin: boolean;
  createdAt: string;
  isActive: boolean;
}

export default function AdminsPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState<any>(null);

  const [newAdminData, setNewAdminData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: ''
  });

  useEffect(() => {
    const admin = getCurrentAdmin();
    setCurrentAdmin(admin);
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await usersAPI.getAdmins();
      
      console.log('Admins API response:', response);
      
      if (response.success && response.data) {
        if (response.data.admins && Array.isArray(response.data.admins)) {
          setAdmins(response.data.admins);
        } else if (Array.isArray(response.data)) {
          setAdmins(response.data);
        } else {
          console.error('Unexpected admins data format:', response.data);
          setAdmins([]);
        }
      } else {
        console.error('Invalid response structure:', response);
        setError(response.message || 'Adminlarni yuklashda xatolik');
        setAdmins([]);
      }
    } catch (err: any) {
      console.error('Load admins error:', err);
      setError('Server bilan bog\'lanishda xatolik');
      setAdmins([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      const response = await usersAPI.createAdmin(newAdminData);
      
      if (response.success) {
        setAdmins([...admins, response.data]);
        setShowCreateModal(false);
        setNewAdminData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          password: ''
        });
        alert('Yangi admin muvaffaqiyatli yaratildi!');
      } else {
        alert(response.message || 'Adminni yaratishda xatolik');
      }
    } catch (error) {
      console.error('Create admin error:', error);
      alert('Server bilan bog\'lanishda xatolik');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteAdmin = async (adminId: string, adminName: string) => {
    if (!confirm(`${adminName} adminni o'chirishni xohlaysizmi?`)) {
      return;
    }

    try {
      const response = await usersAPI.deleteAdmin(adminId);
      
      if (response.success) {
        setAdmins(admins.filter(admin => admin.id !== adminId));
        alert('Admin muvaffaqiyatli o\'chirildi!');
      } else {
        alert(response.message || 'Adminni o\'chirishda xatolik');
      }
    } catch (error) {
      console.error('Delete admin error:', error);
      alert('Server bilan bog\'lanishda xatolik');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewAdminData({
      ...newAdminData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Adminlar yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={loadAdmins}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
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
            <h1 className="text-2xl font-bold text-gray-900">Adminlar Boshqaruvi</h1>
            {isSuperAdmin() && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-5 w-5 mr-2" />
                Yangi Admin
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Info Message */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Ma'lumot</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  {isSuperAdmin() ? 
                    'Siz bosh admin sifatida yangi adminlar yaratishingiz va ularni o\'chirishingiz mumkin.' :
                    'Siz oddiy admin sifatida faqat o\'z ma\'lumotlaringizni ko\'rishingiz mumkin.'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Admins List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Adminlar ro'yxati ({admins.length})
            </h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {admins.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500">
                Adminlar topilmadi
              </div>
            ) : (
              admins.map((admin) => (
                <div key={admin.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center ${
                        admin.isSuperAdmin ? 'bg-red-100' : 'bg-blue-100'
                      }`}>
                        {admin.isSuperAdmin ? (
                          <ShieldCheck className="h-6 w-6 text-red-600" />
                        ) : (
                          <Shield className="h-6 w-6 text-blue-600" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-sm font-medium text-gray-900">
                            {admin.firstName} {admin.lastName}
                          </h3>
                          <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${
                            admin.isSuperAdmin 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {admin.isSuperAdmin ? 'Bosh Admin' : 'Admin'}
                          </span>
                          {admin.id === currentAdmin?.id && (
                            <span className="inline-flex px-2 py-0.5 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                              Siz
                            </span>
                          )}
                        </div>
                        
                        <div className="mt-1 text-sm text-gray-600">
                          <p>{admin.email}</p>
                          {admin.phone && <p>{admin.phone}</p>}
                        </div>
                        
                        <div className="mt-1 text-xs text-gray-500">
                          Yaratilgan: {new Date(admin.createdAt).toLocaleDateString('uz-UZ')}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {/* Faqat super admin boshqa adminlarni o'chira oladi */}
                      {isSuperAdmin() && !admin.isSuperAdmin && admin.id !== currentAdmin?.id && (
                        <button
                          onClick={() => handleDeleteAdmin(admin.id, `${admin.firstName} ${admin.lastName}`)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                          title="Adminni o'chirish"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Create Admin Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Yangi Admin Yaratish</h3>
            </div>
            
            <form onSubmit={handleCreateAdmin} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ism
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={newAdminData.firstName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Familiya
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={newAdminData.lastName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={newAdminData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefon (ixtiyoriy)
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={newAdminData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Parol
                </label>
                <input
                  type="password"
                  name="password"
                  value={newAdminData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isCreating ? 'Yaratilmoqda...' : 'Yaratish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 