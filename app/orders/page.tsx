"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { checkUserAuthentication, getUserData, logout } from "@/lib/auth"
import { getTranslation, getStoredLanguage } from "@/lib/i18n"
import Header from "@/components/header"
import BottomNavigation from "@/components/bottom-navigation"
import { getSpecialistOrders, getNewSpecialistOrders, updateOrderStatus } from "@/lib/storage"
import { formatDistanceToNow } from "date-fns"
import { Clock, CheckCircle, XCircle, ShoppingBag, History, User, MapPin, Phone, ChevronRight } from "lucide-react"
import toast from 'react-hot-toast'
import HammerLoader from "@/components/hammer-loader"

export default function OrdersPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [language, setLanguage] = useState("uz")
  const [allOrders, setAllOrders] = useState<any[]>([])
  const [newOrders, setNewOrders] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState("new")
  const [lastNotificationCheck, setLastNotificationCheck] = useState(Date.now())

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

    // Load orders for this specialist
    loadOrders(userData.id)

    // Loading tugadi
    setIsLoading(false)

    // Auto-refresh har 10 soniyada
    const interval = setInterval(() => {
      loadOrders(userData.id)
    }, 10000)

    return () => clearInterval(interval)
  }, [router])

  const loadOrders = (specialistId: string) => {
    const allSpecialistOrders = getSpecialistOrders(specialistId)
    const newSpecialistOrders = getNewSpecialistOrders(specialistId)
    
    // Yangi buyurtmalar haqida bildirishnoma
    if (newSpecialistOrders.length > newOrders.length && Date.now() - lastNotificationCheck > 10000) {
      const newOrdersCount = newSpecialistOrders.length - newOrders.length
      toast.success(
        language === 'uz' ? `${newOrdersCount} ta yangi buyurtma keldi!` :
        language === 'ru' ? `Поступило ${newOrdersCount} новых заказов!` :
        `${newOrdersCount} new orders received!`
      )
      setLastNotificationCheck(Date.now())
    }
    
    setAllOrders(allSpecialistOrders)
    setNewOrders(newSpecialistOrders)
  }

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage)
  }

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const handleAcceptOrder = (orderId: string) => {
    const success = updateOrderStatus(orderId, "accepted")

    if (success) {
      toast.success(
        language === 'uz' ? "Buyurtma qabul qilindi! Mijoz bilan bog'lanishingiz mumkin." :
        language === 'ru' ? "Заказ принят! Вы можете связаться с клиентом." :
        "Order accepted! You can contact the client."
      )

      // Mijozga notification yuborish (localStorage orqali)
      const clientNotification = {
        id: Math.random().toString(36).substring(2, 15),
        type: 'order_accepted',
        message: language === 'uz' ? `${user.firstName} ${user.lastName} usta buyurtmangizni qabul qildi!` :
                 language === 'ru' ? `Специалист ${user.firstName} ${user.lastName} принял ваш заказ!` :
                 `Specialist ${user.firstName} ${user.lastName} accepted your order!`,
        orderId: orderId,
        timestamp: Date.now()
      }

      // Mijozga notification saqlash
      const order = allOrders.find(o => o.id === orderId) || newOrders.find(o => o.id === orderId)
      if (order) {
        const existingNotifications = JSON.parse(localStorage.getItem(`fixoo_notifications_${order.clientId}`) || '[]')
        localStorage.setItem(`fixoo_notifications_${order.clientId}`, JSON.stringify([...existingNotifications, clientNotification]))
      }

      loadOrders(user.id)
    }
  }

  const handleRejectOrder = (orderId: string) => {
    const success = updateOrderStatus(orderId, "rejected")

    if (success) {
      toast.success(
        language === 'uz' ? "Buyurtma rad etildi." :
        language === 'ru' ? "Заказ отклонен." :
        "Order rejected."
      )
      loadOrders(user.id)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-500">{getTranslation("pending", language)}</Badge>
      case "accepted":
        return <Badge className="bg-blue-500">{getTranslation("accepted", language)}</Badge>
      case "completed":
        return <Badge className="bg-green-500">{getTranslation("completed", language)}</Badge>
      case "rejected":
        return <Badge className="bg-red-500">{getTranslation("rejected", language)}</Badge>
      default:
        return <Badge>{status}</Badge>
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

  if (isLoading) {
    return <HammerLoader fullScreen={true} showText={true} text={getTranslation("loading", language) + "..."} />
  }

  return (
    <div className="min-h-screen bg-primary/5 pb-16 md:pb-0">
      <Header user={user} onLogout={handleLogout} language={language} onLanguageChange={handleLanguageChange} />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">{getTranslation("ordersList", language)}</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="new" className="relative text-xs sm:text-sm">
              <ShoppingBag className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">{getTranslation("newOrders", language)}</span>
              <span className="sm:hidden">Yangi</span>
              {newOrders.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {newOrders.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="history" className="text-xs sm:text-sm">
              <History className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">{getTranslation("ordersHistory", language)}</span>
              <span className="sm:hidden">Tarix</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="new" className="mt-6">
            {newOrders.length > 0 ? (
              <div className="space-y-4">
                {newOrders.map((order) => (
                  <Card key={order.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="p-4">
                        {/* Header info */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900">{order.clientName}</h3>
                              <div className="flex items-center text-xs text-gray-500">
                                <Clock className="w-3 h-3 mr-1" />
                                <span>{formatDate(order.date)}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Order details */}
                        <div className="space-y-2 mb-4">
                          <div className="flex items-start space-x-2">
                            <div className="w-4 h-4 mt-0.5 text-gray-400">
                              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                <path d="M9 12h6v2H9zm0-4h6v2H9zm0-4h6v2H9zM3 20V4h18v16H3z"/>
                              </svg>
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-gray-600 leading-relaxed">{order.description}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <p className="text-sm text-gray-600">{order.location}</p>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1"
                            onClick={() => handleRejectOrder(order.id)}
                          >
                            <XCircle className="h-4 w-4" />
                            <span className="hidden sm:inline">{getTranslation("reject", language)}</span>
                            <span className="sm:hidden">Rad</span>
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            className="flex items-center gap-1"
                            onClick={() => handleAcceptOrder(order.id)}
                          >
                            <CheckCircle className="h-4 w-4" />
                            <span className="hidden sm:inline">{getTranslation("accept", language)}</span>
                            <span className="sm:hidden">Qabul</span>
                          </Button>
                        </div>
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
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            {allOrders.length > 0 ? (
              <div className="space-y-4">
                {allOrders.map((order) => (
                  <Card key={order.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors duration-200">
                        <div className="flex items-center space-x-3 flex-1">
                          <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium text-gray-900 truncate">
                                {order.clientName}
                              </h3>
                              {getStatusBadge(order.status)}
                            </div>
                            
                            <p className="text-sm text-gray-600 truncate">
                              {order.description}
                            </p>
                            
                            <div className="flex items-center justify-between mt-1">
                              <div className="flex items-center text-xs text-gray-500">
                                <Clock className="w-3 h-3 mr-1" />
                                <span>{formatDate(order.date)}</span>
                              </div>
                              
                              {order.status === "accepted" && (
                                <div className="flex items-center text-xs text-primary">
                                  <Phone className="w-3 h-3 mr-1" />
                                  <span>{order.clientPhone}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <ChevronRight className="w-5 h-5 text-gray-400 ml-4" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <History className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">{getTranslation("noNewOrders", language)}</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <BottomNavigation language={language} />
    </div>
  )
}
