"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { regions, getDistricts } from "@/lib/location-data"
import { professions } from "@/lib/profession-data"
import { registerUser } from "@/lib/auth"
import { getTranslation, getStoredLanguage } from "@/lib/i18n"
import LanguageSwitcher from "@/components/language-switcher"
import { Eye, EyeOff } from "lucide-react"
import FadeIn from "@/components/fade-in"
import CrescentLoader from "@/components/crescent-loader"
import toast from 'react-hot-toast'

export default function SignUpPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedRegion, setSelectedRegion] = useState("")
  const [districts, setDistricts] = useState<any[]>([])
  const [userType, setUserType] = useState("specialist")
  const [language, setLanguage] = useState("uz")
  const [showSpecialistPassword, setShowSpecialistPassword] = useState(false)
  const [showClientPassword, setShowClientPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [specialistData, setSpecialistData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    password: "",
    profession: "",
    address: "",
    region: "",
    district: "",
  })

  const [clientData, setClientData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    password: "",
  })

  useEffect(() => {
    const storedLanguage = getStoredLanguage()
    setLanguage(storedLanguage)

    const type = searchParams.get("type")
    if (type === "specialist" || type === "client") {
      setUserType(type)
    }
  }, [searchParams])

  useEffect(() => {
    if (selectedRegion) {
      const regionDistricts = getDistricts(selectedRegion)
      setDistricts(regionDistricts)
      console.log("Tanlangan viloyat:", selectedRegion)
      console.log("Tumanlar soni:", regionDistricts.length)
      console.log("Tumanlar:", regionDistricts)
    } else {
      setDistricts([])
    }
  }, [selectedRegion])

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage)
  }

  const handleSpecialistChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSpecialistData((prev) => ({ ...prev, [name]: value }))
  }

  const handleClientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setClientData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSpecialistSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    setTimeout(() => {
      try {
        const result = registerUser({
          ...specialistData,
          type: "specialist",
        })

        if (result.success) {
          toast.success(
            language === 'uz' ? "Tabriklaymiz! Muvaffaqiyatli ro'yxatdan o'tdingiz!" :
            language === 'ru' ? "Поздравляем! Вы успешно зарегистрировались!" :
            "Congratulations! You have successfully registered!"
          )
          setTimeout(() => {
            router.push("/home")
          }, 500)
        } else {
          setIsLoading(false)
          toast.error(
            language === 'uz' ? "Xatolik! Iltimos, qaytadan urinib ko'ring." :
            language === 'ru' ? "Ошибка! Пожалуйста, попробуйте еще раз." :
            "Error! Please try again."
          )
        }
      } catch (err) {
        setIsLoading(false)
        toast.error(
          language === 'uz' ? "Xatolik! Iltimos, qaytadan urinib ko'ring." :
          language === 'ru' ? "Ошибка! Пожалуйста, попробуйте еще раз." :
          "Error! Please try again."
        )
      }
    }, 1500)
  }

  const handleClientSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    setTimeout(() => {
      try {
        const result = registerUser({
          ...clientData,
          type: "client",
        })

        if (result.success) {
          toast.success(
            language === 'uz' ? "Tabriklaymiz! Muvaffaqiyatli ro'yxatdan o'tdingiz!" :
            language === 'ru' ? "Поздравляем! Вы успешно зарегистрировались!" :
            "Congratulations! You have successfully registered!"
          )
          setTimeout(() => {
            router.push("/home")
          }, 500)
        } else {
          setIsLoading(false)
          toast.error(
            language === 'uz' ? "Xatolik! Iltimos, qaytadan urinib ko'ring." :
            language === 'ru' ? "Ошибка! Пожалуйста, попробуйте еще раз." :
            "Error! Please try again."
          )
        }
      } catch (err) {
        setIsLoading(false)
        toast.error(
          language === 'uz' ? "Xatolik! Iltimos, qaytadan urinib ko'ring." :
          language === 'ru' ? "Ошибка! Пожалуйста, попробуйте еще раз." :
          "Error! Please try again."
        )
      }
    }, 1500)
  }

  return (
    <div className="flex min-h-screen flex-col bg-primary">
      <div className="container mx-auto px-4 py-3 flex justify-end">
        <LanguageSwitcher onLanguageChange={handleLanguageChange} currentLanguage={language} />
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        {isLoading && (
          <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
            <div className="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <CrescentLoader size={60} className="mx-auto mb-4" />
              <p className="text-primary font-medium">{getTranslation("loading", language)}...</p>
            </div>
          </div>
        )}
        <FadeIn>
          <div className="w-full max-w-md space-y-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white">Fixoo</h1>
              <p className="mt-2 text-white/80">
                {userType === "specialist"
                  ? getTranslation("createAccountSpecialist", language)
                  : getTranslation("createAccountClient", language)}
              </p>
            </div>

            <Tabs defaultValue={userType} onValueChange={setUserType}>
              <TabsList className="grid w-full grid-cols-2 bg-primary-dark">
                <TabsTrigger
                  value="specialist"
                  className="data-[state=active]:bg-white data-[state=active]:text-primary"
                >
                  {getTranslation("specialist", language)}
                </TabsTrigger>
                <TabsTrigger value="client" className="data-[state=active]:bg-white data-[state=active]:text-primary">
                  {getTranslation("client", language)}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="specialist">
                <Card>
                  <CardHeader>
                    <CardTitle>{getTranslation("specialistRegistration", language)}</CardTitle>
                    <CardDescription>{getTranslation("createAccountSpecialist", language)}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSpecialistSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">{getTranslation("firstName", language)}</Label>
                          <Input
                            id="firstName"
                            name="firstName"
                            placeholder={getTranslation("firstName", language)}
                            required
                            value={specialistData.firstName}
                            onChange={handleSpecialistChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">{getTranslation("lastName", language)}</Label>
                          <Input
                            id="lastName"
                            name="lastName"
                            placeholder={getTranslation("lastName", language)}
                            required
                            value={specialistData.lastName}
                            onChange={handleSpecialistChange}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="phone">{getTranslation("phoneNumber", language)}</Label>
                          <Input
                            id="phone"
                            name="phone"
                            placeholder="+998 XX XXX XX XX"
                            required
                            value={specialistData.phone}
                            onChange={handleSpecialistChange}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="password">{getTranslation("password", language)}</Label>
                          <div className="relative">
                            <Input
                              id="password"
                              name="password"
                              type={showSpecialistPassword ? "text" : "password"}
                              placeholder="********"
                              required
                              value={specialistData.password}
                              onChange={handleSpecialistChange}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 h-full px-3 py-2 text-gray-400 hover:text-gray-600"
                              onClick={() => setShowSpecialistPassword(!showSpecialistPassword)}
                            >
                              {showSpecialistPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              <span className="sr-only">
                                {showSpecialistPassword
                                  ? getTranslation("hidePassword", language)
                                  : getTranslation("showPassword", language)}
                              </span>
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="profession">{getTranslation("profession", language)}</Label>
                          <Select
                            name="profession"
                            onValueChange={(value) => setSpecialistData((prev) => ({ ...prev, profession: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={getTranslation("selectProfession", language)} />
                            </SelectTrigger>
                            <SelectContent side="top" className="max-h-[200px] overflow-y-auto">
                              {professions.map((profession) => (
                                <SelectItem key={profession.value} value={profession.value}>
                                  {profession.label[language as keyof typeof profession.label] || profession.value}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="address">{getTranslation("address", language)}</Label>
                          <Input
                            id="address"
                            name="address"
                            placeholder={getTranslation("yourAddress", language)}
                            required
                            value={specialistData.address}
                            onChange={handleSpecialistChange}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="region">{getTranslation("region", language)}</Label>
                          <Select
                            name="region"
                            onValueChange={(value) => {
                              setSelectedRegion(value)
                              setSpecialistData((prev) => ({ ...prev, region: value, district: "" }))
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={getTranslation("selectRegion", language)} />
                            </SelectTrigger>
                            <SelectContent side="top" className="max-h-[200px] overflow-y-auto">
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
                            name="district"
                            onValueChange={(value) => setSpecialistData((prev) => ({ ...prev, district: value }))}
                            disabled={!selectedRegion}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={getTranslation("selectDistrict", language)} />
                            </SelectTrigger>
                            <SelectContent side="top" className="max-h-[200px] overflow-y-auto">
                              {districts.length > 0 ? (
                                districts.map((district) => (
                                  <SelectItem key={district.value} value={district.value}>
                                    {district.label[language as keyof typeof district.label] || district.value}
                                  </SelectItem>
                                ))
                              ) : (
                                <SelectItem value="no-districts" disabled>
                                  {getTranslation("selectRegionFirst", language) || "Avval viloyatni tanlang"}
                                </SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? (
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-5 h-5 rounded-full animate-spin border-y-2 border-solid border-purple-500 border-t-transparent shadow-md"></div>
                            <span>{getTranslation("loading", language)}...</span>
                          </div>
                        ) : (
                          getTranslation("register", language)
                        )}
                      </Button>
                    </form>
                  </CardContent>
                  <CardFooter className="flex justify-center">
                    <p className="text-sm text-gray-500">
                      {getTranslation("alreadyHaveAccount", language)}{" "}
                      <Link href="/login" className="text-primary font-medium hover:underline">
                        {getTranslation("login", language)}
                      </Link>
                    </p>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="client">
                <Card>
                  <CardHeader>
                    <CardTitle>{getTranslation("clientRegistration", language)}</CardTitle>
                    <CardDescription>{getTranslation("createAccountClient", language)}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleClientSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="clientFirstName">{getTranslation("firstName", language)}</Label>
                          <Input
                            id="clientFirstName"
                            name="firstName"
                            placeholder={getTranslation("firstName", language)}
                            required
                            value={clientData.firstName}
                            onChange={handleClientChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="clientLastName">{getTranslation("lastName", language)}</Label>
                          <Input
                            id="clientLastName"
                            name="lastName"
                            placeholder={getTranslation("lastName", language)}
                            required
                            value={clientData.lastName}
                            onChange={handleClientChange}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="clientPhone">{getTranslation("phoneNumber", language)}</Label>
                          <Input
                            id="clientPhone"
                            name="phone"
                            placeholder="+998 XX XXX XX XX"
                            required
                            value={clientData.phone}
                            onChange={handleClientChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="clientPassword">{getTranslation("password", language)}</Label>
                          <div className="relative">
                            <Input
                              id="clientPassword"
                              name="password"
                              type={showClientPassword ? "text" : "password"}
                              placeholder="********"
                              required
                              value={clientData.password}
                              onChange={handleClientChange}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 h-full px-3 py-2 text-gray-400 hover:text-gray-600"
                              onClick={() => setShowClientPassword(!showClientPassword)}
                            >
                              {showClientPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              <span className="sr-only">
                                {showClientPassword
                                  ? getTranslation("hidePassword", language)
                                  : getTranslation("showPassword", language)}
                              </span>
                            </Button>
                          </div>
                        </div>
                      </div>

                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? (
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-5 h-5 rounded-full animate-spin border-y-2 border-solid border-purple-500 border-t-transparent shadow-md"></div>
                            <span>{getTranslation("loading", language)}...</span>
                          </div>
                        ) : (
                          getTranslation("register", language)
                        )}
                      </Button>
                    </form>
                  </CardContent>
                  <CardFooter className="flex justify-center">
                    <p className="text-sm text-gray-500">
                      {getTranslation("alreadyHaveAccount", language)}{" "}
                      <Link href="/login" className="text-primary font-medium hover:underline">
                        {getTranslation("login", language)}
                      </Link>
                    </p>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </FadeIn>
      </div>
    </div>
  )
}
