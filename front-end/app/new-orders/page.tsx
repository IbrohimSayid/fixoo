"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { checkUserAuthentication, getUserData, logout } from "@/lib/auth"
import { getTranslation, getStoredLanguage } from "@/lib/i18n"
import Header from "@/components/header"
import BottomNavigation from "@/components/bottom-navigation"
import { Clock, CheckCircle, XCircle } from "lucide-react"
import { getNewSpecialistOrders, updateOrderStatus } from "@/lib/storage"
import { formatDistanceToNow } from "date-fns"
import toast from 'react-hot-toast'

export default function NewOrdersPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [language, setLanguage] = useState("uz")
  const [newOrders, setNewOrders] = useState<any[]>([])

  useEffect(() => {
    const isAuthenticated = checkUserAuthentication()

    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    const userData = getUserData()
    if (userData?.type !== "specialist") {
      router.push("/home")
      return
    }

    setUser(userData)

    // Get stored language
    const storedLanguage = getStoredLanguage()
    setLanguage(storedLanguage)

    // Load new orders for this specialist
    loadNewOrders(userData.id)
  }, [router])

  const loadNewOrders = (specialistId: string) => {
    const orders = getNewSpecialistOrders(specialistId)
    setNewOrders(orders)
  }

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage)
  }

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const handleAcceptOrder = (orderId: string) => {
    // Update the order status in localStorage
    const success = updateOrderStatus(orderId, "accepted")

    if (success) {
      toast.success(
        language === 'uz' ? "Buyurtma qabul qilindi! Mijoz bilan bog'lanishingiz mumkin." :
        language === 'ru' ? "Заказ принят! Вы можете связаться с клиентом." :
        "Order accepted! You can contact the client."
      )
      // Update the UI
      loadNewOrders(user.id)
    }
  }

  const handleRejectOrder = (orderId: string) => {
    // Update the order status in localStorage
    const success = updateOrderStatus(orderId, "rejected")

    if (success) {
      toast.success(
        language === 'uz' ? "Buyurtma rad etildi." :
        language === 'ru' ? "Заказ отклонен." :
        "Order rejected."
      )
      // Update the UI
      loadNewOrders(user.id)
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return formatDistanceToNow(date, { addSuffix: true })
    } catch (error) {
      return dateString
    }
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-primary text-white">
        {getTranslation("loading", language)}...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-primary/5 pb-16 md:pb-0">
      <Header user={user} onLogout={handleLogout} language={language} onLanguageChange={handleLanguageChange} />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">{getTranslation("newOrders", language)}</h1>

        {newOrders.length > 0 ? (
          <div className="space-y-4">
            {newOrders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <CardHeader className="bg-primary/5 pb-4">
                  <CardTitle className="flex justify-between items-center">
                    <span>{order.clientName}</span>
                    <div className="flex items-center text-sm font-normal">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{formatDate(order.date)}</span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-2 mb-4">
                    <p>
                      <strong>{getTranslation("description", language)}:</strong> {order.description}
                    </p>
                    <p>
                      <strong>{getTranslation("jobLocation", language)}:</strong> {order.location}
                    </p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => handleRejectOrder(order.id)}
                    >
                      <XCircle className="h-4 w-4" />
                      {getTranslation("reject", language)}
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => handleAcceptOrder(order.id)}
                    >
                      <CheckCircle className="h-4 w-4" />
                      {getTranslation("accept", language)}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500">{getTranslation("noNewOrders", language)}</p>
          </div>
        )}
      </main>

      <BottomNavigation language={language} />
    </div>
  )
}
