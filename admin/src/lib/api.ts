import { getAuthToken } from './auth';

// API base URL
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://fixoo-server-f1rh.onrender.com';

// Server uyg'otish funksiyasi
const wakeUpServer = async () => {
  try {
    const response = await fetch(`${API_URL}/health`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    return response.ok;
  } catch (error) {
    console.log('Server uyg\'otishda xatolik:', error);
    return false;
  }
};

// Retry logic bilan API call
const apiCallWithRetry = async (endpoint: string, options: RequestInit = {}, retries = 3) => {
  const token = getAuthToken();

  for (let attempt = 1; attempt <= retries; attempt++) {
    // Har bir so'rov uchun yangi AbortController
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 sekund timeout
  
  const config: RequestInit = {
    ...options,
    credentials: 'include',
      signal: controller.signal,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

    try {
      const response = await fetch(`${API_URL}${endpoint}`, config);
      clearTimeout(timeoutId); // Timeout'ni bekor qilish
      
      if (response.ok) {
        return response.json();
      }
      
      // Rate limiting (429) yoki server xatolarida
      if (response.status === 429 || response.status === 503 || response.status === 502) {
        console.log(`API so'rov muvaffaqiyatsiz (${response.status}), ${attempt}/${retries} harakat...`);
        
        if (attempt < retries) {
          console.log('Serverni uyg\'otishga harakat qilmoqda...');
          await wakeUpServer();
          // Rate limiting uchun ko'proq kutish
          const waitTime = response.status === 429 ? 5000 : 2000;
          await new Promise(resolve => setTimeout(resolve, waitTime));
          continue;
        }
      }
      
  return response.json();
    } catch (error: any) {
      clearTimeout(timeoutId); // Timeout'ni bekor qilish
      console.log(`API xatosi (${attempt}/${retries}):`, error.message);
      
      if (attempt < retries) {
        // Network error yoki timeout bo'lsa, retry qilish
        if (error.name === 'TypeError' || error.name === 'AbortError' || error.message.includes('fetch')) {
          console.log('Serverni uyg\'otishga harakat qilmoqda...');
          await wakeUpServer();
          await new Promise(resolve => setTimeout(resolve, 3000)); // 3 sekund kutish
          continue;
        }
      }
      
      if (attempt === retries) {
        throw new Error(`Server bilan aloqa o'rnatilmadi. Iltimos, qayta urinib ko'ring.`);
      }
    }
  }
};

// Helper function to make API calls with auth (old function updated)
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  return apiCallWithRetry(endpoint, options);
};

// API functions
export const authAPI = {
  adminLogin: (firstName: string, lastName: string, password: string) => 
    fetch(`${API_URL}/api/auth/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ firstName, lastName, password }),
    }).then(res => res.json()),
  
  adminLogout: () => apiCall('/auth/admin/logout', {
    method: 'POST',
  }),
};

export const usersAPI = {
  getAll: () => apiCall('/users?showPasswords=true&limit=5000'),
  getById: (id: string) => apiCall(`/users/${id}`),
  getAdmins: () => apiCall('/users/admins'),
  createAdmin: (adminData: any) => apiCall('/users/admins', {
    method: 'POST',
    body: JSON.stringify(adminData),
  }),
  deleteAdmin: (id: string) => apiCall(`/users/admins/${id}`, {
    method: 'DELETE',
  }),
  createSuperAdmin: () => apiCall('/users/create-super-admin', {
    method: 'POST',
  }),
  updateAdminProfile: (id: string, updateData: any) => apiCall(`/users/admins/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updateData),
  }),
  blockUser: (id: string, isBlocked: boolean) => apiCall(`/users/${id}/block`, {
    method: 'PUT',
    body: JSON.stringify({ isBlocked }),
  }),
  deleteUser: (id: string) => apiCall(`/users/${id}`, {
    method: 'DELETE',
  }),
};

export const ordersAPI = {
  getAll: () => apiCall('/orders'),
  getById: (id: string) => apiCall(`/orders/${id}`),
  getStats: () => apiCall('/orders/stats/overview'),
  getByDate: (date: string) => apiCall(`/orders/stats/by-date/${date}`),
  getByDateRange: (startDate: string, endDate: string) => 
    apiCall(`/orders/stats/by-range?startDate=${startDate}&endDate=${endDate}`),
  getChartData: (days: number = 30) => apiCall(`/orders/stats/chart?days=${days}`),
  updateStatus: (id: string, status: string) => apiCall(`/orders/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  }),
  deleteOrder: (id: string) => apiCall(`/orders/${id}`, {
    method: 'DELETE',
  }),
};

export default apiCall; 