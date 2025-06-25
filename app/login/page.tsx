"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { loginUser } from "@/lib/auth"
import { getTranslation, getStoredLanguage } from "@/lib/i18n"
import LanguageSwitcher from "@/components/language-switcher"
import { Eye, EyeOff } from "lucide-react"
import FadeIn from "@/components/fade-in"
// Yangi loader komponentini import qilish
import CrescentLoader from "@/components/crescent-loader"
import toast from 'react-hot-toast'

export default function LoginPage() {
  const router = useRouter()
  const [userType, setUserType] = useState("specialist")
  const [language, setLanguage] = useState("uz")
  const [error, setError] = useState("")
  const [showSpecialistPassword, setShowSpecialistPassword] = useState(false)
  const [showClientPassword, setShowClientPassword] = useState(false)
  // useState qismiga loading holatini qo'shish
  const [isLoading, setIsLoading] = useState(false)

  // Specialist login data
  const [specialistData, setSpecialistData] = useState({
    phone: "",
    password: "",
  })

  // Client login data
  const [clientData, setClientData] = useState({
    phone: "",
    password: "",
  })

  useEffect(() => {
    const storedLanguage = getStoredLanguage()
    setLanguage(storedLanguage)
  }, [])

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

  // handleSpecialistSubmit funksiyasini yangilash
  const handleSpecialistSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Formani oq rangga o'zgartirish uchun timeout
    setTimeout(() => {
      try {
        const user = loginUser(specialistData.phone, specialistData.password)
        if (user) {
          toast.success(
            language === 'uz' ? `Xush kelibsiz, ${user.firstName}!` :
            language === 'ru' ? `Добро пожаловать, ${user.firstName}!` :
            `Welcome back, ${user.firstName}!`
          )
          setTimeout(() => {
            router.push("/home")
          }, 500)
        } else {
          setError("User not found. Please check your phone number or register.")
          setIsLoading(false)
          toast.error(
            language === 'uz' ? "Telefon raqami yoki parol noto'g'ri!" :
            language === 'ru' ? "Неверный номер телефона или пароль!" :
            "Invalid phone number or password!"
          )
        }
      } catch (err) {
        setError("Login failed. Please try again.")
        setIsLoading(false)
        toast.error(
          language === 'uz' ? "Xatolik yuz berdi. Qaytadan urinib ko'ring!" :
          language === 'ru' ? "Произошла ошибка. Попробуйте еще раз!" :
          "An error occurred. Please try again!"
        )
      }
    }, 1500)
  }

  // handleClientSubmit funksiyasini yangilash
  const handleClientSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Formani oq rangga o'zgartirish uchun timeout
    setTimeout(() => {
      try {
        const user = loginUser(clientData.phone, clientData.password)
        if (user) {
          toast.success(
            language === 'uz' ? `Xush kelibsiz, ${user.firstName}!` :
            language === 'ru' ? `Добро пожаловать, ${user.firstName}!` :
            `Welcome back, ${user.firstName}!`
          )
          setTimeout(() => {
            router.push("/home")
          }, 500)
        } else {
          setError("User not found. Please check your phone number or register.")
          setIsLoading(false)
          toast.error(
            language === 'uz' ? "Telefon raqami yoki parol noto'g'ri!" :
            language === 'ru' ? "Неверный номер телефона или пароль!" :
            "Invalid phone number or password!"
          )
        }
      } catch (err) {
        setError("Login failed. Please try again.")
        setIsLoading(false)
        toast.error(
          language === 'uz' ? "Xatolik yuz berdi. Qaytadan urinib ko'ring!" :
          language === 'ru' ? "Произошла ошибка. Попробуйте еще раз!" :
          "An error occurred. Please try again!"
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
        <FadeIn>
          {isLoading && (
            <div className="fixed inset-0 bg-white flex items-center justify-center z-50 p-0 m-0">
              <div className="text-center bg-white w-full h-full flex flex-col items-center justify-center">
                {/* Yangi loader komponentini ishlatish */}
                <CrescentLoader size={60} className="mx-auto mb-4" />
                <p className="text-primary font-medium">{getTranslation("loading", language)}...</p>
              </div>
            </div>
          )}
          <div className="w-full max-w-sm space-y-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white">Fixoo</h1>
              <p className="mt-2 text-white/80">{getTranslation("loginToAccount", language)}</p>
            </div>

            <Tabs defaultValue="specialist" onValueChange={setUserType}>
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
                    <CardTitle>{getTranslation("login", language)}</CardTitle>
                    <CardDescription>{getTranslation("enterPhoneToLogin", language)}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSpecialistSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="specialistPhone">{getTranslation("phoneNumber", language)}</Label>
                        <Input
                          id="specialistPhone"
                          name="phone"
                          placeholder="+998 XX XXX XX XX"
                          required
                          value={specialistData.phone}
                          onChange={handleSpecialistChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="specialistPassword">{getTranslation("password", language)}</Label>
                        <div className="relative">
                          <Input
                            id="specialistPassword"
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

                      {error && <p className="text-sm text-red-500">{error}</p>}

                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? (
                          <div className="flex items-center justify-center gap-2">
                            {/* Yangi loader komponentini ishlatish */}
                            <div className="w-5 h-5 rounded-full animate-spin border-y-2 border-solid border-purple-500 border-t-transparent shadow-md"></div>
                            <span>{getTranslation("loading", language)}...</span>
                          </div>
                        ) : (
                          getTranslation("login", language)
                        )}
                      </Button>
                    </form>
                  </CardContent>
                  <CardFooter className="flex justify-center">
                    <p className="text-sm text-gray-500">
                      {getTranslation("dontHaveAccount", language)}{" "}
                      <Link href="/signup" className="text-primary font-medium hover:underline">
                        {getTranslation("register", language)}
                      </Link>
                    </p>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="client">
                <Card>
                  <CardHeader>
                    <CardTitle>{getTranslation("login", language)}</CardTitle>
                    <CardDescription>{getTranslation("enterPhoneToLogin", language)}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleClientSubmit} className="space-y-4">
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

                      {error && <p className="text-sm text-red-500">{error}</p>}

                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? (
                          <div className="flex items-center justify-center gap-2">
                            {/* Yangi loader komponentini ishlatish */}
                            <div className="w-5 h-5 rounded-full animate-spin border-y-2 border-solid border-purple-500 border-t-transparent shadow-md"></div>
                            <span>{getTranslation("loading", language)}...</span>
                          </div>
                        ) : (
                          getTranslation("login", language)
                        )}
                      </Button>
                    </form>
                  </CardContent>
                  <CardFooter className="flex justify-center">
                    <p className="text-sm text-gray-500">
                      {getTranslation("dontHaveAccount", language)}{" "}
                      <Link href="/signup" className="text-primary font-medium hover:underline">
                        {getTranslation("register", language)}
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
