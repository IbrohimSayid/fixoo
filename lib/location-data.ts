// Regions and districts data for Uzbekistan

type Region = {
  value: string
  label: {
    en: string
    uz: string
    ru: string
  }
}

type District = {
  value: string
  label: {
    en: string
    uz: string
    ru: string
  }
}

export const regions: Region[] = [
  {
    value: "tashkent",
    label: {
      en: "Tashkent",
      uz: "Toshkent",
      ru: "Ташкент",
    },
  },
  {
    value: "samarkand",
    label: {
      en: "Samarkand",
      uz: "Samarqand",
      ru: "Самарканд",
    },
  },
  {
    value: "bukhara",
    label: {
      en: "Bukhara",
      uz: "Buxoro",
      ru: "Бухара",
    },
  },
  {
    value: "andijan",
    label: {
      en: "Andijan",
      uz: "Andijon",
      ru: "Андижан",
    },
  },
  {
    value: "fergana",
    label: {
      en: "Fergana",
      uz: "Farg'ona",
      ru: "Фергана",
    },
  },
  {
    value: "namangan",
    label: {
      en: "Namangan",
      uz: "Namangan",
      ru: "Наманган",
    },
  },
  {
    value: "karakalpakstan",
    label: {
      en: "Karakalpakstan",
      uz: "Qoraqalpog'iston",
      ru: "Каракалпакстан",
    },
  },
  {
    value: "khorezm",
    label: {
      en: "Khorezm",
      uz: "Xorazm",
      ru: "Хорезм",
    },
  },
  {
    value: "kashkadarya",
    label: {
      en: "Kashkadarya",
      uz: "Qashqadaryo",
      ru: "Кашкадарья",
    },
  },
  {
    value: "surkhandarya",
    label: {
      en: "Surkhandarya",
      uz: "Surxondaryo",
      ru: "Сурхандарья",
    },
  },
  {
    value: "jizzakh",
    label: {
      en: "Jizzakh",
      uz: "Jizzax",
      ru: "Джизак",
    },
  },
  {
    value: "syrdarya",
    label: {
      en: "Syrdarya",
      uz: "Sirdaryo",
      ru: "Сырдарья",
    },
  },
  {
    value: "navoi",
    label: {
      en: "Navoi",
      uz: "Navoiy",
      ru: "Навои",
    },
  },
]

