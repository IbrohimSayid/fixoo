"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { checkUserAuthentication, getUserData, logout } from "@/lib/auth"
import { getTranslation, getStoredLanguage } from "@/lib/i18n"
import Header from "@/components/header"
import ClientBottomNavigation from "@/components/client-bottom-navigation"
import { getClientOrders } from "@/lib/storage"
import { orderAPI } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import { Clock, Phone, Trash2, ChevronDown, Calendar, User } from "lucide-react"
import HammerLoader from "@/components/hammer-loader"
import toast from 'react-hot-toast'

export default function ClientOrdersPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [language, setLanguage] = useState("uz")
  const [orders, setOrders] = useState<any[]>([])
  const [notifications, setNotifications] = useState<any[]>([])
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])
  const [isDeleting, setIsDeleting] = useState(false)
  const [hiddenOrderIds, setHiddenOrderIds] = useState<string[]>([])

  useEffect(() => {
    const isAuthenticated = checkUserAuthentication()

    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    const userData = getUserData()
    if (userData?.type !== "client") {
      router.push("/home")
      return
    }

    setUser(userData)

    // Get stored language
    const storedLanguage = getStoredLanguage()
    setLanguage(storedLanguage)

    // Load orders for this client
    const clientOrders = getClientOrders(userData.id)
    setOrders(clientOrders)

    // Notification'larni yuklash
    const loadNotifications = () => {
      const userNotifications = JSON.parse(localStorage.getItem(`fixoo_notifications_${userData.id}`) || '[]')
      setNotifications(userNotifications)
      
      // Yangi notification'lar uchun toast ko'rsatish
      const unreadNotifications = userNotifications.filter((n: any) => !n.read)
      unreadNotifications.forEach((notification: any) => {
        toast.success(notification.message)
        // Notification'ni o'qilgan deb belgilash
        notification.read = true
      })
      
      if (unreadNotifications.length > 0) {
        localStorage.setItem(`fixoo_notifications_${userData.id}`, JSON.stringify(userNotifications))
      }
    }

    loadNotifications()

    // Auto-refresh har 10 soniyada
    const interval = setInterval(() => {
      loadNotifications()
      const updatedOrders = getClientOrders(userData.id)
      setOrders(updatedOrders)
    }, 10000)

    // Loading tugadi
    setIsLoading(false)

    return () => clearInterval(interval)
  }, [router])

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage)
  }

  const handleLogout = () => {
    logout()
    router.push("/login")
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

  const loadOrders = (userId: string) => {
    const clientOrders = getClientOrders(userId)
    // Filter out hidden orders
    const visibleOrders = clientOrders.filter((order: any) => !hiddenOrderIds.includes(order.id))
    setOrders(visibleOrders)
  }

  const handleOrderSelect = (orderId: string, checked: boolean) => {
    if (checked) {
      setSelectedOrders(prev => [...prev, orderId])
    } else {
      setSelectedOrders(prev => prev.filter(id => id !== orderId))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOrders(orders.map(order => order.id))
    } else {
      setSelectedOrders([])
    }
  }

  const handleBulkDelete = async (period?: '1day' | '1week' | '1month' | 'all') => {
    setIsDeleting(true)
    try {
      let ordersToHide: string[] = []
      
      if (period) {
        // Hide orders based on period from frontend only
        const now = new Date()
        let cutoffDate: Date
        
        switch (period) {
          case '1day':
            cutoffDate = new Date(now.getTime() - 24 * 60 * 60 * 1000)
            break
          case '1week':
            cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
            break
          case '1month':
            cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
            break
          case 'all':
            cutoffDate = new Date('1970-01-01')
            break
          default:
            return
        }
        
        ordersToHide = orders
          .filter((order: any) => new Date(order.date) <= cutoffDate)
          .map((order: any) => order.id)
      } else {
        // Hide selected orders
        ordersToHide = selectedOrders
      }

      // Update hidden orders list
      setHiddenOrderIds(prev => [...prev, ...ordersToHide])
      setSelectedOrders([])
      
      toast.success(
        language === 'uz' ? `${ordersToHide.length} ta buyurtma yashirildi` :
        language === 'ru' ? `${ordersToHide.length} заказов скрыто` :
        `${ordersToHide.length} orders hidden`
      )
      
      loadOrders(user.id) // Refresh orders
    } catch (error: any) {
      console.error('Hide orders error:', error)
      toast.error('Buyurtmalarni yashirishda xatolik!')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDeleteSingleOrder = async (orderId: string) => {
    if (!confirm('Bu buyurtmani yashirishni xohlaysizmi?')) return

    setIsDeleting(true)
    try {
      // Just hide from frontend, don't delete from backend
      setHiddenOrderIds(prev => [...prev, orderId])
      
      toast.success('Buyurtma yashirildi')
      loadOrders(user.id) // Refresh orders
    } catch (error: any) {
      console.error('Hide order error:', error)
      toast.error('Buyurtmani yashirishda xatolik!')
    } finally {
      setIsDeleting(false)
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

        <Card className="min-h-[600px]">
          <CardHeader className="bg-primary/5 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{getTranslation("allOrders", language)}</CardTitle>
              
              {/* Delete Controls */}
              {orders.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      disabled={isDeleting}
                      className="flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="hidden sm:inline text-sm">
                        {language === 'uz' ? 'Yashirish' : 
                         language === 'ru' ? 'Скрыть' : 'Hide'}
                      </span>
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleBulkDelete('1day')}>
                      <Calendar className="w-4 h-4 mr-2" />
                      {language === 'uz' ? '1 kunlik tariхni yashirish' : 
                       language === 'ru' ? 'Скрыть 1-дневную историю' : 'Hide 1 day history'}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkDelete('1week')}>
                      <Calendar className="w-4 h-4 mr-2" />
                      {language === 'uz' ? '1 haftalik tariхni yashirish' : 
                       language === 'ru' ? 'Скрыть 1-недельную историю' : 'Hide 1 week history'}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkDelete('1month')}>
                      <Calendar className="w-4 h-4 mr-2" />
                      {language === 'uz' ? '1 oylik tariхni yashirish' : 
                       language === 'ru' ? 'Скрыть 1-месячную историю' : 'Hide 1 month history'}
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleBulkDelete('all')}
                      className="text-red-600"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      {language === 'uz' ? 'Barcha tariхni yashirish' : 
                       language === 'ru' ? 'Скрыть всю историю' : 'Hide all history'}
                    </DropdownMenuItem>
                    {selectedOrders.length > 0 && (
                      <DropdownMenuItem 
                        onClick={() => handleBulkDelete()}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        {language === 'uz' ? `Tanlanganlarni yashirish (${selectedOrders.length})` : 
                         language === 'ru' ? `Скрыть выбранные (${selectedOrders.length})` : 
                         `Hide selected (${selectedOrders.length})`}
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="p-0 h-[600px] overflow-hidden">
            {orders.length > 0 ? (
              <>
                {/* Desktop Table */}
                <div className="hidden md:block h-full">
                  <div className="overflow-auto h-full w-full">
                    <Table className="w-full">
                      <TableHeader className="sticky top-0 bg-white z-10">
                  <TableRow>
                          <TableHead className="w-12">
                            <Checkbox
                              checked={selectedOrders.length === orders.length && orders.length > 0}
                              onCheckedChange={handleSelectAll}
                            />
                          </TableHead>
                    <TableHead>{getTranslation("specialistName", language)}</TableHead>
                          <TableHead>{getTranslation("description", language)}</TableHead>
                          <TableHead>{getTranslation("date", language)}</TableHead>
                    <TableHead>{getTranslation("status", language)}</TableHead>
                    <TableHead>{getTranslation("contact", language)}</TableHead>
                          <TableHead className="w-16 text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                            <TableCell>
                              <Checkbox
                                checked={selectedOrders.includes(order.id)}
                                onCheckedChange={(checked) => handleOrderSelect(order.id, checked as boolean)}
                              />
                            </TableCell>
                      <TableCell className="font-medium">{order.specialistName}</TableCell>
                            <TableCell className="max-w-xs truncate">{order.description}</TableCell>
                            <TableCell>{formatDate(order.date)}</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell>
                        {order.status === "accepted" ? (
                          <span className="text-primary">{order.specialistPhone}</span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                            <TableCell className="text-center">
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteSingleOrder(order.id)}
                                disabled={isDeleting}
                                className="bg-red-500 hover:bg-red-600 text-white p-3 h-10 w-10 rounded-md"
                              >
                                <Trash2 className="w-4 h-4 text-white" />
                              </Button>
                            </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
                  </div>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden h-full overflow-auto p-4 space-y-4">
                  <div className="flex items-center justify-between mb-4 sticky top-0 bg-white pb-2">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={selectedOrders.length === orders.length && orders.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                      <span className="text-sm text-gray-600">
                        {language === 'uz' ? 'Barchasini tanlash' : 
                         language === 'ru' ? 'Выбрать все' : 'Select all'}
                      </span>
                    </div>
                    {selectedOrders.length > 0 && (
                      <span className="text-sm text-blue-600">
                        {selectedOrders.length} {language === 'uz' ? 'ta tanlangan' : 
                         language === 'ru' ? 'выбрано' : 'selected'}
                      </span>
                    )}
                  </div>

                  {orders.map((order) => (
                    <div key={order.id} className="bg-white rounded-lg border border-gray-200 p-4 min-h-[160px]">
                      {/* 1. Avatar, Ism, Familiya (yuqori chap burchakda) */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <Checkbox
                            checked={selectedOrders.includes(order.id)}
                            onCheckedChange={(checked) => handleOrderSelect(order.id, checked as boolean)}
                            className="mr-3"
                          />
                          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mr-3 overflow-hidden">
                            {order.specialistAvatar ? (
                              <img
                                src={`http://localhost:5000${order.specialistAvatar}`}
                                alt={order.specialistName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <User className="w-6 h-6 text-white" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 text-base">
                              {order.specialistName}
                            </h3>
                          </div>
                        </div>
                      </div>
                      
                      {/* 2. Buyurtma descriptioni */}
                      <div className="mb-4">
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {order.description}
                        </p>
                      </div>
                      
                      {/* 3. Qachon qo'shilgani, telefon raqam */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="w-4 h-4 mr-2" />
                          {formatDate(order.date)}
                        </div>
                        {order.status === "accepted" && order.specialistPhone && (
                          <div className="flex items-center text-sm text-primary">
                            <Phone className="w-4 h-4 mr-2" />
                            <span className="font-medium">{order.specialistPhone}</span>
                          </div>
                        )}
                      </div>
                      
                      {/* 4. Buyurtma statusi, delete buttoni */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {getStatusBadge(order.status)}
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteSingleOrder(order.id)}
                          disabled={isDeleting}
                          className="bg-red-500 hover:bg-red-600 text-white p-2 h-9 w-9 rounded-md"
                        >
                          <Trash2 className="w-4 h-4 text-white" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-8 h-full flex items-center justify-center">
                <p className="text-gray-500">{getTranslation("noNewOrders", language)}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <ClientBottomNavigation language={language} />
    </div>
  )
}
