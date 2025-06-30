'use client';

import { useState, useEffect } from 'react';
import { Eye, Search, Filter, Package, Clock, CheckCircle, User, MapPin } from 'lucide-react';

interface Order {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  urgency: 'urgent' | 'normal' | 'flexible';
  profession: string;
  address: string;
  region: string;
  district?: string;
  price?: number;
  estimatedTime?: string;
  createdAt: string;
  acceptedAt?: string;
  completedAt?: string;
  client?: {
    id: string;
    firstName: string;
    lastName: string;
    rating?: number;
  };
  specialist?: {
    id: string;
    firstName: string;
    lastName: string;
    profession: string;
    rating?: number;
  };
  clientNote?: string;
  specialistNote?: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [urgencyFilter, setUrgencyFilter] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    accepted: 0,
    inProgress: 0,
    completed: 0,
    cancelled: 0,
    today: 0
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, statusFilter, urgencyFilter]);

  const fetchOrders = async () => {
    try {
      const response = await fetch('https://fixoo-server-f1rh.onrender.com/api/orders', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('fixoo_admin_token')}`,
        },
      });

      const data = await response.json();
      
      if (data.success) {
        setOrders(data.data.orders);
        calculateStats(data.data.orders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (ordersList: Order[]) => {
    const today = new Date().toISOString().split('T')[0];
    
    setStats({
      total: ordersList.length,
      pending: ordersList.filter(o => o.status === 'pending').length,
      accepted: ordersList.filter(o => o.status === 'accepted').length,
      inProgress: ordersList.filter(o => o.status === 'in_progress').length,
      completed: ordersList.filter(o => o.status === 'completed').length,
      cancelled: ordersList.filter(o => o.status === 'cancelled').length,
      today: ordersList.filter(o => o.createdAt.split('T')[0] === today).length,
    });
  };

  const filterOrders = () => {
    let filtered = orders;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.client?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.client?.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.specialist?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.specialist?.lastName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Urgency filter
    if (urgencyFilter !== 'all') {
      filtered = filtered.filter(order => order.urgency === urgencyFilter);
    }

    setFilteredOrders(filtered);
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: 'Kutilmoqda', className: 'badge-yellow' },
      accepted: { label: 'Qabul qilingan', className: 'badge-blue' },
      in_progress: { label: 'Jarayonda', className: 'badge-purple' },
      completed: { label: 'Bajarilgan', className: 'badge-green' },
      cancelled: { label: 'Bekor qilingan', className: 'badge-red' },
    };

    const statusInfo = statusMap[status as keyof typeof statusMap] || { label: status, className: 'badge-gray' };
    
    return (
      <span className={`badge ${statusInfo.className}`}>
        {statusInfo.label}
      </span>
    );
  };

  const getUrgencyBadge = (urgency: string) => {
    const urgencyMap = {
      urgent: { label: 'Shoshilinch', className: 'badge-outline-red' },
      normal: { label: 'Oddiy', className: 'badge-outline-gray' },
      flexible: { label: 'Muddatsiz', className: 'badge-outline-green' },
    };

    const urgencyInfo = urgencyMap[urgency as keyof typeof urgencyMap] || { label: urgency, className: 'badge-outline-gray' };
    
    return (
      <span className={`badge ${urgencyInfo.className}`}>
        {urgencyInfo.label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('uz-UZ', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price?: number) => {
    if (!price) return 'Belgilanmagan';
    return new Intl.NumberFormat('uz-UZ').format(price) + ' so\'m';
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Buyurtmalar boshqaruvi</h1>
        <p className="text-gray-600 mt-2">Barcha buyurtmalarni ko'ring va boshqaring</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="stat-title">
            <span>Jami buyurtmalar</span>
            <Package className="h-4 w-4 text-gray-400" />
          </div>
          <div className="stat-value">{stats.total}</div>
        </div>

        <div className="stat-card">
          <div className="stat-title">
            <span>Kutilmoqda</span>
            <Clock className="h-4 w-4 text-gray-400" />
          </div>
          <div className="stat-value text-yellow-600">{stats.pending}</div>
        </div>

        <div className="stat-card">
          <div className="stat-title">
            <span>Bajarilgan</span>
            <CheckCircle className="h-4 w-4 text-gray-400" />
          </div>
          <div className="stat-value text-green-600">{stats.completed}</div>
        </div>

        <div className="stat-card">
          <div className="stat-title">
            <span>Bugungi buyurtmalar</span>
            <Package className="h-4 w-4 text-gray-400" />
          </div>
          <div className="stat-value text-blue-600">{stats.today}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtrlar
          </h2>
        </div>
        <div className="card-content">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Qidirish</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buyurtma yoki mijoz ismi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input pl-10"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Holat</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="select"
              >
                <option value="all">Barchasi</option>
                <option value="pending">Kutilmoqda</option>
                <option value="accepted">Qabul qilingan</option>
                <option value="in_progress">Jarayonda</option>
                <option value="completed">Bajarilgan</option>
                <option value="cancelled">Bekor qilingan</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Shoshilganlik</label>
              <select
                value={urgencyFilter}
                onChange={(e) => setUrgencyFilter(e.target.value)}
                className="select"
              >
                <option value="all">Barchasi</option>
                <option value="urgent">Shoshilinch</option>
                <option value="normal">Oddiy</option>
                <option value="flexible">Muddatsiz</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Buyurtmalar ro'yxati</h2>
          <p className="card-description">
            {filteredOrders.length} ta buyurtma topildi
          </p>
        </div>
        <div className="card-content">
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Buyurtma</th>
                  <th>Mijoz</th>
                  <th>Usta</th>
                  <th>Holat</th>
                  <th>Shoshilganlik</th>
                  <th>Sana</th>
                  <th>Amallar</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="font-medium">
                      {order.id.substring(0, 8)}...
                    </td>
                    <td>
                      <div className="max-w-xs">
                        <div className="font-medium truncate">{order.title}</div>
                        <div className="text-sm text-gray-500 truncate">{order.description}</div>
                        <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                          <MapPin className="h-3 w-3" />
                          {order.address}
                        </div>
                      </div>
                    </td>
                    <td>
                      {order.client ? (
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="font-medium">
                              {order.client.firstName} {order.client.lastName}
                            </div>
                            {order.client.rating && (
                              <div className="text-xs text-gray-500">
                                ⭐ {order.client.rating}
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400">Ma'lumot yo'q</span>
                      )}
                    </td>
                    <td>
                      {order.specialist ? (
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="font-medium">
                              {order.specialist.firstName} {order.specialist.lastName}
                            </div>
                            <div className="text-xs text-gray-500">
                              {order.specialist.profession}
                            </div>
                            {order.specialist.rating && (
                              <div className="text-xs text-gray-500">
                                ⭐ {order.specialist.rating}
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400">Tayinlanmagan</span>
                      )}
                    </td>
                    <td>
                      {getStatusBadge(order.status)}
                    </td>
                    <td>
                      {getUrgencyBadge(order.urgency)}
                    </td>
                    <td>
                      <div className="text-sm">
                        {formatDate(order.createdAt)}
                      </div>
                    </td>
                    <td>
                      <button className="button">
                        <Eye className="h-4 w-4" />
                        Ko'rish
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredOrders.length === 0 && (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Buyurtmalar topilmadi</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 