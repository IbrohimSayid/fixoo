import { getAuthToken } from './auth';

// API base URL
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://fixoo-server-f1rh.onrender.com';

// Helper function to make API calls with auth
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  
  const config: RequestInit = {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const response = await fetch(`${API_URL}/api${endpoint}`, config);
  return response.json();
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