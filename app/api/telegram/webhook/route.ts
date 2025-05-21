import { NextResponse } from "next/server"
import TelegramBot from "node-telegram-bot-api"

const token = "7804584441:AAF4nN_9LyN-gXIIH5yqi3SOQEw3VK9ZFO4"
const bot = new TelegramBot(token)

// Webhook URL manzili (Vercel yoki boshqa hosting URL)
const webhookUrl = "https://your-vercel-app-url.vercel.app/api/telegram/webhook"

// Webhook o'rnatish
export async function GET() {
  try {
    await bot.setWebHook(`${webhookUrl}`)
    return NextResponse.json({ success: true, message: "Webhook set successfully" })
  } catch (error) {
    console.error("Error setting webhook:", error)
    return NextResponse.json({ success: false, error: "Failed to set webhook" }, { status: 500 })
  }
}

// Webhook ma'lumotlarini qabul qilish
export async function POST(request: Request) {
  try {
    const update = await request.json()

    // Webhook ma'lumotlarini qayta ishlash
    await bot.processUpdate(update)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error processing webhook:", error)
    return NextResponse.json({ success: false, error: "Failed to process webhook" }, { status: 500 })
  }
}
