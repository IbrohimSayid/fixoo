export interface Country {
  code: string;
  name: {
    uz: string;
    ru: string;
    en: string;
  };
  phoneCode: string;
  phoneFormat: string;
  placeholder: string;
  flag: string;
}

export const countries: Country[] = [
  {
    code: "UZ",
    name: {
      uz: "O'zbekiston",
      ru: "Узбекистан", 
      en: "O'zbekiston"
    },
    phoneCode: "+998",
    phoneFormat: "+998 XX XXX XX XX",
    placeholder: "+998 90 123 45 67",
    flag: "🇺🇿"
  },
  {
    code: "RU",
    name: {
      uz: "Rossiya",
      ru: "Россия",
      en: "Rossiya"
    },
    phoneCode: "+7",
    phoneFormat: "+7 XXX XXX XX XX",
    placeholder: "+7 900 123 45 67",
    flag: "🇷🇺"
  },
  {
    code: "KZ",
    name: {
      uz: "Qozog'iston",
      ru: "Казахстан",
      en: "Qozog'iston"
    },
    phoneCode: "+7",
    phoneFormat: "+7 XXX XXX XX XX", 
    placeholder: "+7 700 123 45 67",
    flag: "🇰🇿"
  },
  {
    code: "KG",
    name: {
      uz: "Qirg'iziston",
      ru: "Кыргызстан",
      en: "Qirg'iziston"
    },
    phoneCode: "+996",
    phoneFormat: "+996 XXX XXX XXX",
    placeholder: "+996 700 123 456",
    flag: "🇰🇬"
  },
  {
    code: "TJ",
    name: {
      uz: "Tojikiston",
      ru: "Таджикистан",
      en: "Tojikiston"
    },
    phoneCode: "+992",
    phoneFormat: "+992 XX XXX XX XX",
    placeholder: "+992 90 123 45 67",
    flag: "🇹🇯"
  },
  {
    code: "TM",
    name: {
      uz: "Turkmaniston",
      ru: "Туркменистан",
      en: "Turkmaniston"
    },
    phoneCode: "+993",
    phoneFormat: "+993 XX XXX XXX",
    placeholder: "+993 65 123 456",
    flag: "🇹🇲"
  },
  {
    code: "TR",
    name: {
      uz: "Turkiya",
      ru: "Турция",
      en: "Turkiya"
    },
    phoneCode: "+90",
    phoneFormat: "+90 XXX XXX XX XX",
    placeholder: "+90 532 123 45 67",
    flag: "🇹🇷"
  }
];

// Telefon raqamni formatlash funksiyasi
export function formatPhoneNumber(phone: string, country: Country): string {
  // Faqat raqamlarni qoldirish
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Agar input bo'sh bo'lsa, bo'sh qaytarish
  if (cleanPhone === '') {
    return '';
  }
  
  // Country code'ni olib tashlash
  const phoneCodeDigits = country.phoneCode.replace(/\D/g, '');
  let phoneWithoutCode = cleanPhone;
  
  // Agar country code bilan boshlanmasa, uni qo'shish
  if (!cleanPhone.startsWith(phoneCodeDigits)) {
    phoneWithoutCode = cleanPhone;
  } else {
    phoneWithoutCode = cleanPhone.slice(phoneCodeDigits.length);
  }
  
  // Country code'ni har doim qo'shish
  let formatted = country.phoneCode;
  let digitIndex = 0;
  
  // Agar faqat country code bo'lsa, uni qaytarish
  if (phoneWithoutCode === '') {
    return formatted;
  }
  
  // Formatga moslab chiqarish
  for (let i = country.phoneCode.length; i < country.phoneFormat.length; i++) {
    const char = country.phoneFormat[i];
    if (char === 'X') {
      if (digitIndex < phoneWithoutCode.length) {
        formatted += phoneWithoutCode[digitIndex];
        digitIndex++;
      } else {
        break;
      }
    } else {
      if (digitIndex < phoneWithoutCode.length) {
        formatted += char;
      }
    }
  }
  
  return formatted;
}

// Telefon raqamni validatsiya qilish
export function validatePhoneNumber(phone: string, country: Country): boolean {
  // Agar telefon bo'sh bo'lsa, valid deb hisoblaymiz
  if (!phone || phone.trim() === '') {
    return true;
  }
  
  // Agar faqat country code bo'lsa, valid deb hisoblaymiz
  if (phone.trim() === country.phoneCode) {
    return true;
  }
  
  const cleanPhone = phone.replace(/\D/g, '');
  const phoneCodeDigits = country.phoneCode.replace(/\D/g, '');
  
  // Country code bilan boshlanishi kerak
  if (!cleanPhone.startsWith(phoneCodeDigits)) {
    return false;
  }
  
  // Format bo'yicha uzunlikni tekshirish
  const expectedLength = country.phoneFormat.replace(/[^\dX]/g, '').length;
  return cleanPhone.length === expectedLength;
}

// Default country (O'zbekiston)
export const defaultCountry = countries[0]; 