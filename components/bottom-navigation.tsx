"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { PlusCircle, Search, ClipboardList, Settings } from "lucide-react"
import { getTranslation } from "@/lib/i18n"

interface BottomNavigationProps {
  language: string
}

export default function BottomNavigation({ language }: BottomNavigationProps) {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
  }

  const navItems = [
    {
      href: "/new-orders",
      icon: PlusCircle,
      labelKey: "newOrders",
      shortLabel: {
        uz: "Yangi",
        ru: "Новые",
        en: "New"
      }
    },
    {
      href: "/find-specialists",
      icon: Search,
      labelKey: "findSpecialists",
      shortLabel: {
        uz: "Qidirish",
        ru: "Поиск",
        en: "Search"
      }
    },
    {
      href: "/orders",
      icon: ClipboardList,
      labelKey: "ordersList",
      shortLabel: {
        uz: "Buyurtmalar",
        ru: "Заказы",
        en: "Orders"
      }
    },
    {
      href: "/settings",
      icon: Settings,
      labelKey: "settings",
      shortLabel: {
        uz: "Sozlamalar",
        ru: "Настройки",
        en: "Settings"
      }
    }
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-primary border-t border-primary-dark md:hidden z-40">
      <div className="flex justify-around items-center h-16">
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
              <span className="text-xs mt-1">
                {item.shortLabel[language as keyof typeof item.shortLabel] || getTranslation(item.labelKey, language)}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
