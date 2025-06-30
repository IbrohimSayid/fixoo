'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
      pending: { label: 'Kutilmoqda', className: 'bg-yellow-100 text-yellow-800' },
      accepted: { label: 'Qabul qilingan', className: 'bg-blue-100 text-blue-800' },
      in_progress: { label: 'Jarayonda', className: 'bg-purple-100 text-purple-800' },
      completed: { label: 'Bajarilgan', className: 'bg-green-100 text-green-800' },
      cancelled: { label: 'Bekor qilingan', className: 'bg-red-100 text-red-800' },
    };

    const statusInfo = statusMap[status as keyof typeof statusMap] || { label: status, className: 'bg-gray-100 text-gray-800' };
    
    return (
      <Badge className={statusInfo.className}>
        {statusInfo.label}
      </Badge>
    );
  };

  const getUrgencyBadge = (urgency: string) => {
    const urgencyMap = {
      urgent: { label: 'Shoshilinch', className: 'bg-red-100 text-red-800' },
      normal: { label: 'Oddiy', className: 'bg-gray-100 text-gray-800' },
      flexible: { label: 'Muddatsiz', className: 'bg-green-100 text-green-800' },
    };

    const urgencyInfo = urgencyMap[urgency as keyof typeof urgencyMap] || { label: urgency, className: 'bg-gray-100 text-gray-800' };
    
    return (
      <Badge variant="outline" className={urgencyInfo.className}>
        {urgencyInfo.label}
      </Badge>
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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jami buyurtmalar</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kutilmoqda</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bajarilgan</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bugungi buyurtmalar</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.today}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtrlar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Qidirish</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buyurtma yoki mijoz ismi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Holat</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Holatni tanlang" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Barchasi</SelectItem>
                  <SelectItem value="pending">Kutilmoqda</SelectItem>
                  <SelectItem value="accepted">Qabul qilingan</SelectItem>
                  <SelectItem value="in_progress">Jarayonda</SelectItem>
                  <SelectItem value="completed">Bajarilgan</SelectItem>
                  <SelectItem value="cancelled">Bekor qilingan</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Shoshilganlik</label>
              <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Shoshilganlikni tanlang" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Barchasi</SelectItem>
                  <SelectItem value="urgent">Shoshilinch</SelectItem>
                  <SelectItem value="normal">Oddiy</SelectItem>
                  <SelectItem value="flexible">Muddatsiz</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Buyurtmalar ro'yxati</CardTitle>
          <CardDescription>
            {filteredOrders.length} ta buyurtma topildi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Buyurtma</TableHead>
                  <TableHead>Mijoz</TableHead>
                  <TableHead>Usta</TableHead>
                  <TableHead>Holat</TableHead>
                  <TableHead>Shoshilganlik</TableHead>
                  <TableHead>Sana</TableHead>
                  <TableHead>Amallar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">
                      {order.id.substring(0, 8)}...
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <div className="font-medium truncate">{order.title}</div>
                        <div className="text-sm text-gray-500 truncate">{order.description}</div>
                        <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                          <MapPin className="h-3 w-3" />
                          {order.address}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
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
                    </TableCell>
                    <TableCell>
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
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(order.status)}
                    </TableCell>
                    <TableCell>
                      {getUrgencyBadge(order.urgency)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {formatDate(order.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        <Eye className="h-4 w-4" />
                        Ko'rish
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredOrders.length === 0 && (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Buyurtmalar topilmadi</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 