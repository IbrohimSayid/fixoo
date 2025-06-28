import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Script from "next/script"
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Fixoo - Connect with Specialists",
  description: "Find the right specialist for your needs",
  generator: 'v0.dev'
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <div className="telegram-web-app">
            {children}
          </div>
        </ThemeProvider>
        <Toaster 
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              style: {
                background: '#10b981',
              },
            },
            error: {
              style: {
                background: '#ef4444',
              },
            },
          }}
        />
        <Script id="telegram-init" strategy="afterInteractive">
          {`
            // Telegram WebApp xatolarini oldini olish
            if (typeof window !== 'undefined') {
              window.addEventListener('error', function(e) {
                if (e.filename && e.filename.includes('telegram-web-app.js')) {
                  e.preventDefault();
                  console.warn('Telegram WebApp error caught:', e.message);
                  return false;
                }
              });
              
              // Faqat Telegram ichida bo'lsa yuklash
              if (window.location.search.includes('tgWebAppData')) {
                var script = document.createElement('script');
                script.src = 'https://telegram.org/js/telegram-web-app.js';
                script.onerror = function() {
                  console.warn('Telegram WebApp script failed to load');
                };
                document.head.appendChild(script);
              }
            }
          `}
        </Script>
      </body>
    </html>
  )
}
