// User interface
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password?: string;
  role: 'client' | 'specialist' | 'admin';
  profession?: string;
  address?: string;
  region?: string;
  district?: string;
  avatar?: string;
  isAvailable?: boolean;
  rating?: number;
  reviewCount?: number;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

// Order interface
export interface Order {
  id: string;
  clientId: string;
  specialistId?: string;
  title: string;
  description: string;
  profession: string;
  address: string;
  region: string;
  district?: string;
  price?: number;
  estimatedTime?: string;
  urgency: 'urgent' | 'normal' | 'flexible';
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  images: string[];
  clientNote?: string;
  specialistNote?: string;
  rating?: number;
  review?: string;
  createdAt: string;
  updatedAt: string;
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
}

// Statistics interface
export interface UserStats {
  totalUsers: number;
  totalSpecialists: number;
  totalClients: number;
  todayRegistered: number;
  todayDeleted: number;
}

export interface OrderStats {
  totalOrders: number;
  pendingOrders: number;
  acceptedOrders: number;
  inProgressOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  todayOrders: number;
  todayAccepted: number;
  todayCompleted: number;
}

export interface WeeklyStats {
  [date: string]: {
    orders: number;
    completed: number;
  };
}

// API Response interface
export interface APIResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

// Pagination interface
export interface Pagination {
  current: number;
  limit: number;
  total: number;
  pages: number;
}

// Dashboard data interface
export interface DashboardData {
  userStats: UserStats;
  orderStats: OrderStats;
  weeklyStats: WeeklyStats;
  recentOrders: Order[];
  recentUsers: User[];
}

// Filter interface
export interface Filters {
  page?: number;
  limit?: number;
  status?: string;
  role?: string;
  profession?: string;
  region?: string;
  search?: string;
} 