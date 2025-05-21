// Language translations for the application

type Translations = {
  [key: string]: {
    [key: string]: string
  }
}

export const translations: Translations = {
  // Header and common elements
  header: {
    en: "Fixoo - Connect with Specialists",
    uz: "Fixoo - Ustalar bilan bog'laning",
    ru: "Fixoo - Свяжитесь со специалистами",
  },
  welcome: {
    en: "Welcome",
    uz: "Xush kelibsiz",
    ru: "Добро пожаловать",
  },
  logout: {
    en: "Logout",
    uz: "Chiqish",
    ru: "Выход",
  },
  loading: {
    en: "Loading",
    uz: "Yuklanmoqda",
    ru: "Загрузка",
  },
  yes: {
    en: "Yes",
    uz: "Ha",
    ru: "Да",
  },
  no: {
    en: "No",
    uz: "Yo'q",
    ru: "Нет",
  },
  submit: {
    en: "Submit",
    uz: "Jo'natish",
    ru: "Отправить",
  },
  submitting: {
    en: "Submitting...",
    uz: "Jo'natilmoqda...",
    ru: "Отправка...",
  },
  cancel: {
    en: "Cancel",
    uz: "Bekor qilish",
    ru: "Отмена",
  },

  // Authentication
  login: {
    en: "Login",
    uz: "Kirish",
    ru: "Вход",
  },
  register: {
    en: "Register",
    uz: "Ro'yxatdan o'tish",
    ru: "Регистрация",
  },
  alreadyHaveAccount: {
    en: "Already have an account?",
    uz: "Akkauntingiz bormi?",
    ru: "Уже есть аккаунт?",
  },
  dontHaveAccount: {
    en: "Don't have an account?",
    uz: "Akkauntingiz yo'qmi?",
    ru: "Нет аккаунта?",
  },
  phoneNumber: {
    en: "Phone Number",
    uz: "Telefon raqami",
    ru: "Номер телефона",
  },
  enterPhoneToLogin: {
    en: "Enter your phone number to login",
    uz: "Kirish uchun telefon raqamingizni kiriting",
    ru: "Введите номер телефона для входа",
  },
  loginToAccount: {
    en: "Login to your account",
    uz: "Akkauntingizga kiring",
    ru: "Войдите в свой аккаунт",
  },
  password: {
    en: "Password",
    uz: "Parol",
    ru: "Пароль",
  },
  showPassword: {
    en: "Show password",
    uz: "Parolni ko'rsatish",
    ru: "Показать пароль",
  },
  hidePassword: {
    en: "Hide password",
    uz: "Parolni yashirish",
    ru: "��крыть пароль",
  },

  // Registration
  firstName: {
    en: "First Name",
    uz: "Ism",
    ru: "Имя",
  },
  lastName: {
    en: "Last Name",
    uz: "Familiya",
    ru: "Имя",
  },
  specialistRegistration: {
    en: "Specialist Registration",
    uz: "Usta ro'yxatdan o'tishi",
    ru: "Регистрация специалиста",
  },
  clientRegistration: {
    en: "Client Registration",
    uz: "Mijoz ro'yxatdan o'tishi",
    ru: "Регистрация клиента",
  },
  createAccountSpecialist: {
    en: "Create an account to offer your services",
    uz: "Xizmatlaringizni taklif qilish uchun akkount yarating",
    ru: "Создайте аккаунт, чтобы предлагать свои услуги",
  },
  createAccountClient: {
    en: "Create an account to find specialists",
    uz: "Ustalarni topish uchun akkount yarating",
    ru: "Создайте аккаунт, чтобы найти специалистов",
  },
  specialist: {
    en: "Specialist",
    uz: "Usta",
    ru: "Специалист",
  },
  client: {
    en: "Client",
    uz: "Mijoz",
    ru: "Клиент",
  },
  profession: {
    en: "Profession",
    uz: "Kasb",
    ru: "Профессия",
  },
  selectProfession: {
    en: "Select profession",
    uz: "Kasbni tanlang",
    ru: "Выберите профессию",
  },
  address: {
    en: "Address",
    uz: "Manzil",
    ru: "Адрес",
  },
  yourAddress: {
    en: "Your address",
    uz: "Manzilingiz",
    ru: "Ваш адрес",
  },
  region: {
    en: "Region",
    uz: "Viloyat",
    ru: "Регион",
  },
  selectRegion: {
    en: "Select region",
    uz: "Viloyatni tanlang",
    ru: "Выберите регион",
  },
  district: {
    en: "District",
    uz: "Tuman",
    ru: "Район",
  },
  selectDistrict: {
    en: "Select district",
    uz: "Tumanni tanlang",
    ru: "Выберите район",
  },
  selectRegionFirst: {
    en: "Please select a region first",
    uz: "Avval viloyatni tanlang",
    ru: "Сначала выберите регион",
  },

  // Home page
  findSpecialists: {
    en: "Find Specialists",
    uz: "Ustalarni topish",
    ru: "Найти специалистов",
  },
  allProfessions: {
    en: "All Professions",
    uz: "Barcha kasblar",
    ru: "Все профессии",
  },
  allRegions: {
    en: "All Regions",
    uz: "Barcha viloyatlar",
    ru: "Все регионы",
  },
  allDistricts: {
    en: "All Districts",
    uz: "Barcha tumanlar",
    ru: "Все районы",
  },
  searchByName: {
    en: "Search by name or profession",
    uz: "Ism yoki kasb bo'yicha qidirish",
    ru: "Поиск по имени или профессии",
  },
  noSpecialistsFound: {
    en: "No specialists found matching your criteria",
    uz: "Sizning mezoningizga mos ustalar topilmadi",
    ru: "Не найдено специалистов, соответствующих вашим критериям",
  },
  contact: {
    en: "Contact",
    uz: "Aloqa",
    ru: "Контакт",
  },
  contactSpecialist: {
    en: "Contact Specialist",
    uz: "Usta bilan bog'lanish",
    ru: "Связаться со специалистом",
  },
  specialistAvailable: {
    en: "Available",
    uz: "Band emas",
    ru: "Доступен",
  },
  specialistBusy: {
    en: "Busy",
    uz: "Band",
    ru: "Занят",
  },
  yourSpecialistProfile: {
    en: "Your Specialist Profile",
    uz: "Sizning usta profilingiz",
    ru: "Ваш профиль специалиста",
  },
  personalInformation: {
    en: "Personal Information",
    uz: "Shaxsiy ma'lumotlar",
    ru: "Личная информация",
  },
  name: {
    en: "Name",
    uz: "Ism",
    ru: "Имя",
  },
  phone: {
    en: "Phone",
    uz: "Telefon",
    ru: "Телефон",
  },
  location: {
    en: "Location",
    uz: "Joylashuv",
    ru: "Местоположение",
  },
  accountStatus: {
    en: "Account Status",
    uz: "Akkount holati",
    ru: "Статус аккаунта",
  },
  profileActive: {
    en: "Your profile is active and visible to clients",
    uz: "Sizning profilingiz faol va mijozlarga ko'rinadi",
    ru: "Ваш профиль активен и виден клиентам",
  },
  accountActiveFor: {
    en: "Your account will remain active for 30 days",
    uz: "Sizning akkauntingiz 30 kun davomida faol bo'ladi",
    ru: "Ваш аккаунт будет активен в течение 30 дней",
  },

  // Languages
  language: {
    en: "Language",
    uz: "Til",
    ru: "Язык",
  },
  english: {
    en: "English",
    uz: "Ingliz",
    ru: "Английский",
  },
  uzbek: {
    en: "Uzbek",
    uz: "O'zbek",
    ru: "Узбекский",
  },
  russian: {
    en: "Russian",
    uz: "Rus",
    ru: "Русский",
  },

  // Logout confirmation
  logoutConfirmTitle: {
    en: "Confirm Logout",
    uz: "Chiqishni tasdiqlang",
    ru: "Подтвердите выход",
  },
  logoutConfirmDescription: {
    en: "Are you sure you want to logout from your account?",
    uz: "Haqiqatan ham akkauntingizdan chiqmoqchimisiz?",
    ru: "Вы уверены, что хотите выйти из своего аккаунта?",
  },

  // Portfolio
  portfolioTitle: {
    en: "Your Portfolio",
    uz: "Sizning portfoliongiz",
    ru: "Ваше портфолио",
  },
  uploadMedia: {
    en: "Upload Photos/Videos",
    uz: "Rasm/Video yuklash",
    ru: "Загрузить фото/видео",
  },
  uploadMediaDescription: {
    en: "Upload photos and videos of your work to attract more clients",
    uz: "Ko'proq mijozlarni jalb qilish uchun ishlaringizning rasmlarini va videolarini yuklang",
    ru: "Загрузите фотографии и видео своей работы, чтобы привлечь больше клиентов",
  },

  // Navigation
  newOrders: {
    en: "New Orders",
    uz: "Yangi buyurtmalar",
    ru: "Новые заказы",
  },
  ordersList: {
    en: "Orders List",
    uz: "Buyurtmalar ro'yxati",
    ru: "Список заказов",
  },
  settings: {
    en: "Settings",
    uz: "Sozlamalar",
    ru: "Настройки",
  },

  // Orders
  description: {
    en: "Description",
    uz: "Tavsif",
    ru: "Описание",
  },
  date: {
    en: "Date",
    uz: "Sana",
    ru: "Дата",
  },
  status: {
    en: "Status",
    uz: "Holat",
    ru: "Статус",
  },
  accept: {
    en: "Accept",
    uz: "Qabul qilish",
    ru: "Принять",
  },
  reject: {
    en: "Reject",
    uz: "Rad etish",
    ru: "Отклонить",
  },
  accepted: {
    en: "Accepted",
    uz: "Qabul qilingan",
    ru: "Принято",
  },
  rejected: {
    en: "Rejected",
    uz: "Rad etilgan",
    ru: "Отклонено",
  },
  completed: {
    en: "Completed",
    uz: "Bajarilgan",
    ru: "Выполнено",
  },
  pending: {
    en: "Pending",
    uz: "Kutilmoqda",
    ru: "В ожидании",
  },
  noNewOrders: {
    en: "No new orders at the moment",
    uz: "Hozircha yangi buyurtmalar yo'q",
    ru: "На данный момент новых заказов нет",
  },
  allOrders: {
    en: "All Orders",
    uz: "Barcha buyurtmalar",
    ru: "Все заказы",
  },
  clientName: {
    en: "Client Name",
    uz: "Mijoz ismi",
    ru: "Имя клиента",
  },
  specialistName: {
    en: "Specialist Name",
    uz: "Usta ismi",
    ru: "Имя специалиста",
  },

  // Job Request
  requestSpecialist: {
    en: "Request Specialist",
    uz: "Ustaga buyurtma berish",
    ru: "Заказать специалиста",
  },
  requestSpecialistDescription: {
    en: "Please provide details about the job you need help with from",
    uz: "Iltimos, quyidagi ustadan yordam kerak bo'lgan ish haqida ma'lumot bering",
    ru: "Пожалуйста, предоставьте информацию о работе, с которой вам нужна помощь от",
  },
  jobDescription: {
    en: "Job Description",
    uz: "Ish tavsifi",
    ru: "Описание работы",
  },
  jobDescriptionPlaceholder: {
    en: "Please describe the job you need help with...",
    uz: "Iltimos, yordam kerak bo'lgan ishni tasvirlab bering...",
    ru: "Пожалуйста, опишите работу, с которой вам нужна помощь...",
  },
  jobLocation: {
    en: "Job Location",
    uz: "Ish manzili",
    ru: "Место работы",
  },
  jobLocationPlaceholder: {
    en: "Enter the address where the job needs to be done",
    uz: "Ish bajarilishi kerak bo'lgan manzilni kiriting",
    ru: "Введите адрес, где нужно выполнить работу",
  },
  pleaseCompleteAllFields: {
    en: "Please complete all fields",
    uz: "Iltimos, barcha maydonlarni to'ldiring",
    ru: "Пожалуйста, заполните все поля",
  },
  loginRequired: {
    en: "You need to be logged in to submit a job request",
    uz: "Buyurtma berish uchun tizimga kirishingiz kerak",
    ru: "Вам необходимо войти в систему, чтобы отправить заявку на работу",
  },
  orderSubmittedSuccessfully: {
    en: "Your order has been submitted successfully",
    uz: "Sizning buyurtmangiz muvaffaqiyatli yuborildi",
    ru: "Ваш заказ успешно отправлен",
  },

  // Settings
  profileSettings: {
    en: "Profile Settings",
    uz: "Profil sozlamalari",
    ru: "Настройки профиля",
  },
  languageSettings: {
    en: "Language Settings",
    uz: "Til sozlamalari",
    ru: "Настройки языка",
  },
  selectLanguage: {
    en: "Select Language",
    uz: "Tilni tanlang",
    ru: "Выберите язык",
  },
  editProfile: {
    en: "Edit Profile",
    uz: "Profilni tahrirlash",
    ru: "Редактировать профиль",
  },
  saveChanges: {
    en: "Save Changes",
    uz: "O'zgarishlarni saqlash",
    ru: "Сохранить изменения",
  },
  profileUpdated: {
    en: "Profile updated successfully",
    uz: "Profil muvaffaqiyatli yangilandi",
    ru: "Профиль успешно обновлен",
  },
  deleteAccount: {
    en: "Delete Account",
    uz: "Akkauntni o'chirish",
    ru: "Удалить аккаунт",
  },
  deleteAccountTitle: {
    en: "Delete Account",
    uz: "Akkauntni o'chirish",
    ru: "Удалить аккаунт",
  },
  deleteAccountDescription: {
    en: "Are you sure you want to delete your account? This action cannot be undone.",
    uz: "Haqiqatan ham akkauntingizni o'chirmoqchimisiz? Bu amalni qaytarib bo'lmaydi.",
    ru: "Вы уверены, что хотите удалить свой аккаунт? Это действие нельзя отменить.",
  },
  profileUpdateFailed: {
    en: "Failed to update profile. Please try again.",
    uz: "Profilni yangilashda xatolik yuz berdi. Iltimos, qayta urinib ko'ring.",
    ru: "Не удалось обновить профиль. Пожалуйста, попробуйте еще раз.",
  },
  deleteAccountFailed: {
    en: "Failed to delete account. Please try again.",
    uz: "Akkauntni o'chirishda xatolik yuz berdi. Iltimos, qayta urinib ko'ring.",
    ru: "Не удалось удалить аккаунт. Пожалуйста, попробуйте еще раз.",
  },

  // Availability
  availability: {
    en: "Availability",
    uz: "Bandlik holati",
    ru: "Доступность",
  },
  availabilityStatus: {
    en: "Availability Status",
    uz: "Bandlik holati",
    ru: "Статус доступности",
  },
  available: {
    en: "Available",
    uz: "Band emas",
    ru: "Доступен",
  },
  busy: {
    en: "Busy",
    uz: "Band",
    ru: "Занят",
  },
  setAvailable: {
    en: "Set as Available",
    uz: "Band emas deb belgilash",
    ru: "Отметить как доступен",
  },
  setBusy: {
    en: "Set as Busy",
    uz: "Band deb belgilash",
    ru: "Отметить как занят",
  },
}

// Get translation for a key in the current language
export const getTranslation = (key: string, language: string): string => {
  const keyParts = key.split(".")
  let translationObj: any = translations

  for (const part of keyParts) {
    if (!translationObj[part]) {
      return key // Return the key if translation not found
    }
    translationObj = translationObj[part]
  }

  return translationObj[language] || key
}

// Language options for the dropdown
export const languageOptions = [
  { value: "uz", label: "O'zbek" },
  { value: "en", label: "English" },
  { value: "ru", label: "Русский" },
]

// Get the stored language or default to Uzbek
export const getStoredLanguage = (): string => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("fixoo_language") || "uz"
  }
  return "uz"
}

// Store the selected language
export const storeLanguage = (language: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("fixoo_language", language)
  }
}
