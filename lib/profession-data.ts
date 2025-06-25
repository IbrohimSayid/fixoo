// Professions data

type Profession = {
  value: string
  label: {
    en: string
    uz: string
    ru: string
    kz: string
    kg: string
    qq: string
  }
}

export const professions: Profession[] = [
  {
    value: "plumber",
    label: {
      en: "Plumber",
      uz: "Santexnik",
      ru: "Сантехник",
      kz: "Сантехник",
      kg: "Сантехник",
      qq: "Santexnik",
    },
  },
  {
    value: "electrician",
    label: {
      en: "Electrician",
      uz: "Elektrik",
      ru: "Электрик",
      kz: "Электрик",
      kg: "Электрик",
      qq: "Elektrik",
    },
  },
  {
    value: "carpenter",
    label: {
      en: "Carpenter",
      uz: "Duradgor",
      ru: "Плотник",
      kz: "Ағаш ұстасы",
      kg: "Жыгач устасы",
      qq: "Duradgor",
    },
  },
  {
    value: "painter",
    label: {
      en: "Painter",
      uz: "Bo'yoqchi",
      ru: "Маляр",
      kz: "Бояушы",
      kg: "Боёкчу",
      qq: "Bo'yoqshı",
    },
  },
  {
    value: "mechanic",
    label: {
      en: "Mechanic",
      uz: "Mexanik",
      ru: "Механик",
      kz: "Механик",
      kg: "Механик",
      qq: "Mexanik",
    },
  },
  {
    value: "gardener",
    label: {
      en: "Gardener",
      uz: "Bog'bon",
      ru: "Садовник",
      kz: "Бағбан",
      kg: "Багбан",
      qq: "Baǵban",
    },
  },
  {
    value: "cleaner",
    label: {
      en: "Cleaner",
      uz: "Tozalovchi",
      ru: "Уборщик",
      kz: "Тазалаушы",
      kg: "Тазалоочу",
      qq: "Tazalawshı",
    },
  },
  {
    value: "builder",
    label: {
      en: "Builder",
      uz: "Quruvchi",
      ru: "Строитель",
      kz: "Құрылысшы",
      kg: "Куруучу",
      qq: "Qurıwshı",
    },
  },
  {
    value: "locksmith",
    label: {
      en: "Locksmith",
      uz: "Qulfchi",
      ru: "Слесарь",
      kz: "Құлыпшы",
      kg: "Кулпучу",
      qq: "Qulıpshı",
    },
  },
  {
    value: "appliance_repair",
    label: {
      en: "Appliance Repair",
      uz: "Maishiy texnika ta'miri",
      ru: "Ремонт бытовой техники",
      kz: "Тұрмыстық техника жөндеуі",
      kg: "Турмуштук техника оңдоо",
      qq: "Maıshıy texnika jóndewi",
    },
  },
  {
    value: "hvac_technician",
    label: {
      en: "HVAC Technician",
      uz: "Isitish va sovutish tizimi mutaxassisi",
      ru: "Специалист по отоплению и охлаждению",
      kz: "Жылыту және салқындату жүйесі маманы",
      kg: "Жылуулук жана муздатуу системасынын адиси",
      qq: "Isıtıw hám salqındatıw sisteması mutaxassısı",
    },
  },
  {
    value: "roofer",
    label: {
      en: "Roofer",
      uz: "Tom yopuvchi",
      ru: "Кровельщик",
      kz: "Шатыр жабушысы",
      kg: "Чатыр жабуучу",
      qq: "Tom jabıwshı",
    },
  },
  {
    value: "welder",
    label: {
      en: "Welder",
      uz: "Payvandchi",
      ru: "Сварщик",
      kz: "Дәнекерлеуші",
      kg: "Дарылдоочу",
      qq: "Payvandshı",
    },
  },
  {
    value: "tiler",
    label: {
      en: "Tiler",
      uz: "Kafelchi",
      ru: "Плиточник",
      kz: "Кафель салушысы",
      kg: "Кафель салуучу",
      qq: "Kafelshı",
    },
  },
  {
    value: "plasterer",
    label: {
      en: "Plasterer",
      uz: "Suvoqchi",
      ru: "Штукатур",
      kz: "Сылақшы",
      kg: "Сылакчы",
      qq: "Sıwaqshı",
    },
  },
  {
    value: "furniture_assembler",
    label: {
      en: "Furniture Assembler",
      uz: "Mebel yig'uvchi",
      ru: "Сборщик мебели",
      kz: "Жиһаз жинаушысы",
      kg: "Эмерек чогултуучу",
      qq: "Mebel jıynawshı",
    },
  },
  {
    value: "computer_repair",
    label: {
      en: "Computer Repair",
      uz: "Kompyuter ta'miri",
      ru: "Ремонт компьютеров",
      kz: "Компьютер жөндеуі",
      kg: "Компьютер оңдоо",
      qq: "Kompyuter jóndewi",
    },
  },
  {
    value: "phone_repair",
    label: {
      en: "Phone Repair",
      uz: "Telefon ta'miri",
      ru: "Ремонт телефонов",
      kz: "Телефон жөндеуі",
      kg: "Телефон оңдоо",
      qq: "Telefon jóndewi",
    },
  },
  {
    value: "photographer",
    label: {
      en: "Photographer",
      uz: "Fotograf",
      ru: "Фотограф",
      kz: "Фотограф",
      kg: "Фотограф",
      qq: "Fotograf",
    },
  },
  {
    value: "videographer",
    label: {
      en: "Videographer",
      uz: "Videograf",
      ru: "Видеограф",
      kz: "Видеограф",
      kg: "Видеограф",
      qq: "Videograf",
    },
  },
  {
    value: "tutor",
    label: {
      en: "Tutor",
      uz: "Repetitor",
      ru: "Репетитор",
      kz: "Репетитор",
      kg: "Репетитор",
      qq: "Repetitor",
    },
  },
  {
    value: "translator",
    label: {
      en: "Translator",
      uz: "Tarjimon",
      ru: "Переводчик",
      kz: "Аудармашы",
      kg: "Котормочу",
      qq: "Tarjımanshı",
    },
  },
  {
    value: "driver",
    label: {
      en: "Driver",
      uz: "Haydovchi",
      ru: "Водитель",
      kz: "Жүргізуші",
      kg: "Айдоочу",
      qq: "Haydawshı",
    },
  },
  {
    value: "cook",
    label: {
      en: "Cook",
      uz: "Oshpaz",
      ru: "Повар",
      kz: "Аспаз",
      kg: "Ашпоз",
      qq: "Ashpaz",
    },
  },
  {
    value: "tailor",
    label: {
      en: "Tailor",
      uz: "Tikuvchi",
      ru: "Портной",
      kz: "Тігінші",
      kg: "Тикүүчү",
      qq: "Tikiwshi",
    },
  },
]

// Get profession label based on language
export const getProfessionLabel = (value: string, language: string): string => {
  const profession = professions.find((p) => p.value === value)
  if (!profession) return value

  return profession.label[language as keyof typeof profession.label] || profession.label.en || value
}
