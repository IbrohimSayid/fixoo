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

  useEffect(() => {
    if (typeof window !== "undefined" && window.Telegram) {
      const tgApp = window.Telegram.WebApp
      setTelegramApp(tgApp)

      // Telegram Mini App-ni kengaytirish
      tgApp.expand()

      // Foydalanuvchi ma'lumotlarini olish
      if (tgApp.initDataUnsafe?.user) {
        setUser(tgApp.initDataUnsafe.user)
      }

      // Mini App tayyor
      tgApp.ready()
      setIsReady(true)
    }
  }, [])

  return {
    telegramApp,
    user,
    isReady,
  }
}
