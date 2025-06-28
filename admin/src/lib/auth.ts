// Admin authentication utility functions

export interface AdminUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: string;
  isSuperAdmin: boolean;
  createdAt: string;
}

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const token = localStorage.getItem('fixoo_admin_token');
  const user = localStorage.getItem('fixoo_admin_user');
  
  return !!(token && user);
};

// Get current admin user
export const getCurrentAdmin = (): AdminUser | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const userStr = localStorage.getItem('fixoo_admin_user');
    if (!userStr) return null;
    
    return JSON.parse(userStr);
  } catch (error) {
    console.error('Error parsing admin user:', error);
    return null;
  }
};

// Get auth token
export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  return localStorage.getItem('fixoo_admin_token');
};

// Logout function
export const logout = (): void => {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('fixoo_admin_token');
  localStorage.removeItem('fixoo_admin_user');
  
  // Refresh the page to redirect to login
  window.location.href = '/login';
};

// Check if current admin is super admin
export const isSuperAdmin = (): boolean => {
  const admin = getCurrentAdmin();
  return admin?.isSuperAdmin || false;
};

// Update admin data in localStorage
export const updateAdminToken = (updatedAdmin: AdminUser): void => {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem('fixoo_admin_user', JSON.stringify(updatedAdmin));
}; 