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
        <Button variant="outline" size="sm" className="gap-2">
          <Image
            src={`/flags/${currentLanguage}.png`}
            alt={currentLanguage}
            width={20}
            height={15}
            className="object-cover"
          />
          <span className="text-gray-900 dark:text-gray-100">{currentOption?.label || getTranslation(currentLanguage, currentLanguage)}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languageOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => handleLanguageChange(option.value)}
            className="flex items-center gap-2"
          >
            <Image
              src={`/flags/${option.value}.png`}
              alt={option.value}
              width={20}
              height={15}
              className="object-cover"
            />
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
