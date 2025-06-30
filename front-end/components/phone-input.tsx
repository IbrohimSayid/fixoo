"use client"

import React, { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getTranslation } from "@/lib/i18n"
import { ChevronDown, Phone } from "lucide-react"
import Image from "next/image"

// Faqat 4 ta davlat bayroqlar bilan
const countries = [
  { 
    code: 'UZ', 
    name: { uz: "O'zbekiston", ru: "Узбекистан", en: "Uzbekistan" }, 
    phoneCode: '+998',
    phoneFormat: '+998 XX XXX XX XX',
    maxLength: 9,
    flag: '/flags/uz.png'
  },
  { 
    code: 'RU', 
    name: { uz: "Rossiya", ru: "Россия", en: "Russia" }, 
    phoneCode: '+7',
    phoneFormat: '+7 XXX XXX XX XX',
    maxLength: 10,
    flag: '/flags/ru.png'
  },
  { 
    code: 'KZ', 
    name: { uz: "Qozog'iston", ru: "Казахстан", en: "Kazakhstan" }, 
    phoneCode: '+7',
    phoneFormat: '+7 XXX XXX XX XX',
    maxLength: 10,
    flag: '/flags/kz.png'
  },
  { 
    code: 'KG', 
    name: { uz: "Qirg'iziston", ru: "Кыргызстан", en: "Kyrgyzstan" }, 
    phoneCode: '+996',
    phoneFormat: '+996 XXX XXX XXX',
    maxLength: 9,
    flag: '/flags/kg.png'
  }
]

const defaultCountry = countries[0] // O'zbekiston

interface PhoneInputProps {
  label?: string
  value: string
  onChange: (value: string) => void
  language: string
  required?: boolean
  error?: string
  className?: string
}

export default function PhoneInput({ 
  label, 
  value, 
  onChange, 
  language, 
  required = false, 
  error,
  className = "" 
}: PhoneInputProps) {
  const [selectedCountry, setSelectedCountry] = useState(defaultCountry)
  const [inputValue, setInputValue] = useState("")
  const [isInitialized, setIsInitialized] = useState(false)

  // Component birinchi marta mount bo'lganda default country code'ni o'rnatish
  useEffect(() => {
    if (!isInitialized && !value) {
      setInputValue(defaultCountry.phoneCode)
      onChange(defaultCountry.phoneCode)
      setIsInitialized(true)
    }
  }, [value, onChange, isInitialized])

  // Value ni format qilish
  useEffect(() => {
    if (value && value.trim() !== '') {
      setInputValue(value)
      // Country'ni value bo'yicha aniqlash
      for (const country of countries) {
        if (value.startsWith(country.phoneCode)) {
          setSelectedCountry(country)
          break
        }
      }
    }
  }, [value])

  // Country o'zgarganda
  const handleCountryChange = (countryCode: string) => {
    const newCountry = countries.find(c => c.code === countryCode) || defaultCountry
    setSelectedCountry(newCountry)
    
    // Har doim yangi country code'ni qo'yish
    const newValue = newCountry.phoneCode
    setInputValue(newValue)
    onChange(newValue)
  }

  // Input qiymat o'zgarganda
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value
    
    // Country code ni o'chirishga ruxsat bermaslik
    if (!newValue.startsWith(selectedCountry.phoneCode)) {
      return // O'zgarishni rad etish
    }
    
    // Faqat raqamlar, + va bo'shliqlarni qoldirish
    const cleanValue = newValue.replace(/[^\d+\s]/g, '')
    
    setInputValue(cleanValue)
    onChange(cleanValue)
  }

  // Backspace tugmasini boshqarish
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      const cursorPosition = (e.target as HTMLInputElement).selectionStart || 0
      // Agar cursor country code ichida bo'lsa, backspace ni bloklash
      if (cursorPosition <= selectedCountry.phoneCode.length) {
        e.preventDefault()
      }
    }
  }

  return (
    <div className={className}>
      {label && (
        <Label className="flex items-center gap-2 mb-2">
          <Phone className="w-4 h-4" />
          {label}
          {required && <span className="text-red-500">*</span>}
        </Label>
      )}
      
      <div className="relative">
        {/* Combined Input with Country Selector */}
        <div className="relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1 z-10">
            <Select value={selectedCountry.code} onValueChange={handleCountryChange}>
              <SelectTrigger className="border-0 bg-transparent p-0 h-auto focus:ring-0 focus:ring-offset-0 [&>svg]:hidden">
                <SelectValue>
                  <div className="flex items-center gap-1">
                    <Image 
                      src={selectedCountry.flag} 
                      alt={selectedCountry.code}
                      width={24} 
                      height={18} 
                    />
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    <div className="flex items-center gap-2">
                      <Image 
                        src={country.flag} 
                        alt={country.code}
                        width={24} 
                        height={18} 
                      />
                      <span className="font-medium">{country.name[language as keyof typeof country.name]}</span>
                      <span className="text-gray-500 text-sm">{country.phoneCode}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <ChevronDown className="w-3 h-3 text-gray-400 pointer-events-none" />
          </div>
          
          <Input
            type="tel"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={selectedCountry.phoneFormat}
            className={`pl-16 ${error ? 'border-red-500' : ''}`}
            required={required}
          />
        </div>
      </div>

      {/* Error message */}
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  )
} 