const districts: Record<string, District[]> = {
  tashkent: [
    {
      value: "mirabad",
      label: {
        en: "Mirabad",
        uz: "Mirobod",
        ru: "Мирабад",
      },
    },
    {
      value: "yunusabad",
      label: {
        en: "Yunusabad",
        uz: "Yunusobod",
        ru: "Юнусабад",
      },
    },
    {
      value: "chilanzar",
      label: {
        en: "Chilanzar",
        uz: "Chilonzor",
        ru: "Чиланзар",
      },
    },
    {
      value: "shaykhantaur",
      label: {
        en: "Shaykhantaur",
        uz: "Shayxontohur",
        ru: "Шайхантаур",
      },
    },
    {
      value: "almazar",
      label: {
        en: "Almazar",
        uz: "Olmazor",
        ru: "Алмазар",
      },
    },
    {
      value: "bektemir",
      label: {
        en: "Bektemir",
        uz: "Bektemir",
        ru: "Бектемир",
      },
    },
    {
      value: "sergeli",
      label: {
        en: "Sergeli",
        uz: "Sergeli",
        ru: "Сергели",
      },
    },
    {
      value: "yakkasaray",
      label: {
        en: "Yakkasaray",
        uz: "Yakkasaroy",
        ru: "Яккасарай",
      },
    },
    {
      value: "yashnabad",
      label: {
        en: "Yashnabad",
        uz: "Yashnobod",
        ru: "Яшнабад",
      },
    },
    {
      value: "uchtepa",
      label: {
        en: "Uchtepa",
        uz: "Uchtepa",
        ru: "Учтепа",
      },
    },
    {
      value: "tashkent_district",
      label: {
        en: "Tashkent District",
        uz: "Toshkent tumani",
        ru: "Ташкентский район",
      },
    },
  ],
  samarkand: [
    {
      value: "samarkand_city",
      label: {
        en: "Samarkand City",
        uz: "Samarqand shahri",
        ru: "Город Самарканд",
      },
    },
    {
      value: "urgut",
      label: {
        en: "Urgut",
        uz: "Urgut",
        ru: "Ургут",
      },
    },
    {
      value: "bulungur",
      label: {
        en: "Bulungur",
        uz: "Bulungʻur",
        ru: "Булунгур",
      },
    },
    {
      value: "jomboy",
      label: {
        en: "Jomboy",
        uz: "Jomboy",
        ru: "Джамбай",
      },
    },
    {
      value: "ishtixon",
      label: {
        en: "Ishtixon",
        uz: "Ishtixon",
        ru: "Иштыхан",
      },
    },
    {
      value: "kattaqorgon",
      label: {
        en: "Kattaqorgon",
        uz: "Kattaqoʻrgʻon",
        ru: "Каттакурган",
      },
    },
    {
      value: "narpay",
      label: {
        en: "Narpay",
        uz: "Narpay",
        ru: "Нарпай",
      },
    },
    {
      value: "nurobod",
      label: {
        en: "Nurobod",
        uz: "Nurobod",
        ru: "Нурабад",
      },
    },
    {
      value: "oqdaryo",
      label: {
        en: "Oqdaryo",
        uz: "Oqdaryo",
        ru: "Акдарья",
      },
    },
    {
      value: "payariq",
      label: {
        en: "Payariq",
        uz: "Payariq",
        ru: "Паярык",
      },
    },
    {
      value: "pastdargom",
      label: {
        en: "Pastdargom",
        uz: "Pastdargʻom",
        ru: "Пастдаргом",
      },
    },
    {
      value: "toyloq",
      label: {
        en: "Toyloq",
        uz: "Toyloq",
        ru: "Тайлак",
      },
    },
  ],
  bukhara: [
    {
      value: "bukhara_city",
      label: {
        en: "Bukhara City",
        uz: "Buxoro shahri",
        ru: "Город Бухара",
      },
    },
    {
      value: "karakul",
      label: {
        en: "Karakul",
        uz: "Qorakuʻl",
        ru: "Каракуль",
      },
    },
    {
      value: "gijduvan",
      label: {
        en: "Gijduvan",
        uz: "Gʻijduvon",
        ru: "Гиждуван",
      },
    },
    {
      value: "peshku",
      label: {
        en: "Peshku",
        uz: "Peshku",
        ru: "Пешку",
      },
    },
    {
      value: "romitan",
      label: {
        en: "Romitan",
        uz: "Romitan",
        ru: "Ромитан",
      },
    },
    {
      value: "jondor",
      label: {
        en: "Jondor",
        uz: "Jondor",
        ru: "Жондор",
      },
    },
    {
      value: "shofirkon",
      label: {
        en: "Shofirkon",
        uz: "Shofirkon",
        ru: "Шафиркан",
      },
    },
    {
      value: "kogon",
      label: {
        en: "Kogon",
        uz: "Kogon",
        ru: "Каган",
      },
    },
    {
      value: "olot",
      label: {
        en: "Olot",
        uz: "Olot",
        ru: "Алат",
      },
    },
    {
      value: "qorovulbozor",
      label: {
        en: "Qorovulbozor",
        uz: "Qorovulbozor",
        ru: "Караулбазар",
      },
    },
  ],
  namangan: [
    {
      value: "namangan_city",
      label: {
        en: "Namangan City",
        uz: "Namangan shahri",
        ru: "Город Наманган",
      },
    },
    {
      value: "chust",
      label: {
        en: "Chust",
        uz: "Chust",
        ru: "Чуст",
      },
    },
    {
      value: "pop",
      label: {
        en: "Pop",
        uz: "Pop",
        ru: "Поп",
      },
    },
    {
      value: "chartak",
      label: {
        en: "Chartak",
        uz: "Chortoq",
        ru: "Чартак",
      },
    },
    {
      value: "kasansay",
      label: {
        en: "Kasansay",
        uz: "Kosonsoy",
        ru: "Касансай",
      },
    },
    {
      value: "mingbuloq",
      label: {
        en: "Mingbuloq",
        uz: "Mingbuloq",
        ru: "Мингбулак",
      },
    },
    {
      value: "namangan_district",
      label: {
        en: "Namangan District",
        uz: "Namangan tumani",
        ru: "Наманганский район",
      },
    },
    {
      value: "norin",
      label: {
        en: "Norin",
        uz: "Norin",
        ru: "Нарын",
      },
    },
    {
      value: "toraqorgon",
      label: {
        en: "Toraqorgon",
        uz: "Toʻraqoʻrgʻon",
        ru: "Туракурган",
      },
    },
    {
      value: "uchqorgon",
      label: {
        en: "Uchqorgon",
        uz: "Uchqoʻrgʻon",
        ru: "Учкурган",
      },
    },
    {
      value: "uychi",
      label: {
        en: "Uychi",
        uz: "Uychi",
        ru: "Уйчи",
      },
    },
    {
      value: "yangiqorgon",
      label: {
        en: "Yangiqorgon",
        uz: "Yangiqoʻrgʻon",
        ru: "Янгикурган",
      },
    },
  ],
  andijan: [
    {
      value: "andijan_city",
      label: {
        en: "Andijan City",
        uz: "Andijon shahri",
        ru: "Город Андижан",
      },
    },
    {
      value: "asaka",
      label: {
        en: "Asaka",
        uz: "Asaka",
        ru: "Асака",
      },
    },
    {
      value: "shahrixon",
      label: {
        en: "Shahrixon",
        uz: "Shahrixon",
        ru: "Шахрихон",
      },
    },
    {
      value: "andijan_district",
      label: {
        en: "Andijan District",
        uz: "Andijon tumani",
        ru: "Андижанский район",
      },
    },
    {
      value: "baliqchi",
      label: {
        en: "Baliqchi",
        uz: "Baliqchi",
        ru: "Балыкчи",
      },
    },
    {
      value: "boz",
      label: {
        en: "Boz",
        uz: "Boz",
        ru: "Боз",
      },
    },
    {
      value: "buloqboshi",
      label: {
        en: "Buloqboshi",
        uz: "Buloqboshi",
        ru: "Булакбаши",
      },
    },
    {
      value: "izboskan",
      label: {
        en: "Izboskan",
        uz: "Izboskan",
        ru: "Избаскан",
      },
    },
    {
      value: "jalaquduq",
      label: {
        en: "Jalaquduq",
        uz: "Jalaquduq",
        ru: "Джалакудук",
      },
    },
    {
      value: "khojaobod",
      label: {
        en: "Khojaobod",
        uz: "Xoʻjaobod",
        ru: "Ходжаабад",
      },
    },
    {
      value: "marhamat",
      label: {
        en: "Marhamat",
        uz: "Marhamat",
        ru: "Мархамат",
      },
    },
    {
      value: "oltinkol",
      label: {
        en: "Oltinkol",
        uz: "Oltinkoʻl",
        ru: "Алтынкуль",
      },
    },
    {
      value: "paxtaobod",
      label: {
        en: "Paxtaobod",
        uz: "Paxtaobod",
        ru: "Пахтаабад",
      },
    },
    {
      value: "qorgontepa",
      label: {
        en: "Qorgontepa",
        uz: "Qoʻrgʻontepa",
        ru: "Кургантепа",
      },
    },
    {
      value: "ulugnor",
      label: {
        en: "Ulugnor",
        uz: "Ulugʻnor",
        ru: "Улугнор",
      },
    },
  ],
  fergana: [
    {
      value: "fergana_city",
      label: {
        en: "Fergana City",
        uz: "Farg'ona shahri",
        ru: "Город Фергана",
      },
    },
    {
      value: "margilan",
      label: {
        en: "Margilan",
        uz: "Marg'ilon",
        ru: "Маргилан",
      },
    },
    {
      value: "quvasoy",
      label: {
        en: "Quvasoy",
        uz: "Quvasoy",
        ru: "Кувасой",
      },
    },
    {
      value: "qoqon",
      label: {
        en: "Qoqon",
        uz: "Qoʻqon",
        ru: "Коканд",
      },
    },
    {
      value: "oltiariq",
      label: {
        en: "Oltiariq",
        uz: "Oltiariq",
        ru: "Алтыарык",
      },
    },
    {
      value: "bagdod",
      label: {
        en: "Bagdod",
        uz: "Bagʻdod",
        ru: "Багдад",
      },
    },
    {
      value: "beshariq",
      label: {
        en: "Beshariq",
        uz: "Beshariq",
        ru: "Бешарык",
      },
    },
    {
      value: "buvayda",
      label: {
        en: "Buvayda",
        uz: "Buvayda",
        ru: "Бувайда",
      },
    },
    {
      value: "dangara",
      label: {
        en: "Dangara",
        uz: "Dangʻara",
        ru: "Дангара",
      },
    },
    {
      value: "fergana_district",
      label: {
        en: "Fergana District",
        uz: "Fargʻona tumani",
        ru: "Ферганский район",
      },
    },
    {
      value: "furqat",
      label: {
        en: "Furqat",
        uz: "Furqat",
        ru: "Фуркат",
      },
    },
    {
      value: "qoshtepa",
      label: {
        en: "Qoshtepa",
        uz: "Qoʻshtepa",
        ru: "Куштепа",
      },
    },
    {
      value: "rishton",
      label: {
        en: "Rishton",
        uz: "Rishton",
        ru: "Риштан",
      },
    },
    {
      value: "sox",
      label: {
        en: "Sox",
        uz: "Soʻx",
        ru: "Сох",
      },
    },
    {
      value: "toshloq",
      label: {
        en: "Toshloq",
        uz: "Toshloq",
        ru: "Ташлак",
      },
    },
    {
      value: "uchkoprik",
      label: {
        en: "Uchkoprik",
        uz: "Uchkoʻprik",
        ru: "Учкуприк",
      },
    },
    {
      value: "uzbekiston",
      label: {
        en: "Uzbekiston",
        uz: "Oʻzbekiston",
        ru: "Узбекистан",
      },
    },
    {
      value: "yozyovon",
      label: {
        en: "Yozyovon",
        uz: "Yozyovon",
        ru: "Язъяван",
      },
    },
  ],
  karakalpakstan: [
    {
      value: "nukus",
      label: {
        en: "Nukus",
        uz: "Nukus",
        ru: "Нукус",
      },
    },
    {
      value: "amudaryo",
      label: {
        en: "Amudaryo",
        uz: "Amudaryo",
        ru: "Амударья",
      },
    },
    {
      value: "beruniy",
      label: {
        en: "Beruniy",
        uz: "Beruniy",
        ru: "Беруни",
      },
    },
    {
      value: "chimboy",
      label: {
        en: "Chimboy",
        uz: "Chimboy",
        ru: "Чимбай",
      },
    },
    {
      value: "ellikqala",
      label: {
        en: "Ellikqala",
        uz: "Ellikqala",
        ru: "Элликкала",
      },
    },
    {
      value: "kegeyli",
      label: {
        en: "Kegeyli",
        uz: "Kegeyli",
        ru: "Кегейли",
      },
    },
    {
      value: "moynaq",
      label: {
        en: "Moynaq",
        uz: "Moʻynoq",
        ru: "Муйнак",
      },
    },
    {
      value: "nukus_district",
      label: {
        en: "Nukus District",
        uz: "Nukus tumani",
        ru: "Нукусский район",
      },
    },
    {
      value: "qanlikol",
      label: {
        en: "Qanlikol",
        uz: "Qanlikoʻl",
        ru: "Канлыкуль",
      },
    },
    {
      value: "qoraozak",
      label: {
        en: "Qoraozak",
        uz: "Qoraoʻzak",
        ru: "Караузяк",
      },
    },
    {
      value: "qongirot",
      label: {
        en: "Qongirot",
        uz: "Qoʻngʻirot",
        ru: "Кунград",
      },
    },
    {
      value: "shumanay",
      label: {
        en: "Shumanay",
        uz: "Shumanay",
        ru: "Шуманай",
      },
    },
    {
      value: "taxiatosh",
      label: {
        en: "Taxiatosh",
        uz: "Taxiatosh",
        ru: "Тахиаташ",
      },
    },
    {
      value: "taxtakopir",
      label: {
        en: "Taxtakopir",
        uz: "Taxtakoʻpir",
        ru: "Тахтакупыр",
      },
    },
    {
      value: "tortkol",
      label: {
        en: "Tortkol",
        uz: "Toʻrtkoʻl",
        ru: "Турткуль",
      },
    },
    {
      value: "xojayli",
      label: {
        en: "Xojayli",
        uz: "Xoʻjayli",
        ru: "Ходжейли",
      },
    },
  ],
  khorezm: [
    {
      value: "urgench",
      label: {
        en: "Urgench",
        uz: "Urganch",
        ru: "Ургенч",
      },
    },
    {
      value: "bagat",
      label: {
        en: "Bagat",
        uz: "Bogʻot",
        ru: "Багат",
      },
    },
    {
      value: "gurlan",
      label: {
        en: "Gurlan",
        uz: "Gurlan",
        ru: "Гурлен",
      },
    },
    {
      value: "khazarasp",
      label: {
        en: "Khazarasp",
        uz: "Xazorasp",
        ru: "Хазарасп",
      },
    },
    {
      value: "khiva",
      label: {
        en: "Khiva",
        uz: "Xiva",
        ru: "Хива",
      },
    },
    {
      value: "qoshkopir",
      label: {
        en: "Qoshkopir",
        uz: "Qoʻshkoʻpir",
        ru: "Кошкупыр",
      },
    },
    {
      value: "shovot",
      label: {
        en: "Shovot",
        uz: "Shovot",
        ru: "Шават",
      },
    },
    {
      value: "urgench_district",
      label: {
        en: "Urgench District",
        uz: "Urganch tumani",
        ru: "Ургенчский район",
      },
    },
    {
      value: "yangiariq",
      label: {
        en: "Yangiariq",
        uz: "Yangiariq",
        ru: "Янгиарык",
      },
    },
    {
      value: "yangibozor",
      label: {
        en: "Yangibozor",
        uz: "Yangibozor",
        ru: "Янгибазар",
      },
    },
  ],
  kashkadarya: [
    {
      value: "karshi",
      label: {
        en: "Karshi",
        uz: "Qarshi",
        ru: "Карши",
      },
    },
    {
      value: "chirakchi",
      label: {
        en: "Chirakchi",
        uz: "Chiroqchi",
        ru: "Чиракчи",
      },
    },
    {
      value: "dehkanabad",
      label: {
        en: "Dehkanabad",
        uz: "Dehqonobod",
        ru: "Дехканабад",
      },
    },
    {
      value: "guzar",
      label: {
        en: "Guzar",
        uz: "Gʻuzor",
        ru: "Гузар",
      },
    },
    {
      value: "kamashi",
      label: {
        en: "Kamashi",
        uz: "Qamashi",
        ru: "Камаши",
      },
    },
    {
      value: "karshi_district",
      label: {
        en: "Karshi District",
        uz: "Qarshi tumani",
        ru: "Каршинский район",
      },
    },
    {
      value: "kasbi",
      label: {
        en: "Kasbi",
        uz: "Kasbi",
        ru: "Касби",
      },
    },
    {
      value: "kitab",
      label: {
        en: "Kitab",
        uz: "Kitob",
        ru: "Китаб",
      },
    },
    {
      value: "koson",
      label: {
        en: "Koson",
        uz: "Koson",
        ru: "Касан",
      },
    },
    {
      value: "mirishkor",
      label: {
        en: "Mirishkor",
        uz: "Mirishkor",
        ru: "Миришкор",
      },
    },
    {
      value: "muborak",
      label: {
        en: "Muborak",
        uz: "Muborak",
        ru: "Мубарек",
      },
    },
    {
      value: "nishon",
      label: {
        en: "Nishon",
        uz: "Nishon",
        ru: "Нишан",
      },
    },
    {
      value: "shahrisabz",
      label: {
        en: "Shahrisabz",
        uz: "Shahrisabz",
        ru: "Шахрисабз",
      },
    },
    {
      value: "yakkabog",
      label: {
        en: "Yakkabog",
        uz: "Yakkabogʻ",
        ru: "Яккабаг",
      },
    },
  ],
  surkhandarya: [
    {
      value: "termez",
      label: {
        en: "Termez",
        uz: "Termiz",
        ru: "Термез",
      },
    },
    {
      value: "angor",
      label: {
        en: "Angor",
        uz: "Angor",
        ru: "Ангор",
      },
    },
    {
      value: "bandixon",
      label: {
        en: "Bandixon",
        uz: "Bandixon",
        ru: "Бандихон",
      },
    },
    {
      value: "boysun",
      label: {
        en: "Boysun",
        uz: "Boysun",
        ru: "Байсун",
      },
    },
    {
      value: "denov",
      label: {
        en: "Denov",
        uz: "Denov",
        ru: "Денау",
      },
    },
    {
      value: "jarqorgon",
      label: {
        en: "Jarqorgon",
        uz: "Jarqoʻrgʻon",
        ru: "Джаркурган",
      },
    },
    {
      value: "kumkurgan",
      label: {
        en: "Kumkurgan",
        uz: "Qumqoʻrgʻon",
        ru: "Кумкурган",
      },
    },
    {
      value: "muzrabot",
      label: {
        en: "Muzrabot",
        uz: "Muzrabot",
        ru: "Музрабад",
      },
    },
    {
      value: "oltinsoy",
      label: {
        en: "Oltinsoy",
        uz: "Oltinsoy",
        ru: "Алтынсай",
      },
    },
    {
      value: "sariosiyo",
      label: {
        en: "Sariosiyo",
        uz: "Sariosiyo",
        ru: "Сариасия",
      },
    },
    {
      value: "sherobod",
      label: {
        en: "Sherobod",
        uz: "Sherobod",
        ru: "Шерабад",
      },
    },
    {
      value: "shorchi",
      label: {
        en: "Shorchi",
        uz: "Shoʻrchi",
        ru: "Шурчи",
      },
    },
    {
      value: "termez_district",
      label: {
        en: "Termez District",
        uz: "Termiz tumani",
        ru: "Термезский район",
      },
    },
    {
      value: "uzun",
      label: {
        en: "Uzun",
        uz: "Uzun",
        ru: "Узун",
      },
    },
  ],
  jizzakh: [
    {
      value: "jizzakh_city",
      label: {
        en: "Jizzakh City",
        uz: "Jizzax shahri",
        ru: "Город Джизак",
      },
    },
    {
      value: "arnasoy",
      label: {
        en: "Arnasoy",
        uz: "Arnasoy",
        ru: "Арнасай",
      },
    },
    {
      value: "bakhmal",
      label: {
        en: "Bakhmal",
        uz: "Baxmal",
        ru: "Бахмал",
      },
    },
    {
      value: "dostlik",
      label: {
        en: "Dostlik",
        uz: "Doʻstlik",
        ru: "Дустлик",
      },
    },
    {
      value: "forish",
      label: {
        en: "Forish",
        uz: "Forish",
        ru: "Фариш",
      },
    },
    {
      value: "gallaorol",
      label: {
        en: "Gallaorol",
        uz: "Gʻallaorol",
        ru: "Галляарал",
      },
    },
    {
      value: "jizzakh_district",
      label: {
        en: "Jizzakh District",
        uz: "Jizzax tumani",
        ru: "Джизакский район",
      },
    },
    {
      value: "mirzachol",
      label: {
        en: "Mirzachol",
        uz: "Mirzachoʻl",
        ru: "Мирзачуль",
      },
    },
    {
      value: "pakhtakor",
      label: {
        en: "Pakhtakor",
        uz: "Paxtakor",
        ru: "Пахтакор",
      },
    },
    {
      value: "yangiobod",
      label: {
        en: "Yangiobod",
        uz: "Yangiobod",
        ru: "Янгиабад",
      },
    },
    {
      value: "zaamin",
      label: {
        en: "Zaamin",
        uz: "Zomin",
        ru: "Заамин",
      },
    },
    {
      value: "zarbdor",
      label: {
        en: "Zarbdor",
        uz: "Zarbdor",
        ru: "Зарбдар",
      },
    },
  ],
  syrdarya: [
    {
      value: "gulistan",
      label: {
        en: "Gulistan",
        uz: "Guliston",
        ru: "Гулистан",
      },
    },
    {
      value: "akaltyn",
      label: {
        en: "Akaltyn",
        uz: "Oqoltin",
        ru: "Акалтын",
      },
    },
    {
      value: "bayaut",
      label: {
        en: "Bayaut",
        uz: "Boyovut",
        ru: "Баяут",
      },
    },
    {
      value: "gulistan_district",
      label: {
        en: "Gulistan District",
        uz: "Guliston tumani",
        ru: "Гулистанский район",
      },
    },
    {
      value: "khavast",
      label: {
        en: "Khavast",
        uz: "Xovos",
        ru: "Хаваст",
      },
    },
    {
      value: "mirzaabad",
      label: {
        en: "Mirzaabad",
        uz: "Mirzaobod",
        ru: "Мирзаабад",
      },
    },
    {
      value: "sardoba",
      label: {
        en: "Sardoba",
        uz: "Sardoba",
        ru: "Сардоба",
      },
    },
    {
      value: "saykhunabad",
      label: {
        en: "Saykhunabad",
        uz: "Sayxunobod",
        ru: "Сайхунабад",
      },
    },
    {
      value: "shirin",
      label: {
        en: "Shirin",
        uz: "Shirin",
        ru: "Ширин",
      },
    },
    {
      value: "sirdaryo",
      label: {
        en: "Sirdaryo",
        uz: "Sirdaryo",
        ru: "Сырдарья",
      },
    },
    {
      value: "yangiyer",
      label: {
        en: "Yangiyer",
        uz: "Yangiyer",
        ru: "Янгиер",
      },
    },
  ],
  navoi: [
    {
      value: "navoi_city",
      label: {
        en: "Navoi City",
        uz: "Navoiy shahri",
        ru: "Город Навои",
      },
    },
    {
      value: "kanimekh",
      label: {
        en: "Kanimekh",
        uz: "Konimex",
        ru: "Канимех",
      },
    },
    {
      value: "karmana",
      label: {
        en: "Karmana",
        uz: "Karmana",
        ru: "Карманa",
      },
    },
    {
      value: "khatyrchi",
      label: {
        en: "Khatyrchi",
        uz: "Xatirchi",
        ru: "Хатырчи",
      },
    },
    {
      value: "navbahor",
      label: {
        en: "Navbahor",
        uz: "Navbahor",
        ru: "Навбахор",
      },
    },
    {
      value: "nurota",
      label: {
        en: "Nurota",
        uz: "Nurota",
        ru: "Нурата",
      },
    },
    {
      value: "tamdy",
      label: {
        en: "Tamdy",
        uz: "Tomdi",
        ru: "Тамды",
      },
    },
    {
      value: "uchkuduk",
      label: {
        en: "Uchkuduk",
        uz: "Uchquduq",
        ru: "Учкудук",
      },
    },
    {
      value: "zarafshan",
      label: {
        en: "Zarafshan",
        uz: "Zarafshon",
        ru: "Зарафшан",
      },
    },
  ],
}

// Get region label based on language
export const getRegionLabel = (value: string, language: string): string => {
  const region = regions.find((r) => r.value === value)
  if (!region) return value

  return region.label[language as keyof typeof region.label] || value
}

// Get district label based on language
export const getDistrictLabel = (regionValue: string, districtValue: string, language: string): string => {
  const district = getDistricts(regionValue).find((d) => d.value === districtValue)
  if (!district) return districtValue

  return district.label[language as keyof typeof district.label] || districtValue
}

// Get districts for a region
export const getDistricts = (regionValue: string): District[] => {
  return districts[regionValue] || []
}
