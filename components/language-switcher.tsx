"use client"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          size="sm"
          className="h-8 gap-2 bg-white text-primary outline outline-primary hover:bg-primary hover:text-white hover:outline-white transition-colors"
        >
          <Globe className="h-4 w-4" />
          <span>{getTranslation("language", currentLanguage)}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languageOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => handleLanguageChange(option.value)}
            className={`${currentLanguage === option.value ? "bg-primary/10 font-medium" : ""} flex items-center gap-2`}
          >
            <div className="w-5 h-3 relative overflow-hidden">
              <Image src={`/flags/${option.value}.svg`} alt={option.label} fill className="object-cover" />
            </div>
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
