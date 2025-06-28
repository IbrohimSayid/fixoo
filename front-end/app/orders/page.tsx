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
import { Clock, CheckCircle, XCircle, ShoppingBag, History, User, MapPin, Phone, ChevronRight, Trash2, ChevronDown, Calendar } from "lucide-react"
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
    
    // Filter out hidden orders
    const visibleAllOrders = allSpecialistOrders.filter((order: any) => !hiddenOrderIds.includes(order.id))
    const visibleNewOrders = newSpecialistOrders.filter((order: any) => !hiddenOrderIds.includes(order.id))
    
    // Yangi buyurtmalar haqida bildirishnoma
    if (visibleNewOrders.length > newOrders.length && Date.now() - lastNotificationCheck > 10000) {
      const newOrdersCount = visibleNewOrders.length - newOrders.length
      toast.success(
        language === 'uz' ? `${newOrdersCount} ta yangi buyurtma keldi!` :
        language === 'ru' ? `Поступило ${newOrdersCount} новых заказов!` :
        `${newOrdersCount} new orders received!`
      )
      setLastNotificationCheck(Date.now())
    }
    
    setAllOrders(visibleAllOrders)
    setNewOrders(visibleNewOrders)
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

  const handleOrderSelect = (orderId: string, checked: boolean) => {
    if (checked) {
      setSelectedOrders(prev => [...prev, orderId])
    } else {
      setSelectedOrders(prev => prev.filter(id => id !== orderId))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOrders(allOrders.map(order => order.id))
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
        
        ordersToHide = allOrders
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
            <Card>
              <CardHeader className="bg-primary/5 pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{getTranslation("ordersHistory", language)}</CardTitle>
                  
                  {/* Delete Controls */}
                  {allOrders.length > 0 && (
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
                {allOrders.length > 0 ? (
                  <div className="h-full overflow-auto">
                    {/* Select All Checkbox */}
                    <div className="p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={selectedOrders.length === allOrders.length && allOrders.length > 0}
                          onCheckedChange={handleSelectAll}
                        />
                        <span className="text-sm text-gray-600">
                          {language === 'uz' ? 'Barchasini tanlash' : 
                           language === 'ru' ? 'Выбрать все' : 'Select all'}
                        </span>
                        {selectedOrders.length > 0 && (
                          <span className="text-sm text-blue-600 ml-4">
                            {selectedOrders.length} {language === 'uz' ? 'ta tanlangan' : 
                             language === 'ru' ? 'выбрано' : 'selected'}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Orders List */}
                    <div className="space-y-0">
                      {allOrders.map((order, index) => (
                        <div key={order.id} className={`border-b border-gray-100 ${index === allOrders.length - 1 ? 'border-b-0' : ''}`}>
                          {/* Desktop Layout */}
                          <div className="hidden md:flex items-center p-4 hover:bg-gray-50 transition-colors duration-200">
                            <div className="flex items-center gap-3 flex-1">
                              <Checkbox
                                checked={selectedOrders.includes(order.id)}
                                onCheckedChange={(checked) => handleOrderSelect(order.id, checked as boolean)}
                              />
                              
                              <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center overflow-hidden">
                                {order.clientAvatar ? (
                                  <img
                                    src={`http://localhost:5000${order.clientAvatar}`}
                                    alt={order.clientName}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <User className="w-5 h-5 text-white" />
                                )}
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
                            
                            <div className="flex items-center gap-2 ml-4">
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteSingleOrder(order.id)}
                                disabled={isDeleting}
                                className="bg-red-500 hover:bg-red-600 text-white p-3 h-10 w-10 rounded-md"
                              >
                                <Trash2 className="w-4 h-4 text-white" />
                              </Button>
                              <ChevronRight className="w-5 h-5 text-gray-400" />
                            </div>
                          </div>

                          {/* Mobile Layout */}
                          <div className="md:hidden p-4 min-h-[160px] bg-white">
                            {/* 1. Avatar, Ism, Familiya (yuqori chap burchakda) */}
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center">
                                <Checkbox
                                  checked={selectedOrders.includes(order.id)}
                                  onCheckedChange={(checked) => handleOrderSelect(order.id, checked as boolean)}
                                  className="mr-3"
                                />
                                                                 <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mr-3 overflow-hidden">
                                   {order.clientAvatar ? (
                                     <img
                                       src={`http://localhost:5000${order.clientAvatar}`}
                                       alt={order.clientName}
                                       className="w-full h-full object-cover"
                                     />
                                   ) : (
                                     <User className="w-6 h-6 text-white" />
                                   )}
                                 </div>
                                <div>
                                  <h3 className="font-semibold text-gray-900 text-base">
                                    {order.clientName}
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
                              {order.status === "accepted" && order.clientPhone && (
                                <div className="flex items-center text-sm text-primary">
                                  <Phone className="w-4 h-4 mr-2" />
                                  <span className="font-medium">{order.clientPhone}</span>
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
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 h-full flex items-center justify-center">
                    <div>
                      <History className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-500">{getTranslation("noNewOrders", language)}</p>
                    </div>
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
