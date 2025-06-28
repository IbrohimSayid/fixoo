"use client"

import { useEffect, useState } from "react"

interface TelegramWebApp {
  ready: () => void
  expand: () => void
  close: () => void
  initData: string
  initDataUnsafe: {
    query_id: string
    user: {
      id: number
      first_name: string
      last_name?: string
      username?: string
      language_code?: string
    }
    auth_date: string
    hash: string
  }
  colorScheme: "light" | "dark"
  themeParams: {
    bg_color: string
    text_color: string
    hint_color: string
    link_color: string
    button_color: string
    button_text_color: string
  }
  onEvent: (eventType: string, eventHandler: Function) => void
  offEvent: (eventType: string, eventHandler: Function) => void
  sendData: (data: any) => void
  MainButton: {
    text: string
    color: string
    textColor: string
    isVisible: boolean
    isActive: boolean
    isProgressVisible: boolean
    setText: (text: string) => void
    onClick: (callback: Function) => void
    offClick: (callback: Function) => void
    show: () => void
    hide: () => void
    enable: () => void
    disable: () => void
    showProgress: (leaveActive: boolean) => void
    hideProgress: () => void
  }
  BackButton: {
    isVisible: boolean
    onClick: (callback: Function) => void
    offClick: (callback: Function) => void
    show: () => void
    hide: () => void
  }
  HapticFeedback: {
    impactOccurred: (style: "light" | "medium" | "heavy" | "rigid" | "soft") => void
    notificationOccurred: (type: "error" | "success" | "warning") => void
    selectionChanged: () => void
  }
}

declare global {
  interface Window {
    Telegram: {
      WebApp: TelegramWebApp
    }
  }
}

export function useTelegram() {
  const [telegramApp, setTelegramApp] = useState<TelegramWebApp | null>(null)
  const [user, setUser] = useState<any>(null)
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let attempts = 0
    const maxAttempts = 50 // 5 soniya kutish (50 * 100ms)

    // DOM yuklangandan keyin tekshirish
    const initTelegram = () => {
      try {
        if (typeof window !== "undefined" && window.Telegram?.WebApp) {
          const tgApp = window.Telegram.WebApp
          setTelegramApp(tgApp)

          // Xavfsiz usulda expand qilish
          if (typeof tgApp.expand === 'function') {
            tgApp.expand()
          }

          // Foydalanuvchi ma'lumotlarini xavfsiz olish
          if (tgApp.initDataUnsafe?.user) {
            setUser(tgApp.initDataUnsafe.user)
          }

          // Mini App tayyor
          if (typeof tgApp.ready === 'function') {
            tgApp.ready()
          }
          
          setIsReady(true)
        } else {
          attempts++
          if (attempts < maxAttempts) {
            // Telegram Web App hali yuklanmagan, yana kutamiz
            setTimeout(initTelegram, 100)
          } else {
            // Script yuklanmadi, browser mode
            console.warn('Telegram WebApp script not loaded, running in browser mode')
            setError('Telegram WebApp not available')
            setIsReady(true)
          }
        }
      } catch (err) {
        console.warn('Telegram WebApp initialization error:', err)
        setError('Telegram WebApp not available')
        setIsReady(true) // Normal browser muhitida ham ishlashi uchun
      }
    }

    // DOM tayyor bo'lgandan keyin boshlash
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initTelegram)
    } else {
      initTelegram()
    }

    return () => {
      document.removeEventListener('DOMContentLoaded', initTelegram)
    }
  }, [])

  return {
    telegramApp,
    user,
    isReady,
    error,
  }
}
