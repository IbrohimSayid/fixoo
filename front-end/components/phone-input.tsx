"use client"

import React, { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { countries, defaultCountry, formatPhoneNumber, validatePhoneNumber, type Country } from "@/lib/countries-data"
import { getTranslation } from "@/lib/i18n"
import { ChevronDown, Phone } from "lucide-react"

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
  const [selectedCountry, setSelectedCountry] = useState<Country>(defaultCountry)
  const [inputValue, setInputValue] = useState("")
  const [isValid, setIsValid] = useState(true)

  // Value ni format qilish
  useEffect(() => {
    if (value) {
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
    
    // Yangi country code bilan formatlash
    const cleanValue = inputValue.replace(/\D/g, '')
    const newValue = formatPhoneNumber(cleanValue, newCountry)
    setInputValue(newValue)
    onChange(newValue)
  }

  // Input qiymat o'zgarganda
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value
    
    // Faqat raqamlar va + belgisini qoldirish
    const cleanValue = newValue.replace(/[^\d+]/g, '')
    
    // Agar country code boshqa country'nikiga o'xshasa, avtomatik o'zgartirish
    for (const country of countries) {
      if (cleanValue.startsWith(country.phoneCode.replace(/\D/g, '')) && country.code !== selectedCountry.code) {
        setSelectedCountry(country)
        break
      }
    }
    
    // Format qilish
    const formatted = formatPhoneNumber(cleanValue, selectedCountry)
    setInputValue(formatted)
    onChange(formatted)
    
    // Validatsiya
    const valid = validatePhoneNumber(formatted, selectedCountry)
    setIsValid(valid)
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
      
      <div className="flex gap-2">
        {/* Country Selector */}
        <Select value={selectedCountry.code} onValueChange={handleCountryChange}>
          <SelectTrigger className="w-[140px] flex-shrink-0">
            <SelectValue>
              <div className="flex items-center gap-2">
                <span>{selectedCountry.flag}</span>
                <span className="text-sm">{selectedCountry.phoneCode}</span>
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {countries.map((country) => (
              <SelectItem key={country.code} value={country.code}>
                <div className="flex items-center gap-2">
                  <span>{country.flag}</span>
                  <span>{country.name[language as keyof typeof country.name]}</span>
                  <span className="text-gray-500 text-sm">{country.phoneCode}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Phone Input */}
        <div className="flex-1">
          <Input
            type="tel"
            value={inputValue}
            onChange={handleInputChange}
            placeholder={selectedCountry.placeholder}
            className={`${error || (!isValid && inputValue) ? 'border-red-500' : ''}`}
          />
        </div>
      </div>

      {/* Format ko'rsatish */}
      <div className="flex items-center justify-between mt-1">
        <div className="text-xs text-gray-500">
          {getTranslation("format", language) || "Format"}: {selectedCountry.phoneFormat}
        </div>
        {inputValue && (
          <div className={`text-xs ${isValid ? 'text-green-600' : 'text-red-500'}`}>
            {isValid ? '✓' : '✗'}
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
      
      {!isValid && inputValue && !error && (
        <p className="text-red-500 text-sm mt-1">
          {language === 'uz' ? 'Telefon raqami formati noto\'g\'ri' :
           language === 'ru' ? 'Неверный формат номера телефона' :
           'Invalid phone number format'}
        </p>
      )}
    </div>
  )
} 