"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ClipboardList, Settings } from "lucide-react"
import { getTranslation } from "@/lib/i18n"

interface ClientBottomNavigationProps {
  language: string
}

export default function ClientBottomNavigation({ language }: ClientBottomNavigationProps) {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-primary border-t border-primary-dark md:hidden z-40">
      <div className="flex justify-around items-center h-16">
        <Link
          href="/client-orders"
          className={`flex flex-col items-center justify-center w-full h-full ${
            isActive("/client-orders") ? "text-white" : "text-white/70"
          }`}
        >
          <ClipboardList className="h-6 w-6" />
          <span className="text-xs mt-1">{getTranslation("ordersList", language)}</span>
        </Link>

        <Link
          href="/settings"
          className={`flex flex-col items-center justify-center w-full h-full ${
            isActive("/settings") ? "text-white" : "text-white/70"
          }`}
        >
          <Settings className="h-6 w-6" />
          <span className="text-xs mt-1">{getTranslation("settings", language)}</span>
        </Link>
      </div>
    </div>
  )
}
