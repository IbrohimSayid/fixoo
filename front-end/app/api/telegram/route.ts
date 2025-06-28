import { NextResponse } from "next/server"
import TelegramBot from "node-telegram-bot-api"

// Bot tokenini environment variable sifatida saqlash kerak
// Hozircha to'g'ridan-to'g'ri ishlatamiz
const token = "7804584441:AAF4nN_9LyN-gXIIH5yqi3SOQEw3VK9ZFO4"
const webAppUrl = "https://your-vercel-app-url.vercel.app" // Ilovangiz URL manzili

// Bot yaratish
const bot = new TelegramBot(token, { polling: true })

// Xabar matnlari
const welcomeMessages = {
  uz: "Assalomu alaykum! Fixoo botiga xush kelibsiz. Ilovani ochish uchun quyidagi tugmani bosing.",
  ru: "Здравствуйте! Добро пожаловать в бот Fixoo. Нажмите кнопку ниже, чтобы открыть приложение.",
  en: "Hello! Welcome to Fixoo bot. Press the button below to open the application.",
}

// Tugma matnlari
const buttonTexts = {
  uz: "Ilovani ochish",
  ru: "Открыть приложение",
  en: "Open application",
}

// /start komandasi uchun handler
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id

  // Barcha tillardagi xabarlarni yuborish
  const message = `
${welcomeMessages.uz}

${welcomeMessages.ru}

${welcomeMessages.en}
  `

  // Inline keyboard yaratish
  const keyboard = {
    inline_keyboard: [
      [
        {
          text: buttonTexts.uz,
          web_app: { url: webAppUrl },
        },
      ],
      [
        {
          text: buttonTexts.ru,
          web_app: { url: webAppUrl },
        },
      ],
      [
        {
          text: buttonTexts.en,
          web_app: { url: webAppUrl },
        },
      ],
    ],
  }

  // Xabar va tugmalarni yuborish
  bot.sendMessage(chatId, message, {
    reply_markup: keyboard,
  })
})

export async function GET() {
  return NextResponse.json({ status: "Bot is running" })
}

export async function POST(request: Request) {
  const data = await request.json()

  // Webhook ma'lumotlarini qayta ishlash
  // Bu yerda bot.processUpdate(data) kabi funksiyani chaqirish mumkin

  return NextResponse.json({ status: "success" })
}
