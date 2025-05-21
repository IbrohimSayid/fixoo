// Professions data

type Profession = {
  value: string
  label: {
    en: string
    uz: string
    ru: string
  }
}

export const professions: Profession[] = [
  {
    value: "plumber",
    label: {
      en: "Plumber",
      uz: "Santexnik",
      ru: "Сантехник",
    },
  },
  {
    value: "electrician",
    label: {
      en: "Electrician",
      uz: "Elektrik",
      ru: "Электрик",
    },
  },
  {
    value: "carpenter",
    label: {
      en: "Carpenter",
      uz: "Duradgor",
      ru: "Плотник",
    },
  },
  {
    value: "painter",
    label: {
      en: "Painter",
      uz: "Bo'yoqchi",
      ru: "Маляр",
    },
  },
  {
    value: "mechanic",
    label: {
      en: "Mechanic",
      uz: "Mexanik",
      ru: "Механик",
    },
  },
  {
    value: "gardener",
    label: {
      en: "Gardener",
      uz: "Bog'bon",
      ru: "Садовник",
    },
  },
  {
    value: "cleaner",
    label: {
      en: "Cleaner",
      uz: "Tozalovchi",
      ru: "Уборщик",
    },
  },
  {
    value: "builder",
    label: {
      en: "Builder",
      uz: "Quruvchi",
      ru: "Строитель",
    },
  },
  {
    value: "locksmith",
    label: {
      en: "Locksmith",
      uz: "Qulfchi",
      ru: "Слесарь",
    },
  },
  {
    value: "appliance_repair",
    label: {
      en: "Appliance Repair",
      uz: "Maishiy texnika ta'miri",
      ru: "Ремонт бытовой техники",
    },
  },
  {
    value: "hvac_technician",
    label: {
      en: "HVAC Technician",
      uz: "Isitish va sovutish tizimi mutaxassisi",
      ru: "Специалист по отоплению и охлаждению",
    },
  },
  {
    value: "roofer",
    label: {
      en: "Roofer",
      uz: "Tom yopuvchi",
      ru: "Кровельщик",
    },
  },
  {
    value: "welder",
    label: {
      en: "Welder",
      uz: "Payvandchi",
      ru: "Сварщик",
    },
  },
  {
    value: "tiler",
    label: {
      en: "Tiler",
      uz: "Kafelchi",
      ru: "Плиточник",
    },
  },
  {
    value: "plasterer",
    label: {
      en: "Plasterer",
      uz: "Suvoqchi",
      ru: "Штукатур",
    },
  },
  {
    value: "furniture_assembler",
    label: {
      en: "Furniture Assembler",
      uz: "Mebel yig'uvchi",
      ru: "Сборщик мебели",
    },
  },
  {
    value: "computer_repair",
    label: {
      en: "Computer Repair",
      uz: "Kompyuter ta'miri",
      ru: "Ремонт компьютеров",
    },
  },
  {
    value: "phone_repair",
    label: {
      en: "Phone Repair",
      uz: "Telefon ta'miri",
      ru: "Ремонт телефонов",
    },
  },
  {
    value: "photographer",
    label: {
      en: "Photographer",
      uz: "Fotograf",
      ru: "Фотограф",
    },
  },
  {
    value: "videographer",
    label: {
      en: "Videographer",
      uz: "Videograf",
      ru: "Видеограф",
    },
  },
  {
    value: "tutor",
    label: {
      en: "Tutor",
      uz: "Repetitor",
      ru: "Репетитор",
    },
  },
  {
    value: "translator",
    label: {
      en: "Translator",
      uz: "Tarjimon",
      ru: "Переводчик",
    },
  },
  {
    value: "driver",
    label: {
      en: "Driver",
      uz: "Haydovchi",
      ru: "Водитель",
    },
  },
  {
    value: "cook",
    label: {
      en: "Cook",
      uz: "Oshpaz",
      ru: "Повар",
    },
  },
  {
    value: "tailor",
    label: {
      en: "Tailor",
      uz: "Tikuvchi",
      ru: "Портной",
    },
  },
]

// Get profession label based on language
export const getProfessionLabel = (value: string, language: string): string => {
  const profession = professions.find((p) => p.value === value)
  if (!profession) return value

  return profession.label[language as keyof typeof profession.label] || value
}
