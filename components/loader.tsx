"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function Loader() {
  const [language, setLanguage] = useState("uz")
  const [animationComplete, setAnimationComplete] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Get saved language
    if (typeof window !== "undefined") {
      const storedLang = localStorage.getItem("lang") || "uz"
      setLanguage(storedLang)
    }

    // Finish animation
    const timer = setTimeout(() => {
      setAnimationComplete(true)
    }, 2500)

    // After slide-up, redirect
    const finalRedirect = setTimeout(() => {
      if (typeof window !== "undefined") {
        const isRegistered = localStorage.getItem("userRegistered") === "true"
        router.push(isRegistered ? "/home" : "/signup")
      }
    }, 3200)

    return () => {
      clearTimeout(timer)
      clearTimeout(finalRedirect)
    }
  }, [router])

  const getTranslation = (key: string, lang: string) => {
    const translations: Record<string, Record<string, string>> = {
      loading: {
        uz: "Yuklanmoqda",
        ru: "Загрузка",
        en: "Loading",
      },
    }
    return translations[key]?.[lang] || key
  }

  return (
    <div
      className={`fixed inset-0 flex flex-col items-center justify-center bg-primary text-white z-50 transition-transform duration-700 ${
        animationComplete ? "-translate-y-full" : ""
      }`}
    >
      {/* LOGO animatsiyasi - o'lchamini kattalashtirish */}
      <div className="relative mb-8">
        <div className="flex items-center justify-center text-6xl font-bold space-x-1">
          <span className="animate-from-top animate-delay-0 opacity-0">F</span>
          <span className="animate-from-left animate-delay-300 opacity-0">i</span>
          <span className="animate-from-bottom animate-delay-600 opacity-0">x</span>
          <span className="animate-from-right animate-delay-900 opacity-0">o</span>
          <span className="animate-from-top animate-delay-1200 opacity-0">o</span>
        </div>
      </div>

      {/* Inline CSS animatsiyalar */}
      <style jsx>{`
        @keyframes fromTop {
          0% {
            opacity: 0;
            transform: translateY(-40px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fromLeft {
          0% {
            opacity: 0;
            transform: translateX(-40px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes fromBottom {
          0% {
            opacity: 0;
            transform: translateY(40px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fromRight {
          0% {
            opacity: 0;
            transform: translateX(40px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-from-top {
          animation: fromTop 0.6s ease-out forwards;
        }
        .animate-from-left {
          animation: fromLeft 0.6s ease-out forwards;
        }
        .animate-from-bottom {
          animation: fromBottom 0.6s ease-out forwards;
        }
        .animate-from-right {
          animation: fromRight 0.6s ease-out forwards;
        }

        .animate-delay-0 {
          animation-delay: 0s;
        }
        .animate-delay-300 {
          animation-delay: 0.3s;
        }
        .animate-delay-600 {
          animation-delay: 0.6s;
        }
        .animate-delay-900 {
          animation-delay: 0.9s;
        }
        .animate-delay-1200 {
          animation-delay: 1.2s;
        }
      `}</style>
    </div>
  )
}
