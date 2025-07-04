"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { checkUserAuthentication, getUserData, logout } from "@/lib/auth"
import { getTranslation, getStoredLanguage } from "@/lib/i18n"
import Header from "@/components/header"
import BottomNavigation from "@/components/bottom-navigation"
import { getSpecialistOrders, getNewSpecialistOrders, updateOrderStatus } from "@/lib/storage"
import { orderAPI } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import { Clock, CheckCircle, XCircle, ShoppingBag, History, User, MapPin, Phone, ChevronRight, Trash2, ChevronDown, Calendar, Star, Package } from "lucide-react"
import toast from 'react-hot-toast'
import HammerLoader from "@/components/hammer-loader"

export default function OrdersPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [language, setLanguage] = useState("uz")
  const [myOrders, setMyOrders] = useState<any[]>([])
  const [pendingOrders, setPendingOrders] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState("my")
  const [isUpdating, setIsUpdating] = useState<string | null>(null)

  useEffect(() => {
    const isAuthenticated = checkUserAuthentication()

    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    const userData = getUserData()
    if (!userData) {
      router.push("/login")
      return
    }

    setUser(userData)

    // Get stored language
    const storedLanguage = getStoredLanguage()
    setLanguage(storedLanguage)

    // Load orders
    loadOrders()

    setIsLoading(false)
  }, [router])

  const loadOrders = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      // Mijozlar uchun o'z buyurtmalari, ustalar uchun pending va o'zlari qabul qilgan
      if (user?.role === 'client') {
        const ordersResult = await orderAPI.getUserOrders(token)
        if (ordersResult.success) {
          setMyOrders(ordersResult.data.orders || [])
        }
      } else if (user?.role === 'specialist') {
        // O'z buyurtmalari (qabul qilgan)
        const myOrdersResult = await orderAPI.getUserOrders(token)
        if (myOrdersResult.success) {
          setMyOrders(myOrdersResult.data.orders || [])
        }

        // Pending buyurtmalar (boshqalardan)
        const pendingResult = await orderAPI.getPendingOrders(token)
        if (pendingResult.success) {
          setPendingOrders(pendingResult.data.orders || [])
        }
      }
    } catch (error: any) {
      console.error('Load orders error:', error)
      if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        router.push('/login')
      }
    }
  }

  const handleAcceptOrder = async (orderId: string) => {
    if (!user || user.role !== 'specialist') return

    setIsUpdating(orderId)
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const response = await fetch(`${process.env.NODE_ENV === 'production' 
        ? 'https://fixoo-server-f1rh.onrender.com' 
        : 'http://localhost:5000'}/api/orders/${orderId}/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          specialistNote: "Buyurtma qabul qilindi"
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast.success('Buyurtma muvaffaqiyatli qabul qilindi!')
        loadOrders() // Refresh orders
      } else {
        toast.error(result.message || 'Xatolik yuz berdi')
      }
    } catch (error: any) {
      console.error('Accept order error:', error)
      toast.error('Server bilan bog\'lanishda xatolik')
    } finally {
      setIsUpdating(null)
    }
  }

  const handleUpdateStatus = async (orderId: string, status: string) => {
    setIsUpdating(orderId)
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const response = await fetch(`${process.env.NODE_ENV === 'production' 
        ? 'https://fixoo-server-f1rh.onrender.com' 
        : 'http://localhost:5000'}/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      })

      const result = await response.json()

      if (result.success) {
        toast.success('Holat yangilandi!')
        loadOrders() // Refresh orders
      } else {
        toast.error(result.message || 'Xatolik yuz berdi')
      }
    } catch (error: any) {
      console.error('Update status error:', error)
      toast.error('Server bilan bog\'lanishda xatolik')
    } finally {
      setIsUpdating(null)
    }
  }

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push("/login")
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Kutilmoqda</Badge>
      case "accepted":
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Qabul qilingan</Badge>
      case "in_progress":
        return <Badge variant="secondary" className="bg-purple-100 text-purple-800">Jarayonda</Badge>
      case "completed":
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Bajarilgan</Badge>
      case "cancelled":
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Bekor qilingan</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
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
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      <Header user={user} onLogout={handleLogout} language={language} onLanguageChange={handleLanguageChange} />

      <main className="main-content container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">
          {user?.role === 'client' ? 'Mening buyurtmalarim' : 'Buyurtmalar'}
        </h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className={`grid w-full ${user?.role === 'specialist' ? 'grid-cols-2' : 'grid-cols-1'} mb-6`}>
            <TabsTrigger value="my" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              {user?.role === 'client' ? 'Mening buyurtmalarim' : 'Qabul qilganlarim'}
            </TabsTrigger>
            {user?.role === 'specialist' && (
              <TabsTrigger value="pending" className="flex items-center gap-2 relative">
                <Clock className="w-4 h-4" />
                Yangi buyurtmalar
                {pendingOrders.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {pendingOrders.length}
                </span>
              )}
            </TabsTrigger>
            )}
          </TabsList>

          {/* Mening buyurtmalarim / Qabul qilganlarim */}
          <TabsContent value="my" className="mt-6">
            {myOrders.length > 0 ? (
              <div className="space-y-4">
                {myOrders.map((order) => (
                  <Card key={order.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1">{order.title}</h3>
                          <p className="text-gray-600 text-sm mb-2">{order.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {order.address}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {formatDate(order.createdAt)}
                            </div>
                          </div>
                        </div>
                        <div className="ml-4">
                          {getStatusBadge(order.status)}
                          </div>
                        </div>

                      {/* Mijoz/Usta ma'lumotlari */}
                      {(order.client || order.specialist) && (
                        <div className="border-t pt-4 mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-gray-600" />
                            </div>
                            <div>
                              <p className="font-medium">
                                {user?.role === 'client' && order.specialist 
                                  ? `${order.specialist.firstName} ${order.specialist.lastName}` 
                                  : user?.role === 'specialist' && order.client 
                                  ? `${order.client.firstName} ${order.client.lastName}`
                                  : 'Usta tayinlanmagan'}
                              </p>
                              {order.specialist?.profession && (
                                <p className="text-sm text-gray-500">{order.specialist.profession}</p>
                              )}
                              {order.specialist?.rating && (
                                <div className="flex items-center gap-1">
                                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                  <span className="text-sm">{order.specialist.rating}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                        {/* Action buttons */}
                      {user?.role === 'specialist' && order.status === 'accepted' && (
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateStatus(order.id, 'in_progress')}
                            disabled={isUpdating === order.id}
                          >
                            Boshlash
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleUpdateStatus(order.id, 'completed')}
                            disabled={isUpdating === order.id}
                          >
                            Yakunlash
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  {user?.role === 'client' ? 'Sizda hali buyurtmalar yo\'q' : 'Siz hali hech qanday buyurtma qabul qilmagansiz'}
                </p>
                {user?.role === 'client' && (
                  <Button
                    onClick={() => router.push('/new-orders')}
                    className="mt-4"
                  >
                    Yangi buyurtma berish
                  </Button>
                )}
              </div>
            )}
          </TabsContent>

          {/* Yangi buyurtmalar (faqat ustalar uchun) */}
          {user?.role === 'specialist' && (
            <TabsContent value="pending" className="mt-6">
              {pendingOrders.length > 0 ? (
                <div className="space-y-4">
                  {pendingOrders.map((order) => (
                    <Card key={order.id} className="overflow-hidden hover:shadow-md transition-shadow border-blue-200">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-1">{order.title}</h3>
                            <p className="text-gray-600 text-sm mb-2">{order.description}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {order.address}
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {formatDate(order.createdAt)}
                              </div>
                            </div>
                            </div>
                          <Badge className="bg-yellow-100 text-yellow-800">Yangi</Badge>
                          </div>

                        {/* Mijoz ma'lumotlari */}
                        {order.client && (
                          <div className="border-t pt-4 mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-blue-600" />
                                 </div>
                                <div>
                                <p className="font-medium">{order.client.firstName} {order.client.lastName}</p>
                                <p className="text-sm text-gray-500">{order.client.region}</p>
                              </div>
                            </div>
                            </div>
                        )}

                        {/* Qo'shimcha ma'lumotlar */}
                        {(order.urgency || order.estimatedTime) && (
                          <div className="bg-gray-50 rounded-lg p-3 mb-4">
                            {order.urgency && (
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm font-medium">Shoshilganlik:</span>
                                <Badge variant={order.urgency === 'urgent' ? 'destructive' : 'secondary'}>
                                  {order.urgency === 'urgent' ? 'Shoshilinch' : 
                                   order.urgency === 'normal' ? 'Oddiy' : 'Muddatsiz'}
                                </Badge>
                              </div>
                            )}
                            {order.estimatedTime && (
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-gray-400" />
                                <span className="text-sm">Taxminiy vaqt: {order.estimatedTime}</span>
                                </div>
                              )}
                            </div>
                        )}

                        {order.clientNote && (
                          <div className="bg-blue-50 rounded-lg p-3 mb-4">
                            <p className="text-sm text-blue-800">
                              <strong>Mijoz izohi:</strong> {order.clientNote}
                            </p>
                          </div>
                        )}

                        {/* Action buttons */}
                        <div className="flex gap-3">
                          <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => {/* Rad etish logic qo'shish mumkin */}}
                            disabled={isUpdating === order.id}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Rad etish
                          </Button>
                          <Button
                            className="flex-1"
                            onClick={() => handleAcceptOrder(order.id)}
                            disabled={isUpdating === order.id}
                          >
                            {isUpdating === order.id ? (
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full animate-spin border-2 border-white border-t-transparent"></div>
                                Qabul qilinmoqda...
                              </div>
                            ) : (
                              <>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Qabul qilish
                              </>
                            )}
                              </Button>
                        </div>
                      </CardContent>
                    </Card>
                      ))}
                  </div>
                ) : (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                  <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Hozircha yangi buyurtmalar yo'q</p>
                  </div>
                )}
          </TabsContent>
          )}
        </Tabs>
      </main>

      <BottomNavigation language={language} />
    </div>
  )
}
