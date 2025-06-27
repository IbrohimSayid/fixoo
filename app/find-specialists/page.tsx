"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, History, ChevronRight, Phone, MapPin, Star, User } from "lucide-react"
import { checkUserAuthentication, getUserData, getAllSpecialists, logout } from "@/lib/auth"
import { getUserMedia } from "@/lib/storage"
import { getClientOrders } from "@/lib/storage"
import { formatDistanceToNow } from "date-fns"
import { getTranslation, getStoredLanguage } from "@/lib/i18n"
import { regions, getDistricts, getRegionLabel, getDistrictLabel } from "@/lib/location-data"
import { professions, getProfessionLabel } from "@/lib/profession-data"
import Header from "@/components/header"
import BottomNavigation from "@/components/bottom-navigation"
import ClientBottomNavigation from "@/components/client-bottom-navigation"
import HammerLoader from "@/components/hammer-loader"
import JobRequestModal from "@/components/job-request-modal"

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
    setMyOrders(clientOrders)

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

  const handleSearch = () => {
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
            {/* Usta qidirish filtri */}
            <div className="bg-white p-4 rounded-lg shadow flex flex-col md:flex-row gap-4 items-end mb-8">
              <div className="w-full md:w-1/5">
                <Select onValueChange={(value) => handleFilterChange("profession", value)} value={filters.profession}>
                  <SelectTrigger>
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
                <Select onValueChange={(value) => handleFilterChange("region", value)} value={filters.region}>
                  <SelectTrigger>
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
                <Select
                  onValueChange={(value) => handleFilterChange("district", value)}
                  value={filters.district}
                  disabled={!selectedRegion || selectedRegion === "all"}
                >
                  <SelectTrigger>
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
                <Input
                  placeholder={getTranslation("searchByName", language)}
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                />
              </div>
              <div className="w-full md:w-1/5">
                <button
                  className={`w-full py-2 px-4 rounded transition ${
                    !filters.profession || !filters.region || !filters.district || filters.profession === "all" || filters.region === "all" || filters.district === "all"
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-primary text-white hover:bg-primary/90"
                  }`}
                  onClick={handleSearch}
                  disabled={!filters.profession || !filters.region || !filters.district || filters.profession === "all" || filters.region === "all" || filters.district === "all"}
                >
                  {getTranslation("findSpecialists", language)}
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
                              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                                <User className="w-6 h-6 text-white" />
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
            <Card>
              <CardHeader className="bg-primary/5 pb-4">
                <CardTitle>{getTranslation("ordersHistory", language)}</CardTitle>
              </CardHeader>
              <CardContent className="p-0 overflow-x-auto">
                {myOrders.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{getTranslation("specialistName", language)}</TableHead>
                        <TableHead className="hidden md:table-cell">{getTranslation("description", language)}</TableHead>
                        <TableHead className="hidden md:table-cell">{getTranslation("date", language)}</TableHead>
                        <TableHead>{getTranslation("status", language)}</TableHead>
                        <TableHead>{getTranslation("contact", language)}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {myOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.specialistName}</TableCell>
                          <TableCell className="hidden md:table-cell">{order.description}</TableCell>
                          <TableCell className="hidden md:table-cell">{formatDate(order.date)}</TableCell>
                          <TableCell>{getStatusBadge(order.status)}</TableCell>
                          <TableCell>
                            {order.status === "accepted" ? (
                              <span className="text-primary">{order.specialistPhone}</span>
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