"use client"

import { Badge } from "@/components/ui/badge"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { regions, getDistricts, getRegionLabel, getDistrictLabel } from "@/lib/location-data"
import { professions, getProfessionLabel } from "@/lib/profession-data"
import { checkUserAuthentication, getUserData, getAllSpecialists, logout } from "@/lib/auth"
import { getTranslation, getStoredLanguage } from "@/lib/i18n"
import Header from "@/components/header"
import BottomNavigation from "@/components/bottom-navigation"
import ClientBottomNavigation from "@/components/client-bottom-navigation"
import MediaUpload from "@/components/media-upload"
import JobRequestModal from "@/components/job-request-modal"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Phone, MapPin, Briefcase, Star, Calendar, Camera } from "lucide-react"

// Import the storage utility
import { saveUserMedia, getUserMedia, updateSpecialistAvailability } from "@/lib/storage"

type Specialist = {
  id: string
  firstName: string
  lastName: string
  phone: string
  profession: string
  address: string
  region: string
  district: string
  type: "specialist"
  isAvailable?: boolean
}

export default function HomePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [specialists, setSpecialists] = useState<Specialist[]>([])
  const [filteredSpecialists, setFilteredSpecialists] = useState<Specialist[]>([])
  const [selectedRegion, setSelectedRegion] = useState("")
  const [districts, setDistricts] = useState<any[]>([])
  const [language, setLanguage] = useState("uz")
  const [filters, setFilters] = useState({
    profession: "",
    region: "",
    district: "",
    search: "",
  })
  const [userMedia, setUserMedia] = useState<any[]>([])
  const [isAvailable, setIsAvailable] = useState(true)
  const [selectedSpecialist, setSelectedSpecialist] = useState<Specialist | null>(null)
  const [isJobRequestModalOpen, setIsJobRequestModalOpen] = useState(false)
  const [avatarImage, setAvatarImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const isAuthenticated = checkUserAuthentication()

    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    const userData = getUserData()
    setUser(userData)

    // Set availability status
    setIsAvailable(userData?.isAvailable !== false) // Default to true if not set

    // Get stored language
    const storedLanguage = getStoredLanguage()
    setLanguage(storedLanguage)

    // If user is a client, load all specialists
    if (userData?.type === "client") {
      const allSpecialists = getAllSpecialists()
      setSpecialists(allSpecialists)
      setFilteredSpecialists(allSpecialists)
    }

    // Load saved avatar image
    if (userData?.id) {
      const savedAvatar = localStorage.getItem(`fixoo_avatar_${userData.id}`)
      if (savedAvatar) {
        setAvatarImage(savedAvatar)
      }
    }
  }, [router])

  useEffect(() => {
    if (selectedRegion) {
      const regionDistricts = getDistricts(selectedRegion)
      setDistricts(regionDistricts)
    } else {
      setDistricts([])
    }
  }, [selectedRegion])

  useEffect(() => {
    if (specialists.length > 0) {
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
    }
  }, [filters, specialists])

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

  // Update the handleMediaUpload function
  const handleMediaUpload = (files: File[]) => {
    // In a real app, we would upload the files to a server
    // For now, we'll just store references in localStorage

    // Create media objects (in a real app, these would have URLs to the uploaded files)
    const newMedia = files.map((file) => ({
      id: Math.random().toString(36).substring(2, 15),
      name: file.name,
      type: file.type.startsWith("image/") ? "image" : "video",
      // In a real app, this would be the URL of the uploaded file
      // For now, we can't actually store the File object in localStorage
      fileInfo: {
        name: file.name,
        type: file.type,
        size: file.size,
        lastModified: file.lastModified,
      },
    }))

    // Update state
    const updatedMedia = [...userMedia, ...newMedia]
    setUserMedia(updatedMedia)

    // Save to localStorage
    if (user?.id) {
      saveUserMedia(user.id, updatedMedia)
    }
  }

  // Add a useEffect to load user media
  useEffect(() => {
    if (user?.id && user?.type === "specialist") {
      // Load user media from localStorage
      const media = getUserMedia(user.id)
      if (media && media.length > 0) {
        setUserMedia(media)
      }
    }
  }, [user])

  // Handle availability toggle
  const handleAvailabilityToggle = () => {
    const newAvailability = !isAvailable
    setIsAvailable(newAvailability)

    // Update in localStorage
    if (user?.id) {
      updateSpecialistAvailability(user.id, newAvailability)
    }
  }

  // Handle contact specialist
  const handleContactSpecialist = (specialist: Specialist) => {
    setSelectedSpecialist(specialist)
    setIsJobRequestModalOpen(true)
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
        {user.type === "client" ? (
          <div className="space-y-6">
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
              <h2 className="text-xl sm:text-2xl font-bold mb-4">{getTranslation("findSpecialists", language)}</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div>
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

                <div>
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

                <div>
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

                <div>
                  <Input
                    placeholder={getTranslation("searchByName", language)}
                    value={filters.search}
                    onChange={(e) => handleFilterChange("search", e.target.value)}
                  />
                </div>
              </div>

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
                          <Avatar className="h-12 w-12">
                            <AvatarFallback className="bg-primary text-white">
                              {specialist.firstName.charAt(0)}
                              {specialist.lastName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="space-y-2 mb-4">
                          <p className="text-sm flex items-center">
                            <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                            {getRegionLabel(specialist.region, language)},{" "}
                            {getDistrictLabel(specialist.region, specialist.district, language)}
                          </p>
                          <p className="text-sm flex items-center">
                            <Briefcase className="h-4 w-4 mr-1 text-gray-400" />
                            {specialist.address}
                          </p>
                        </div>
                        <Button
                          className="w-full"
                          variant={specialist.isAvailable !== false ? "default" : "outline"}
                          disabled={specialist.isAvailable === false}
                          onClick={() => handleContactSpecialist(specialist)}
                        >
                          {getTranslation("contactSpecialist", language)}
                        </Button>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8">
                    <p className="text-gray-500">{getTranslation("noSpecialistsFound", language)}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <Card className="overflow-hidden">
              <CardHeader className="bg-primary/5 pb-4">
                <CardTitle className="text-xl sm:text-2xl flex justify-between items-center">
                  <span>
                    {getTranslation("welcome", language)}, {user.firstName} {user.lastName}
                  </span>
                  <div className="flex items-center space-x-2">
                    <Switch id="availability" checked={isAvailable} onCheckedChange={handleAvailabilityToggle} />
                    <Label htmlFor="availability" className="text-sm font-normal">
                      {isAvailable ? getTranslation("available", language) : getTranslation("busy", language)}
                    </Label>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-1">
                    <div className="flex flex-col items-center text-center mb-6">
                      <div className="relative group">
                        <Avatar className="h-24 w-24 mb-4">
                          {avatarImage ? (
                            <div className="h-full w-full overflow-hidden rounded-full">
                              <img
                                src={avatarImage || "/placeholder.svg"}
                                alt="Avatar"
                                className="h-full w-full object-cover"
                              />
                            </div>
                          ) : (
                            <AvatarFallback className="text-2xl bg-primary text-white">
                              {user.firstName.charAt(0)}
                              {user.lastName.charAt(0)}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div
                          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Camera className="h-8 w-8 text-white" />
                        </div>
                        <input
                          type="file"
                          ref={fileInputRef}
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              const file = e.target.files[0]
                              const reader = new FileReader()
                              reader.onload = (event) => {
                                if (event.target?.result) {
                                  const imageUrl = event.target.result.toString()
                                  setAvatarImage(imageUrl)
                                  // Save to localStorage
                                  if (user?.id) {
                                    localStorage.setItem(`fixoo_avatar_${user.id}`, imageUrl)
                                  }
                                }
                              }
                              reader.readAsDataURL(file)
                            }
                          }}
                        />
                      </div>
                      <h2 className="text-xl font-bold">
                        {user.firstName} {user.lastName}
                      </h2>
                      <p className="text-primary font-medium mt-1">{getProfessionLabel(user.profession, language)}</p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Phone className="h-5 w-5 text-primary" />
                        <span>{user.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-primary" />
                        <span>
                          {getRegionLabel(user.region, language)},{" "}
                          {getDistrictLabel(user.region, user.district, language)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-5 w-5 text-primary" />
                        <span>{user.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-primary" />
                        <span>{getTranslation("availability", language)}: </span>
                        <Badge className={isAvailable ? "bg-green-500" : "bg-red-500"}>
                          {isAvailable ? getTranslation("available", language) : getTranslation("busy", language)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-yellow-500" />
                        <span>{getTranslation("profileActive", language)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <h3 className="text-lg font-semibold mb-4">{getTranslation("portfolioTitle", language)}</h3>
                    <MediaUpload language={language} onMediaUpload={handleMediaUpload} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {user.type === "specialist" ? (
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
