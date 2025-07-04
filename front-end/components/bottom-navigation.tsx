"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { PlusCircle, Search, ClipboardList, Settings, Home } from "lucide-react"
import { getTranslation } from "@/lib/i18n"
import { useEffect, useState } from "react"
import { getNewSpecialistOrders } from "@/lib/storage"
import { getUserData } from "@/lib/auth"

interface BottomNavigationProps {
  language: string
}

export default function BottomNavigation({ language }: BottomNavigationProps) {
  const pathname = usePathname()
  const [newOrdersCount, setNewOrdersCount] = useState(0)

  const isActive = (path: string) => {
    return pathname === path
  }

  useEffect(() => {
    const updateNotifications = () => {
      const user = getUserData()
      if (user && user.type === "specialist") {
        const newOrders = getNewSpecialistOrders(user.id)
        setNewOrdersCount(newOrders.length)
      }
    }

    updateNotifications()
    
    // Har 5 soniyada yangilanish
    const interval = setInterval(updateNotifications, 5000)
    
    return () => clearInterval(interval)
  }, [])

  const navItems = [
    {
      href: "/home",
      icon: Home,
      labelKey: "home",
      shortLabel: {
        uz: "Bosh sahifa",
        ru: "Главная",
        en: "Home",
        kz: "Басты бет",
        kg: "Башкы бет",
        kk: "Bas bet"
      }
    },
    {
      href: "/find-specialists",
      icon: Search,
      labelKey: "findSpecialists",
      shortLabel: {
        uz: "Qidirish",
        ru: "Поиск",
        en: "Search",
        kz: "Іздеу",
        kg: "Издөө",
        kk: "İzlew"
      }
    },
    {
      href: "/orders",
      icon: ClipboardList,
      labelKey: "ordersList",
      shortLabel: {
        uz: "Buyurtmalar",
        ru: "Заказы",
        en: "Orders",
        kz: "Тапсырыстар",
        kg: "Заказдар",
        kk: "Buyırtmalar"
      },
      hasNotification: true
    },
    {
      href: "/settings",
      icon: Settings,
      labelKey: "settings",
      shortLabel: {
        uz: "Sozlamalar",
        ru: "Настройки",
        en: "Settings",
        kz: "Баптаулар",
        kg: "Жөндөөлөр",
        kk: "Sazlawlar"
      }
    }
  ]

  return (
    <>
      {/* Mobile navigation - pastki qismida */}
      <div className="fixed bottom-0 left-0 right-0 bg-primary border-t border-primary-dark md:hidden z-40">
        <div className="grid grid-cols-4 items-center h-16">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center w-full h-full relative ${
                  isActive(item.href) ? "text-white" : "text-white/70"
                }`}
              >
                <Icon className="h-6 w-6" />
                <span className="text-xs mt-1">
                  {item.shortLabel[language as keyof typeof item.shortLabel] || getTranslation(item.labelKey, language)}
                </span>
                {item.hasNotification && newOrdersCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {newOrdersCount > 9 ? '9+' : newOrdersCount}
                  </span>
                )}
              </Link>
            )
          })}
        </div>
      </div>

      {/* Desktop navigation - yon tarafda */}
      <div className="fixed left-0 top-20 bottom-0 w-64 bg-white border-r border-gray-200 shadow-lg hidden md:flex md:flex-col z-40">
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Navigatsiya</h2>
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 relative ${
                    isActive(item.href) 
                      ? "bg-blue-50 text-blue-700 border-l-4 border-blue-700" 
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isActive(item.href) ? 'text-blue-700' : 'text-gray-400'}`} />
                  <span className="font-medium">
                    {item.shortLabel[language as keyof typeof item.shortLabel] || getTranslation(item.labelKey, language)}
                  </span>
                  {item.hasNotification && newOrdersCount > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
                      {newOrdersCount > 9 ? '9+' : newOrdersCount}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </>
  )
}
