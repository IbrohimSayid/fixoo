"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Loader from "@/components/loader"
import { checkUserAuthentication } from "@/lib/auth"
import { useTelegram } from "@/hooks/use-telegram"

export default function Home() {
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { telegramApp, user, isReady } = useTelegram()

  useEffect(() => {
    // Telegram Mini App-dan kelgan foydalanuvchi ma'lumotlarini tekshirish
    if (isReady && user) {
      console.log("Telegram user:", user)
      // Bu yerda Telegram foydalanuvchisi ma'lumotlarini saqlash yoki tekshirish mumkin
    }

    // Show loader for at least 3.5 seconds to allow for the animation
    const timer = setTimeout(() => {
      setLoading(false)

      // Check if user is authenticated
      const isAuthenticated = checkUserAuthentication()

      if (isAuthenticated) {
        router.push("/home")
      } else {
        router.push("/signup")
      }
    }, 3500)

    return () => clearTimeout(timer)
  }, [router, isReady, user])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-primary">{loading && <Loader />}</main>
  )
}
