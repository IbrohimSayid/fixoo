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
  ShoppingCart,
  ChevronDown
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

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
        <div className="min-h-screen bg-gray-50">
          {/* Navbar */}
          <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg border-b border-gray-200">
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                {/* Logo va navigation */}
                <div className="flex">
                  {/* Logo */}
                  <div className="flex-shrink-0 flex items-center">
                    <div className="flex items-center">
                      <div className="bg-blue-600 rounded-lg p-2">
                        <Shield className="h-6 w-6 text-white" />
                      </div>
                      <span className="ml-3 text-xl font-bold text-gray-900">Fixoo Admin</span>
                    </div>
                  </div>

                  {/* Desktop navigation */}
                  <div className="hidden md:ml-10 md:flex md:space-x-1">
                    {navigation.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <a
                          key={item.name}
                          href={item.href}
                          className={`group inline-flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                            isActive
                              ? 'bg-blue-50 text-blue-700'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          }`}
                        >
                          <item.icon className={`mr-2 h-4 w-4 ${isActive ? 'text-blue-700' : 'text-gray-400 group-hover:text-gray-500'}`} />
                          {item.name}
                        </a>
                      );
                    })}
                  </div>
                </div>

                {/* Profile dropdown */}
                <div className="hidden md:flex md:items-center md:space-x-4">
                  <div className="relative">
                    <button
                      onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                      className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <div className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="bg-blue-600 rounded-full p-2 mr-3">
                          <Users className="h-4 w-4 text-white" />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-semibold text-gray-900">
                            {admin.firstName} {admin.lastName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {admin.isSuperAdmin ? 'Bosh Admin' : 'Admin'}
                          </p>
                        </div>
                        <ChevronDown className="ml-2 h-4 w-4 text-gray-400" />
                      </div>
                    </button>

                    {/* Dropdown menu */}
                    {profileDropdownOpen && (
                      <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                        <div className="py-1">
                          <button
                            onClick={handleLogout}
                            className="group flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                          >
                            <LogOut className="mr-3 h-4 w-4 text-gray-400 group-hover:text-red-600" />
                            Chiqish
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Mobile menu button */}
                <div className="flex items-center md:hidden">
                  <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                  >
                    {mobileMenuOpen ? (
                      <X className="block h-6 w-6" />
                    ) : (
                      <Menu className="block h-6 w-6" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile menu */}
            {mobileMenuOpen && (
              <div className="md:hidden bg-white border-t border-gray-200">
                <div className="pt-2 pb-3 space-y-1">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <a
                        key={item.name}
                        href={item.href}
                        className={`block pl-3 pr-4 py-2 text-base font-medium ${
                          isActive
                            ? 'bg-blue-50 border-l-4 border-blue-500 text-blue-700'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <div className="flex items-center">
                          <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-blue-700' : 'text-gray-400'}`} />
                          {item.name}
                        </div>
                      </a>
                    );
                  })}
                </div>
                <div className="pt-4 pb-3 border-t border-gray-200">
                  <div className="flex items-center px-4">
                    <div className="bg-blue-600 rounded-full p-2">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-gray-800">
                        {admin.firstName} {admin.lastName}
                      </div>
                      <div className="text-sm font-medium text-gray-500">
                        {admin.isSuperAdmin ? 'Bosh Admin' : 'Admin'}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1">
                    <button
                      onClick={handleLogout}
                      className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 w-full text-left"
                    >
                      Chiqish
                    </button>
                  </div>
                </div>
              </div>
            )}
          </nav>

          {/* Main content */}
          <div className="pt-16">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
