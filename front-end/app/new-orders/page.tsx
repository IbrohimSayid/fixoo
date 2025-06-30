"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { regions, getDistricts } from "@/lib/location-data"
import { professions } from "@/lib/profession-data"
import { getTranslation, getStoredLanguage } from "@/lib/i18n"
import { orderAPI } from "@/lib/utils"
import { getUserData, checkUserAuthentication } from "@/lib/auth"
import { Clock, MapPin, Briefcase, FileText, DollarSign, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function NewOrderPage() {
  const router = useRouter()
  const [language, setLanguage] = useState("uz")
  const [selectedRegion, setSelectedRegion] = useState("")
  const [districts, setDistricts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<any>(null)

  const [orderData, setOrderData] = useState({
    title: "",
    description: "",
    profession: "",
    address: "",
    region: "",
    district: "",
    estimatedTime: "",
    urgency: "normal" as "urgent" | "normal" | "flexible",
    clientNote: ""
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedLanguage = getStoredLanguage()
      setLanguage(storedLanguage)

      // Check authentication
      if (!checkUserAuthentication()) {
        router.push('/login')
        return
      }

      const userData = getUserData()
      if (!userData || userData.role !== 'client') {
        toast.error('Faqat mijozlar buyurtma bera oladi')
        router.push('/home')
        return
      }

      setUser(userData)
    }
  }, [router])

  useEffect(() => {
    if (selectedRegion) {
      const regionDistricts = getDistricts(selectedRegion)
      setDistricts(regionDistricts)
      setOrderData(prev => ({ ...prev, region: selectedRegion, district: "" }))
    } else {
      setDistricts([])
    }
  }, [selectedRegion])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setOrderData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validation
      if (!orderData.title || !orderData.description || !orderData.profession || 
          !orderData.address || !orderData.region) {
        toast.error('Barcha majburiy maydonlarni to\'ldiring')
        setIsLoading(false)
        return
      }

      const token = localStorage.getItem('token')
      if (!token) {
        toast.error('Tizimga kiring')
        router.push('/login')
        return
      }

      const result = await orderAPI.create(orderData, token)

      if (result.success) {
        toast.success('Buyurtma muvaffaqiyatli yaratildi!')
        router.push('/orders')
      } else {
        toast.error(result.message || 'Xatolik yuz berdi')
      }
    } catch (error: any) {
      console.error('Order creation error:', error)
      toast.error(error.message || 'Server bilan bog\'lanishda xatolik')
    } finally {
      setIsLoading(false)
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'urgent': return 'destructive'
      case 'normal': return 'secondary'
      case 'flexible': return 'outline'
      default: return 'secondary'
    }
  }

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {getTranslation("newOrder", language)}
          </h1>
          <p className="text-gray-600">
            Yangi buyurtma yarating va eng yaqin ustalardan takliflar oling
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Buyurtma tafsilotlari
            </CardTitle>
            <CardDescription>
              Buyurtmangiz haqida batafsil ma'lumot bering
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Buyurtma nomi *
                </Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Masalan: Kran ta'mirlash, Elektr simlarini o'tkazish"
                  value={orderData.title}
                  onChange={handleInputChange}
                  required
                  maxLength={100}
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">
                  Batafsil ta'rif *
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Nima qilish kerakligini batafsil yozing..."
                  value={orderData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  maxLength={500}
                />
                <p className="text-xs text-gray-500">
                  {orderData.description.length}/500 belgi
                </p>
              </div>

              {/* Profession */}
              <div className="space-y-2">
                <Label htmlFor="profession">
                  Qaysi usta kerak? *
                </Label>
                <Select
                  onValueChange={(value) => setOrderData(prev => ({ ...prev, profession: value }))}
                  value={orderData.profession}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Kasb turini tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    {professions.map((profession) => (
                      <SelectItem key={profession.value} value={profession.value}>
                        {profession.label[language as keyof typeof profession.label] || profession.value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="region" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Viloyat *
                  </Label>
                  <Select
                    onValueChange={(value) => setSelectedRegion(value)}
                    value={selectedRegion}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Viloyatni tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      {regions.map((region) => (
                        <SelectItem key={region.value} value={region.value}>
                          {region.label[language as keyof typeof region.label] || region.value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="district">
                    Tuman
                  </Label>
                  <Select
                    onValueChange={(value) => setOrderData(prev => ({ ...prev, district: value }))}
                    value={orderData.district}
                    disabled={!selectedRegion}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tumanni tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      {districts.map((district) => (
                        <SelectItem key={district.value} value={district.value}>
                          {district.label[language as keyof typeof district.label] || district.value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="address">
                  To'liq manzil *
                </Label>
                <Input
                  id="address"
                  name="address"
                  placeholder="Ko'cha, uy raqami, mo'ljal"
                  value={orderData.address}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Estimated Time */}
              <div className="space-y-2">
                <Label htmlFor="estimatedTime" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Taxminiy vaqt
                </Label>
                <Input
                  id="estimatedTime"
                  name="estimatedTime"
                  placeholder="Masalan: 2 soat, 1 kun, 3 kun"
                  value={orderData.estimatedTime}
                  onChange={handleInputChange}
                />
              </div>

              {/* Urgency */}
              <div className="space-y-2">
                <Label htmlFor="urgency" className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Shoshilganlik darajasi
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'flexible', label: 'Muddatsiz', desc: 'Vaqt muhim emas' },
                    { value: 'normal', label: 'Oddiy', desc: 'Bir necha kun ichida' },
                    { value: 'urgent', label: 'Shoshilinch', desc: 'Bugun-ertaga' }
                  ].map((urgency) => (
                    <div
                      key={urgency.value}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        orderData.urgency === urgency.value
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setOrderData(prev => ({ ...prev, urgency: urgency.value as "urgent" | "normal" | "flexible" }))}
                    >
                      <div className="text-sm font-medium">{urgency.label}</div>
                      <div className="text-xs text-gray-500">{urgency.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Client Note */}
              <div className="space-y-2">
                <Label htmlFor="clientNote">
                  Qo'shimcha izoh
                </Label>
                <Textarea
                  id="clientNote"
                  name="clientNote"
                  placeholder="Muhim tafsilotlar, maxsus talablar..."
                  value={orderData.clientNote}
                  onChange={handleInputChange}
                  rows={3}
                  maxLength={300}
                />
                <p className="text-xs text-gray-500">
                  {orderData.clientNote.length}/300 belgi
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="flex-1"
                >
                  Bekor qilish
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full animate-spin border-2 border-white border-t-transparent"></div>
                      Yaratilmoqda...
                    </div>
                  ) : (
                    'Buyurtma berish'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
