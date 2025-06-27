"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, LogOut, PlusCircle, ClipboardList, Settings, Search, Home } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import LanguageSwitcher from "@/components/language-switcher"
import { getTranslation } from "@/lib/i18n"
import { useMobile } from "@/hooks/use-mobile"
import { useState, useEffect } from "react"
import ConfirmModal from "@/components/confirm-modal"
import toast from 'react-hot-toast'
import { getNewSpecialistOrders } from "@/lib/storage"

type HeaderProps = {
  user: any
  onLogout: () => void
  language: string
  onLanguageChange: (language: string) => void
}

export default function Header({ user, onLogout, language, onLanguageChange }: HeaderProps) {
  const isMobile = useMobile()
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)
  const [newOrdersCount, setNewOrdersCount] = useState(0)

  useEffect(() => {
    const updateNotifications = () => {
      if (user && user.type === "specialist") {
        const newOrders = getNewSpecialistOrders(user.id)
        setNewOrdersCount(newOrders.length)
      }
    }

    updateNotifications()
    
    // Har 5 soniyada yangilanish
    const interval = setInterval(updateNotifications, 5000)
    
    return () => clearInterval(interval)
  }, [user])

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true)
  }

  const handleConfirmLogout = () => {
    toast.success(
      language === 'uz' ? "Xayr, ko'rishguncha!" :
      language === 'ru' ? "До свидания!" :
      "Goodbye, see you soon!"
    )
    onLogout()
    setIsLogoutModalOpen(false)
  }

  return (
    <>
      <header className="bg-primary text-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/home" className="text-2xl font-bold">
            Fixoo
          </Link>

          {isMobile ? (
            <div className="flex items-center gap-1">
              <LanguageSwitcher onLanguageChange={onLanguageChange} currentLanguage={language} />

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white h-8 w-8">
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="bg-primary text-white">
                  <div className="flex flex-col gap-4 mt-8">
                    {user.type === "specialist" && (
                      <>
                        <Link href="/home" className="text-white hover:text-white/80 flex items-center gap-2">
                          <Home className="h-4 w-4" />
                          <span>{getTranslation("home", language)}</span>
                        </Link>

                        <Link href="/find-specialists" className="text-white hover:text-white/80 flex items-center gap-2">
                          <Search className="h-4 w-4" />
                          <span>{getTranslation("findSpecialists", language)}</span>
                        </Link>

                        <Link href="/orders" className="text-white hover:text-white/80 flex items-center gap-2 relative">
                          <ClipboardList className="h-4 w-4" />
                          <span>{getTranslation("ordersList", language)}</span>
                          {newOrdersCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                              {newOrdersCount > 9 ? '9+' : newOrdersCount}
                            </span>
                          )}
                        </Link>
                      </>
                    )}

                    {user.type === "client" && (
                      <>
                        <Link href="/home" className="text-white hover:text-white/80 flex items-center gap-2">
                          <Home className="h-4 w-4" />
                          <span>{getTranslation("home", language)}</span>
                        </Link>

                        <Link href="/find-specialists" className="text-white hover:text-white/80 flex items-center gap-2">
                          <Search className="h-4 w-4" />
                          <span>{getTranslation("findSpecialists", language)}</span>
                        </Link>
                      </>
                    )}

                    <Link href="/settings" className="text-white hover:text-white/80 flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      <span>{getTranslation("settings", language)}</span>
                    </Link>

                    <Button
                      variant="destructive"
                      className="w-full flex items-center gap-2"
                      onClick={handleLogoutClick}
                    >
                      <LogOut className="h-4 w-4" />
                      {getTranslation("logout", language)}
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <LanguageSwitcher onLanguageChange={onLanguageChange} currentLanguage={language} />

              {user.type === "specialist" && (
                <>
                  <Link href="/home" className="text-white hover:text-white/80 flex items-center gap-1 text-sm">
                    <Home className="h-4 w-4" />
                    <span>{getTranslation("home", language)}</span>
                  </Link>

                  <Link href="/find-specialists" className="text-white hover:text-white/80 flex items-center gap-1 text-sm">
                    <Search className="h-4 w-4" />
                    <span>{getTranslation("findSpecialists", language)}</span>
                  </Link>

                  <Link href="/orders" className="text-white hover:text-white/80 flex items-center gap-1 relative text-sm">
                    <ClipboardList className="h-4 w-4" />
                    <span>{getTranslation("ordersList", language)}</span>
                    {newOrdersCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                        {newOrdersCount > 9 ? '9+' : newOrdersCount}
                      </span>
                    )}
                  </Link>
                </>
              )}

              {user.type === "client" && (
                <>
                  <Link href="/home" className="text-white hover:text-white/80 flex items-center gap-1 text-sm">
                    <Home className="h-4 w-4" />
                    <span>{getTranslation("home", language)}</span>
                  </Link>

                  <Link href="/find-specialists" className="text-white hover:text-white/80 flex items-center gap-1 text-sm">
                    <Search className="h-4 w-4" />
                    <span>{getTranslation("findSpecialists", language)}</span>
                  </Link>
                </>
              )}

              <Link href="/settings" className="text-white hover:text-white/80 flex items-center gap-1 text-sm">
                <Settings className="h-4 w-4" />
                <span>{getTranslation("settings", language)}</span>
              </Link>

              <Button variant="destructive" size="sm" className="text-white flex items-center gap-1 h-8 px-3" onClick={handleLogoutClick}>
                <LogOut className="h-4 w-4" />
                <span className="text-xs">{getTranslation("logout", language)}</span>
              </Button>
            </div>
          )}
        </div>
      </header>

      <ConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
        title={getTranslation("logoutConfirmTitle", language)}
        description={getTranslation("logoutConfirmDescription", language)}
        language={language}
      />
    </>
  )
}
