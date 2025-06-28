'use client';

import { Inter } from 'next/font/google';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Settings,
  Shield,
  LogOut,
  Menu,
  X,
  ShoppingCart
} from 'lucide-react';
import { isAuthenticated, getCurrentAdmin, logout, AdminUser } from '@/lib/auth';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Buyurtmalar', href: '/orders', icon: ShoppingCart },
  { name: 'Foydalanuvchilar', href: '/users', icon: Users },
  { name: 'Adminlar', href: '/admins', icon: Shield },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Login page uchun auth check qilmaymiz
    if (pathname === '/login') {
      return;
    }

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
  }, [pathname, router]);

  const handleLogout = () => {
    logout();
  };

  // Login page uchun alohida layout
  if (pathname === '/login') {
    return (
      <html lang="uz">
        <body className={inter.className}>
          {children}
        </body>
      </html>
    );
  }

  // Admin panelni ko'rsatish faqat authenticated bo'lganda
  if (!admin) {
    return (
      <html lang="uz">
        <body className={inter.className}>
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Yuklanmoqda...</p>
            </div>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="uz">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50 flex">
          {/* Sidebar - Fixed width and height */}
          <div className={`fixed inset-y-0 left-0 z-50 w-80 bg-gradient-to-b from-gray-900 to-gray-800 shadow-xl transform ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-0 flex flex-col`}>
            
            {/* Header */}
            <div className="flex items-center justify-between h-16 px-6 bg-gray-800 border-b border-gray-700">
              <div className="flex items-center">
                <div className="bg-blue-600 rounded-lg p-2">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <span className="ml-3 text-xl font-bold text-white">Fixoo Admin</span>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <item.icon className={`mr-4 h-5 w-5 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
                    <span className="font-medium">{item.name}</span>
                  </a>
                );
              })}
            </nav>
            
            {/* Admin info va logout */}
            <div className="border-t border-gray-700 p-4">
              <div className="flex items-center mb-4 p-3 bg-gray-800 rounded-lg">
                <div className="bg-blue-600 rounded-full p-2.5">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-semibold text-white">
                    {admin.firstName} {admin.lastName}
                  </p>
                  <p className="text-xs text-gray-400">
                    {admin.isSuperAdmin ? 'Bosh Admin' : 'Admin'}
                  </p>
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                className="group flex items-center w-full px-4 py-3 text-sm font-medium text-gray-300 rounded-lg hover:bg-red-600 hover:text-white transition-all duration-200"
              >
                <LogOut className="mr-4 h-5 w-5 text-gray-400 group-hover:text-white" />
                <span>Chiqish</span>
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden fixed top-0 left-0 right-0 z-40">
            <div className="bg-white shadow-sm border-b">
              <div className="flex items-center justify-between h-16 px-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <Menu className="h-6 w-6" />
                </button>
                <h1 className="text-lg font-semibold text-gray-900">Fixoo Admin</h1>
                <div className="w-6"></div>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 lg:ml-0 min-h-screen">
            <div className="pt-16 lg:pt-0 h-full">
              <div className="h-full">
                {children}
              </div>
            </div>
          </div>

          {/* Mobile overlay */}
          {sidebarOpen && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            ></div>
          )}
        </div>
      </body>
    </html>
  );
}
