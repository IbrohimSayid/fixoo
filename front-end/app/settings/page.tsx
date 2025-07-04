"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { checkUserAuthentication, getUserData, logout } from "@/lib/auth"
import { getTranslation, getStoredLanguage, languageOptions } from "@/lib/i18n"
import { regions, getDistricts } from "@/lib/location-data"
import { professions } from "@/lib/profession-data"
import Header from "@/components/header"
import BottomNavigation from "@/components/bottom-navigation"
import ConfirmModal from "@/components/confirm-modal"
import PhoneInput from "@/components/phone-input"
import { Trash2, User, Globe, MessageCircle, ChevronRight } from "lucide-react"
import HammerLoader from "@/components/hammer-loader"
// Import the storage utility
import { saveUserProfile, deleteUserAccount } from "@/lib/storage"
import toast from 'react-hot-toast'
import { getCurrentUser, isTokenValid, userAPI } from "@/lib/utils"

export default function SettingsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [language, setLanguage] = useState("uz")
  const [selectedRegion, setSelectedRegion] = useState("")
  const [districts, setDistricts] = useState<any[]>([])
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    profession: "",
    address: "",
    region: "",
    district: "",
  })

  useEffect(() => {
    const loadUserData = async () => {
      // Token tekshirish
      if (!isTokenValid()) {
        router.push("/login")
        return
      }

      try {
        // User ma'lumotlarini backend'dan olish
        const userData = await getCurrentUser()
        
        if (!userData) {
          router.push("/login")
          return
        }

        setUser(userData)
        setUserData({
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          phone: userData.phone || "",
          profession: userData.profession || "",
          address: userData.address || "",
          region: userData.region || "",
          district: userData.district || "",
        })
        setSelectedRegion(userData.region || "")

        // Get stored language
        const storedLanguage = getStoredLanguage()
        setLanguage(storedLanguage)

      } catch (error) {
        console.error('Error loading user data:', error)
        router.push("/login")
      } finally {
        setIsLoading(false)
      }
    }

    loadUserData()
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
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUserData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    if (name === "region") {
      setSelectedRegion(value)
      setUserData((prev) => ({ ...prev, region: value, district: "" }))
    } else {
      setUserData((prev) => ({ ...prev, [name]: value }))
    }
  }

  // Update the handleSaveProfile function
  const handleSaveProfile = async () => {
    setIsSaving(true)
    
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push("/login")
        return
      }

      const result = await userAPI.updateProfile(userData, token)
      
      if (result.success) {
        // User state'ni yangilash
        setUser((prev: any) => ({ ...prev, ...userData }))
        
        toast.success(
          language === 'uz' ? "Profil muvaffaqiyatli yangilandi!" :
          language === 'ru' ? "Профиль успешно обновлен!" :
          "Profile updated successfully!"
        )
      } else {
        toast.error(result.message || 'Profilni yangilashda xatolik!')
      }
    } catch (error) {
      console.error('Profile update error:', error)
      toast.error('Server bilan bog\'lanishda xatolik!')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteAccount = () => {
    setIsDeleteModalOpen(true)
  }

  // Update the confirmDeleteAccount function
  const confirmDeleteAccount = () => {
    // Delete the user account from localStorage
    const success = deleteUserAccount(user.id)

    if (success) {
      logout()
      router.push("/signup")
    } else {
      alert(getTranslation("deleteAccountFailed", language))
      setIsDeleteModalOpen(false)
    }
  }

  if (isLoading) {
    return <HammerLoader fullScreen={true} showText={true} text={getTranslation("loading", language) + "..."} />
  }

  return (
    <div className="min-h-screen bg-primary/5 pb-16 md:pb-0">
      <Header user={user} onLogout={handleLogout} language={language} onLanguageChange={handleLanguageChange} />

      <main className="main-content container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">{getTranslation("settings", language)}</h1>

        <Tabs defaultValue="profile">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="profile" className="text-xs sm:text-sm">
              <User className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">{getTranslation("profileSettings", language)}</span>
              <span className="sm:hidden">Profil</span>
            </TabsTrigger>
            <TabsTrigger value="language" className="text-xs sm:text-sm">
              <Globe className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">{getTranslation("languageSettings", language)}</span>
              <span className="sm:hidden">Til</span>
            </TabsTrigger>
            <TabsTrigger value="support" className="text-xs sm:text-sm">
              <MessageCircle className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">{getTranslation("support", language)}</span>
              <span className="sm:hidden">Yordam</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader className="bg-primary/5 pb-4">
                <CardTitle>{getTranslation("editProfile", language)}</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">{getTranslation("firstName", language)}</Label>
                      <Input id="firstName" name="firstName" value={userData.firstName} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">{getTranslation("lastName", language)}</Label>
                      <Input id="lastName" name="lastName" value={userData.lastName} onChange={handleInputChange} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <PhoneInput
                        label={getTranslation("phoneNumber", language)}
                        value={userData.phone}
                        onChange={(value) => setUserData(prev => ({ ...prev, phone: value }))}
                        language={language}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profession">{getTranslation("profession", language)}</Label>
                      <Select
                        value={userData.profession}
                        onValueChange={(value) => handleSelectChange("profession", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={getTranslation("selectProfession", language)} />
                        </SelectTrigger>
                        <SelectContent className="max-h-[200px] overflow-y-auto">
                          {professions.map((profession) => (
                            <SelectItem key={profession.value} value={profession.value}>
                              {profession.label[language as keyof typeof profession.label] || profession.value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">{getTranslation("address", language)}</Label>
                    <Input id="address" name="address" value={userData.address} onChange={handleInputChange} />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="region">{getTranslation("region", language)}</Label>
                      <Select value={userData.region} onValueChange={(value) => handleSelectChange("region", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder={getTranslation("selectRegion", language)} />
                        </SelectTrigger>
                        <SelectContent className="max-h-[200px] overflow-y-auto">
                          {regions.map((region) => (
                            <SelectItem key={region.value} value={region.value}>
                              {region.label[language as keyof typeof region.label] || region.value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="district">{getTranslation("district", language)}</Label>
                      <Select
                        value={userData.district}
                        onValueChange={(value) => handleSelectChange("district", value)}
                        disabled={!selectedRegion}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={getTranslation("selectDistrict", language)} />
                        </SelectTrigger>
                        <SelectContent className="max-h-[200px] overflow-y-auto">
                          {districts.map((district) => (
                            <SelectItem key={district.value} value={district.value}>
                              {district.label[language as keyof typeof district.label] || district.value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:justify-between gap-2 pt-4">
                    <Button
                      type="button"
                      variant="destructive"
                      className="flex items-center gap-2 text-sm"
                      onClick={handleDeleteAccount}
                    >
                      <Trash2 className="h-4 w-4" />
                      {getTranslation("deleteAccount", language)}
                    </Button>
                    <Button 
                      type="button" 
                      onClick={handleSaveProfile} 
                      className="text-sm"
                      disabled={isSaving}
                    >
                      {isSaving ? 'Saqlanmoqda...' : getTranslation("saveChanges", language)}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="language">
            <Card>
              <CardHeader className="bg-primary/5 pb-4">
                <CardTitle>{getTranslation("languageSettings", language)}</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="language">{getTranslation("selectLanguage", language)}</Label>
                    <Select value={language} onValueChange={handleLanguageChange}>
                      <SelectTrigger>
                        <SelectValue placeholder={getTranslation("selectLanguage", language)} />
                      </SelectTrigger>
                      <SelectContent>
                        {languageOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="support">
            <div className="space-y-4">
              {/* Support Info Card */}
              <Card>
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <MessageCircle className="w-12 h-12 mx-auto text-blue-500" />
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-primary">
                        {getTranslation("supportTitle", language)}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {getTranslation("supportDescription", language)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {getTranslation("supportReady", language)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Support Bot Button */}
              <Card>
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <p className="text-sm text-gray-600">
                      {getTranslation("supportContact", language)}
                    </p>
                    <Button 
                      asChild
                      className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6"
                    >
                      <a 
                        href="https://t.me/fixoomessagebot" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2"
                      >
                        <MessageCircle className="w-5 h-5" />
                        {getTranslation("supportBotName", language)}
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Footer Message */}
              <Card>
                <CardContent className="p-4">
                  <div className="text-center space-y-2">
                    <p className="text-sm text-muted-foreground">
                      {getTranslation("supportTeam", language)}
                    </p>
                    <p className="text-sm font-medium text-primary">
                      {getTranslation("supportImportant", language)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <BottomNavigation language={language} />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteAccount}
        title={getTranslation("deleteAccountTitle", language)}
        description={getTranslation("deleteAccountDescription", language)}
        language={language}
      />
    </div>
  )
}
