"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, History, ChevronRight, Phone, MapPin, Star, User, Trash2, ChevronDown, Calendar, Clock } from "lucide-react"
import { checkUserAuthentication, getUserData, getAllSpecialists, logout } from "@/lib/auth"
import { getUserMedia } from "@/lib/storage"
import { getClientOrders } from "@/lib/storage"
import { orderAPI, userAPI } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import { getTranslation, getStoredLanguage } from "@/lib/i18n"
import { regions, getDistricts, getRegionLabel, getDistrictLabel } from "@/lib/location-data"
import { professions, getProfessionLabel } from "@/lib/profession-data"
import Header from "@/components/header"
import BottomNavigation from "@/components/bottom-navigation"
import ClientBottomNavigation from "@/components/client-bottom-navigation"
import HammerLoader from "@/components/hammer-loader"
import JobRequestModal from "@/components/job-request-modal"
import toast from 'react-hot-toast'

export default function FindSpecialistsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [language, setLanguage] = useState("uz")
  const [specialists, setSpecialists] = useState<any[]>([])
  const [filteredSpecialists, setFilteredSpecialists] = useState<any[]>([])
  const [selectedRegion, setSelectedRegion] = useState("")
  const [districts, setDistricts] = useState<any[]>([])
  const [filters, setFilters] = useState({
    profession: "",
    region: "",
    district: "",
    search: "",
  })
  const [showResults, setShowResults] = useState(false)
  const [activeTab, setActiveTab] = useState("search")
  const [myOrders, setMyOrders] = useState<any[]>([])
  const [selectedSpecialist, setSelectedSpecialist] = useState<any>(null)
  const [isJobRequestModalOpen, setIsJobRequestModalOpen] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
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
    // Har qanday foydalanuvchi kirishi mumkin

    setUser(userData)

    // Get stored language
    const storedLanguage = getStoredLanguage()
    setLanguage(storedLanguage)

    // Ustalar ro'yxatini olish
    const allSpecialists = getAllSpecialists()
    setSpecialists(allSpecialists)

    // Usta o'zi bergan buyurtmalar tarixi
    const clientOrders = getClientOrders(userData.id)
    // Filter out hidden orders
    const visibleOrders = clientOrders.filter((order: any) => !hiddenOrderIds.includes(order.id))
    setMyOrders(visibleOrders)

    // Loading tugadi
    setIsLoading(false)
  }, [router])

  useEffect(() => {
    if (selectedRegion) {
      const regionDistricts = getDistricts(selectedRegion)
      setDistricts(regionDistricts)
    } else {
      setDistricts([])
    }
  }, [selectedRegion])

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage)
  }

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const handleFilterChange = (key: string, value: string) => {
    if (key === "region") {
      setSelectedRegion(value)
      setFilters((prev) => ({ ...prev, region: value, district: "" }))
    } else {
      setFilters((prev) => ({ ...prev, [key]: value }))
    }
  }

  const handleSearch = async () => {
    // Majburiy parametrlarni tekshirish
    if (!filters.profession || !filters.region || !filters.district) {
      toast.error(
        language === 'uz' ? 'Kasb, viloyat va tuman tanlash majburiy!' :
        language === 'ru' ? 'Выбор профессии, области и района обязателен!' :
        'Profession, region and district selection is required!'
      )
      return
    }

    if (filters.profession === 'all' || filters.region === 'all' || filters.district === 'all') {
      toast.error(
        language === 'uz' ? 'Aniq kasb, viloyat va tuman tanlang!' :
        language === 'ru' ? 'Выберите конкретную профессию, область и район!' :
        'Please select specific profession, region and district!'
      )
      return
    }

    setIsSearching(true)
    
    try {
      console.log('Searching specialists with filters:', filters)
      
      // Ism-familiyani ajratish
      const searchNames = filters.search.trim().split(' ')
      const firstName = searchNames[0] || ''
      const lastName = searchNames.slice(1).join(' ') || ''

      const searchData = {
        profession: filters.profession,
        region: filters.region,
        district: filters.district,
        ...(firstName && { firstName }),
        ...(lastName && { lastName })
      }

      const result = await userAPI.searchSpecialists(searchData)
      console.log('Search result:', result)

      if (result.success) {
        setFilteredSpecialists(result.data.specialists)
        setShowResults(true)
        
        toast.success(
          language === 'uz' ? `${result.data.total} ta usta topildi` :
          language === 'ru' ? `Найдено ${result.data.total} мастеров` :
          `Found ${result.data.total} specialists`
        )
      } else {
        toast.error(result.message || 'Qidirishda xatolik yuz berdi')
        setFilteredSpecialists([])
        setShowResults(true)
      }
    } catch (error: any) {
      console.error('Search error:', error)
      toast.error(
        language === 'uz' ? 'Server bilan aloqa yo\'qoldi!' :
        language === 'ru' ? 'Потеряна связь с сервером!' :
        'Connection lost with server!'
      )
      
      // Fallback: mahalliy qidirish
    let result = [...specialists]
    if (filters.profession && filters.profession !== "all") {
      result = result.filter((spec) => spec.profession === filters.profession)
    }
    if (filters.region && filters.region !== "all") {
      result = result.filter((spec) => spec.region === filters.region)
    }
    if (filters.district && filters.district !== "all") {
      result = result.filter((spec) => spec.district === filters.district)
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      result = result.filter(
        (spec) =>
          spec.firstName.toLowerCase().includes(searchLower) ||
          spec.lastName.toLowerCase().includes(searchLower) ||
          spec.profession.toLowerCase().includes(searchLower),
      )
    }
    setFilteredSpecialists(result)
    setShowResults(true)
    } finally {
      setIsSearching(false)
    }
  }

  const handleContactSpecialist = (specialist: any) => {
    setSelectedSpecialist(specialist)
    setIsJobRequestModalOpen(true)
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

  const loadOrders = () => {
    if (user) {
      // Try to get orders from API first, fallback to localStorage
      const clientOrders = getClientOrders(user.id)
      // Filter out hidden orders
      const visibleOrders = clientOrders.filter((order: any) => !hiddenOrderIds.includes(order.id))
      setMyOrders(visibleOrders)
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
      setSelectedOrders(myOrders.map(order => order.id))
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
        
        ordersToHide = myOrders
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
      
      loadOrders() // Refresh orders
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
      loadOrders() // Refresh orders
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
        <h1 className="text-2xl font-bold mb-6">{getTranslation("findSpecialists", language)}</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="search" className="text-xs sm:text-sm">
              <Search className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">{getTranslation("findSpecialists", language)}</span>
              <span className="sm:hidden">Qidirish</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="text-xs sm:text-sm">
              <History className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">{getTranslation("ordersHistory", language)}</span>
              <span className="sm:hidden">Tarix</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="mt-6">
            {/* Eslatma */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    {language === 'uz' ? 'Qidirish bo\'yicha eslatma' :
                     language === 'ru' ? 'Напоминание о поиске' :
                     'Search Instructions'}
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>
                      {language === 'uz' ? 
                        '• Kasb, viloyat va tuman tanlash majburiy\n• Ism-familiya kiritish ixtiyoriy' :
                       language === 'ru' ? 
                        '• Выбор профессии, области и района обязателен\n• Ввод имени-фамилии необязателен' :
                        '• Profession, region and district selection is required\n• Name input is optional'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Usta qidirish filtri */}
            <div className="bg-white p-4 rounded-lg shadow flex flex-col md:flex-row gap-4 items-end mb-8">
              <div className="w-full md:w-1/5">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {getTranslation("profession", language)} *
                </label>
                <Select onValueChange={(value) => handleFilterChange("profession", value)} value={filters.profession}>
                  <SelectTrigger className={!filters.profession || filters.profession === 'all' ? 'border-red-300' : ''}>
                    <SelectValue placeholder={getTranslation("profession", language)} />
                  </SelectTrigger>
                  <SelectContent side="top" className="max-h-[200px] overflow-y-auto">
                    <SelectItem value="all">{getTranslation("allProfessions", language)}</SelectItem>
                    {professions.map((profession) => (
                      <SelectItem key={profession.value} value={profession.value}>
                        {profession.label[language as keyof typeof profession.label] || profession.value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-full md:w-1/5">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {getTranslation("region", language)} *
                </label>
                <Select onValueChange={(value) => handleFilterChange("region", value)} value={filters.region}>
                  <SelectTrigger className={!filters.region || filters.region === 'all' ? 'border-red-300' : ''}>
                    <SelectValue placeholder={getTranslation("region", language)} />
                  </SelectTrigger>
                  <SelectContent side="top" className="max-h-[200px] overflow-y-auto">
                    <SelectItem value="all">{getTranslation("allRegions", language)}</SelectItem>
                    {regions.map((region) => (
                      <SelectItem key={region.value} value={region.value}>
                        {region.label[language as keyof typeof region.label] || region.value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-full md:w-1/5">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {getTranslation("district", language)} *
                </label>
                <Select
                  onValueChange={(value) => handleFilterChange("district", value)}
                  value={filters.district}
                  disabled={!selectedRegion || selectedRegion === "all"}
                >
                  <SelectTrigger className={!filters.district || filters.district === 'all' ? 'border-red-300' : ''}>
                    <SelectValue placeholder={getTranslation("district", language)} />
                  </SelectTrigger>
                  <SelectContent side="top" className="max-h-[200px] overflow-y-auto">
                    <SelectItem value="all">{getTranslation("allDistricts", language)}</SelectItem>
                    {districts.map((district) => (
                      <SelectItem key={district.value} value={district.value}>
                        {district.label[language as keyof typeof district.label] || district.value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-full md:w-1/5">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {getTranslation("searchByName", language)}
                </label>
                <Input
                  placeholder={getTranslation("searchByName", language)}
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                />
              </div>

              <div className="w-full md:w-1/5">
                <button
                  className={`w-full py-2 px-4 rounded transition flex items-center justify-center ${
                    !filters.profession || !filters.region || !filters.district || 
                    filters.profession === "all" || filters.region === "all" || filters.district === "all" ||
                    isSearching
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-primary text-white hover:bg-primary/90"
                  }`}
                  onClick={handleSearch}
                  disabled={
                    !filters.profession || !filters.region || !filters.district || 
                    filters.profession === "all" || filters.region === "all" || filters.district === "all" ||
                    isSearching
                  }
                >
                  {isSearching ? (
                    <>
                      <div className="w-4 h-4 rounded-full animate-spin border-2 border-solid border-white border-t-transparent mr-2"></div>
                      <span>{getTranslation("searching", language) || "Qidirilmoqda..."}</span>
                    </>
                  ) : (
                    getTranslation("findSpecialists", language)
                  )}
                </button>
              </div>
            </div>

            {/* Natijalar */}
            {showResults && (
              <div className="space-y-4">
                {filteredSpecialists.length > 0 ? (
                  filteredSpecialists.map((specialist) => {
                    const rating = specialist.rating || 0;
                    const reviewCount = specialist.reviewCount || 0;
                    const portfolio = getUserMedia(specialist.id) || [];
                    
                    return (
                      <Card key={specialist.id} className="overflow-hidden">
                        <CardContent className="p-0">
                          <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors duration-200">
                            <div className="flex items-center space-x-3 flex-1">
                              {/* Avatar */}
                              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center overflow-hidden">
                                {specialist.avatar ? (
                                  <img
                                    src={`http://localhost:5000${specialist.avatar}`}
                                    alt={`${specialist.firstName} ${specialist.lastName}`}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                <User className="w-6 h-6 text-white" />
                                )}
                              </div>
                              
                              {/* Usta ma'lumotlari */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <h3 className="font-medium text-gray-900 truncate">
                                    {specialist.firstName} {specialist.lastName}
                                  </h3>
                                  <Badge className={`ml-2 ${specialist.isAvailable !== false ? "bg-green-500" : "bg-red-500"}`}>
                                    {specialist.isAvailable !== false ? "Band emas" : "Band"}
                                  </Badge>
                                </div>
                                
                                <p className="text-sm text-gray-600 truncate">
                                  {getProfessionLabel(specialist.profession, language)}
                                </p>
                                
                                <div className="flex items-center mt-1 text-xs text-gray-500">
                                  <MapPin className="w-3 h-3 mr-1" />
                                  <span className="truncate">
                                    {getRegionLabel(specialist.region, language)}, {getDistrictLabel(specialist.region, specialist.district, language)}
                                  </span>
                                </div>
                                
                                {/* Rating */}
                                {rating > 0 && reviewCount > 0 ? (
                                  <div className="flex items-center mt-1">
                                    <Star className="w-3 h-3 text-yellow-400 mr-1" />
                                    <span className="text-xs text-gray-600">
                                      {rating.toFixed(1)} ({reviewCount})
                                    </span>
                                  </div>
                                ) : (
                                  <span className="text-xs text-gray-400 mt-1 block">
                                    Hali baxolanmagan
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            {/* Contact button */}
                            <div className="ml-4">
                              {specialist.isAvailable !== false ? (
                                <button
                                  className="flex items-center justify-center w-10 h-10 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
                                  onClick={() => handleContactSpecialist(specialist)}
                                >
                                  <Phone className="w-4 h-4" />
                                </button>
                              ) : (
                                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                  <Phone className="w-4 h-4 text-gray-400" />
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })
                ) : (
                  <div className="col-span-full text-center py-8">
                    <p className="text-gray-500">{getTranslation("noSpecialistsFound", language)}</p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <Card className="min-h-[600px]">
              <CardHeader className="bg-primary/5 pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{getTranslation("ordersHistory", language)}</CardTitle>
                  
                  {/* Delete Controls */}
                  {myOrders.length > 0 && (
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
                {myOrders.length > 0 ? (
                  <>
                    {/* Desktop Table */}
                    <div className="hidden md:block h-full">
                      <div className="overflow-auto h-full w-full">
                        {/* Select All Checkbox */}
                        <div className="p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
                          <div className="flex items-center gap-2">
                            <Checkbox
                              checked={selectedOrders.length === myOrders.length && myOrders.length > 0}
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

                        <div className="space-y-4 p-4">
                          {myOrders.map((order) => (
                            <div key={order.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                              <div className="flex items-start justify-between">
                                {/* Main content */}
                                <div className="flex-1">
                                  {/* Avatar va ism-familiya */}
                                  <div className="flex items-center mb-3">
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
                                  
                                  {/* Ish tavsifi */}
                                  <div className="mb-3">
                                    <p className="text-gray-700 text-sm leading-relaxed">
                                      {order.description}
                                    </p>
                                  </div>
                                  
                                  {/* Sana va telefon */}
                                  <div className="flex items-center justify-between mb-3">
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
                                  
                                  {/* Status va delete button */}
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
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Mobile Cards */}
                    <div className="md:hidden h-full overflow-auto p-4 space-y-4">
                      <div className="flex items-center justify-between mb-4 sticky top-0 bg-white pb-2">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={selectedOrders.length === myOrders.length && myOrders.length > 0}
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

                      {myOrders.map((order) => (
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
          </TabsContent>
        </Tabs>
      </main>

      {user?.type === "specialist" ? (
        <BottomNavigation language={language} />
      ) : (
        <ClientBottomNavigation language={language} />
      )}

      {selectedSpecialist && (
        <JobRequestModal
          isOpen={isJobRequestModalOpen}
          onClose={() => setIsJobRequestModalOpen(false)}
          specialist={selectedSpecialist}
          language={language}
        />
      )}
    </div>
  )
} 