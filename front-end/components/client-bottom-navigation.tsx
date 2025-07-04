"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ClipboardList, Settings, Home, Search } from "lucide-react"
import { getTranslation } from "@/lib/i18n"

interface ClientBottomNavigationProps {
  language: string
}

export default function ClientBottomNavigation({ language }: ClientBottomNavigationProps) {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
  }

  const navItems = [
    {
      href: "/home",
      icon: Home,
      labelKey: "home",
      label: {
        uz: "Bosh sahifa",
        ru: "Главная",
        en: "Home"
      }
    },
    {
      href: "/find-specialists",
      icon: Search,
      labelKey: "findSpecialists",
      label: {
        uz: "Qidirish",
        ru: "Поиск",
        en: "Search"
      }
    },
    {
      href: "/settings",
      icon: Settings,
      labelKey: "settings",
      label: {
        uz: "Sozlamalar",
        ru: "Настройки",
        en: "Settings"
      }
    }
  ]

  return (
    <>
      {/* Mobile navigation - pastki qismida */}
      <div className="fixed bottom-0 left-0 right-0 bg-primary border-t border-primary-dark md:hidden z-40">
        <div className="grid grid-cols-3 items-center h-16">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center w-full h-full ${
                  isActive(item.href) ? "text-white" : "text-white/70"
                }`}
              >
                <Icon className="h-6 w-6" />
                <span className="text-xs mt-1">{getTranslation(item.labelKey, language)}</span>
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
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive(item.href) 
                      ? "bg-blue-50 text-blue-700 border-l-4 border-blue-700" 
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isActive(item.href) ? 'text-blue-700' : 'text-gray-400'}`} />
                  <span className="font-medium">
                    {item.label[language as keyof typeof item.label] || getTranslation(item.labelKey, language)}
                  </span>
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </>
  )
}
