"use client"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { languageOptions, storeLanguage, getTranslation } from "@/lib/i18n"
import Image from "next/image"

type LanguageSwitcherProps = {
  onLanguageChange: (language: string) => void
  currentLanguage: string
}

export default function LanguageSwitcher({ onLanguageChange, currentLanguage }: LanguageSwitcherProps) {
  const handleLanguageChange = (language: string) => {
    storeLanguage(language)
    onLanguageChange(language)
  }

  const currentOption = languageOptions.find(option => option.value === currentLanguage)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 px-2 gap-1">
          <Image
            src={`/flags/${currentLanguage}.png`}
            alt={currentLanguage}
            width={16}
            height={12}
            className="object-cover"
            style={{ width: '16px', height: '12px' }}
          />
          <span className="text-xs font-medium hidden sm:inline text-gray-900">
            {currentOption?.label.split(' ')[0] || currentLanguage.toUpperCase()}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {languageOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => handleLanguageChange(option.value)}
            className="flex items-center gap-2 py-2"
          >
            <Image
              src={`/flags/${option.value}.png`}
              alt={option.value}
              width={16}
              height={12}
              className="object-cover"
              style={{ width: '16px', height: '12px' }}
            />
            <span className="text-sm">{option.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
