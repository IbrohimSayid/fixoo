"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { PlusCircle, Search, ClipboardList, Settings, Home } from "lucide-react"
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
      }
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
    <div className="fixed bottom-0 left-0 right-0 bg-primary border-t border-primary-dark md:hidden z-40">
      <div className="grid grid-cols-4 items-center h-16">
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
