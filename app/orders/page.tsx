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
import { Clock, CheckCircle, XCircle } from "lucide-react"
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
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="new" className="relative">
              {getTranslation("newOrders", language)}
              {newOrders.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {newOrders.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="history">
              {getTranslation("ordersHistory", language)}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="new" className="mt-6">
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
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <Card>
              <CardHeader className="bg-primary/5 pb-4">
                <CardTitle>{getTranslation("allOrders", language)}</CardTitle>
              </CardHeader>
              <CardContent className="p-0 overflow-x-auto">
                {allOrders.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{getTranslation("clientName", language)}</TableHead>
                        <TableHead className="hidden md:table-cell">{getTranslation("description", language)}</TableHead>
                        <TableHead className="hidden md:table-cell">{getTranslation("date", language)}</TableHead>
                        <TableHead>{getTranslation("status", language)}</TableHead>
                        <TableHead>{getTranslation("contact", language)}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.clientName}</TableCell>
                          <TableCell className="hidden md:table-cell">{order.description}</TableCell>
                          <TableCell className="hidden md:table-cell">{formatDate(order.date)}</TableCell>
                          <TableCell>{getStatusBadge(order.status)}</TableCell>
                          <TableCell>
                            {order.status === "accepted" ? (
                              <span className="text-primary">{order.clientPhone}</span>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">{getTranslation("noNewOrders", language)}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <BottomNavigation language={language} />
    </div>
  )
}
