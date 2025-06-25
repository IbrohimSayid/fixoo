"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { checkUserAuthentication, getUserData, getAllSpecialists, logout } from "@/lib/auth"
import { getTranslation, getStoredLanguage } from "@/lib/i18n"
import { regions, getDistricts, getRegionLabel, getDistrictLabel } from "@/lib/location-data"
import { professions, getProfessionLabel } from "@/lib/profession-data"
import Header from "@/components/header"
import BottomNavigation from "@/components/bottom-navigation"

export default function FindSpecialistsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
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

    // Ustalar ro'yxatini olish
    const allSpecialists = getAllSpecialists()
    setSpecialists(allSpecialists)
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
        <h1 className="text-2xl font-bold mb-6">{getTranslation("findSpecialists", language)}</h1>

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
              className="w-full bg-primary text-white py-2 px-4 rounded hover:bg-primary/90 transition"
              onClick={handleSearch}
            >
              {getTranslation("findSpecialists", language)}
            </button>
          </div>
        </div>

        {/* Natijalar */}
        {showResults && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSpecialists.length > 0 ? (
              filteredSpecialists.map((specialist) => (
                <Card key={specialist.id} className="overflow-hidden">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">
                          {specialist.firstName} {specialist.lastName}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {getProfessionLabel(specialist.profession, language)}
                        </p>
                        <div className="flex items-center mt-1">
                          <Badge className={specialist.isAvailable !== false ? "bg-green-500" : "bg-red-500"}>
                            {specialist.isAvailable !== false
                              ? getTranslation("specialistAvailable", language)
                              : getTranslation("specialistBusy", language)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      <p className="text-sm flex items-center">
                        {getRegionLabel(specialist.region, language)}, {getDistrictLabel(specialist.region, specialist.district, language)}
                      </p>
                      <p className="text-sm flex items-center">
                        {specialist.address}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">{getTranslation("noSpecialistsFound", language)}</p>
              </div>
            )}
          </div>
        )}
      </main>

      <BottomNavigation language={language} />
    </div>
  )
} 