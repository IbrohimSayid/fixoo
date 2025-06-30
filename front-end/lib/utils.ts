import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// API Base URL
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://fixoo-server-f1rh.onrender.com/api' 
  : 'http://localhost:5000/api'

// Auth token olish
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('fixoo_token')
  }
  return null
}

// API call helper
export async function apiCall(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const finalOptions = { ...defaultOptions, ...options };
  
  try {
    const response = await fetch(url, finalOptions);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// User API functions
export const userAPI = {
  // Usta registratsiyasi
  registerSpecialist: async (userData: {
    firstName: string;
    lastName: string;
    email?: string;
    phone: string;
    profession: string;
    address: string;
    region: string;
    district?: string;
    password: string;
  }) => {
    return apiCall('/auth/register/specialist', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Mijoz registratsiyasi
  registerClient: async (userData: {
    firstName: string;
    lastName: string;
    email?: string;
    phone: string;
    address?: string;
    region?: string;
    district?: string;
    password: string;
  }) => {
    return apiCall('/auth/register/client', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // User ro'yxatdan o'tkazish (eski, umumiy)
  register: async (userData: {
    firstName: string;
    lastName: string;
    email?: string;
    phone: string;
    role: 'client' | 'specialist';
    profession?: string;
    address?: string;
    region?: string;
    district?: string;
    password: string;
  }) => {
    // Rolga qarab to'g'ri endpoint'ga yo'naltirish
    if (userData.role === 'specialist') {
      return userAPI.registerSpecialist({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phone: userData.phone,
        profession: userData.profession!,
        address: userData.address!,
        region: userData.region!,
        district: userData.district,
        password: userData.password,
      });
    } else {
      // Mijozlar uchun faqat zarur maydonlarni yuborish
      return userAPI.registerClient({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phone: userData.phone,
        password: userData.password,
      });
    }
  },

  // Usta login
  loginSpecialist: async (credentials: {
    emailOrPhone: string;
    password: string;
  }) => {
    return apiCall('/auth/login/specialist', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  // Mijoz login
  loginClient: async (credentials: {
    emailOrPhone: string;
    password: string;
  }) => {
    return apiCall('/auth/login/client', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  // User login (umumiy)
  login: async (credentials: {
    emailOrPhone: string;
    password: string;
  }) => {
    return apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  // User profile update
  updateProfile: async (userData: any, token: string) => {
    return apiCall('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  // Get user profile
  getProfile: async (token: string) => {
    return apiCall('/auth/profile', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  // Ustalarni qidirish
  searchSpecialists: async (searchData: {
    profession: string;
    region: string;
    district: string;
    firstName?: string;
    lastName?: string;
  }) => {
    return apiCall('/users/specialists/search', {
      method: 'POST',
      body: JSON.stringify(searchData),
    });
  },
};

// Order API functions
export const orderAPI = {
  // Yangi buyurtma yaratish
  create: async (orderData: {
    title: string;
    description: string;
    profession: string;
    address: string;
    region: string;
    district?: string;
    price?: number;
    estimatedTime?: string;
    urgency: 'urgent' | 'normal' | 'flexible';
    images?: string[];
    clientNote?: string;
  }, token: string) => {
    return apiCall('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  // Foydalanuvchi buyurtmalarini olish
  getUserOrders: async (token: string) => {
    return apiCall('/orders', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  // Pending buyurtmalarni olish (ustalar uchun)
  getPendingOrders: async (token: string) => {
    return apiCall('/orders/pending', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  // Buyurtmani qabul qilish
  acceptOrder: async (orderId: string, data: {
    specialistNote?: string;
    estimatedPrice?: number;
  }, token: string) => {
    return apiCall(`/orders/${orderId}/accept`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  // Buyurtma holatini yangilash
  updateStatus: async (orderId: string, status: string, token: string) => {
    return apiCall(`/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  // Bitta buyurtmani o'chirish
  deleteOrder: async (orderId: string) => {
    return apiCall(`/orders/${orderId}`, {
      method: 'DELETE',
    });
  },

  // Bir necha buyurtmani o'chirish
  bulkDeleteOrders: async (data: {
    period?: '1day' | '1week' | '1month' | 'all';
    orderIds?: string[];
  }) => {
    return apiCall('/orders/history/bulk', {
      method: 'DELETE',
      body: JSON.stringify(data),
    });
  },
};

// Avatar API
export const avatarAPI = {
  // Avatar yuklash
  uploadAvatar: async (file: File) => {
    const formData = new FormData()
    formData.append('avatar', file)
    
    const response = await fetch(`${API_BASE_URL}/users/upload-avatar`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: formData
    })
    
    return response.json()
  },

  // Avatar o'chirish
  removeAvatar: async () => {
    const response = await fetch(`${API_BASE_URL}/users/remove-avatar`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json'
      }
    })
    
    return response.json()
  }
}
