"use client"

import { Hammer } from "lucide-react"

interface HammerLoaderProps {
  size?: number
  className?: string
  fullScreen?: boolean
  text?: string
  showText?: boolean
}

export default function HammerLoader({ 
  size = 60, 
  className = "", 
  fullScreen = false, 
  text = "Yuklanmoqda...",
  showText = false 
}: HammerLoaderProps) {
  const hammerContent = (
    <div className="flex flex-col items-center justify-center gap-8">
      {/* Hammer va Mix animatsiya konteyner */}
      <div 
        className="relative flex flex-col items-center"
        style={{ width: size * 1.5, height: size * 2 }}
      >
        {/* Bolg'a (Hammer) - Kattaroq va markazlashtirilgan */}
        <div className="hammer-container relative flex justify-center">
          <Hammer 
            className="hammer text-white"
            size={size * 1.2}
            strokeWidth={1.5}
            style={{
              transformOrigin: 'bottom center',
              animation: 'hammerStrike 2s ease-in-out infinite'
            }}
          />
        </div>

        {/* Mix (Nail) - Yanada kichikroq va o'ngda */}
        <div 
          className="nail bg-white absolute bottom-0"
          style={{
            width: size * 0.03,
            height: size * 0.8,
            borderRadius: '2px',
            left: '60%',
            transform: 'translateX(-50%)',
            animation: 'nailDrive 2s ease-in-out infinite'
          }}
        >
          {/* Mix boshi */}
          <div 
            className="bg-white absolute top-0 left-1/2 transform -translate-x-1/2"
            style={{
              width: size * 0.08,
              height: size * 0.04,
              borderRadius: '2px',
              marginTop: `-${size * 0.02}px`
            }}
          ></div>
        </div>

        {/* Urish effekti - Mix boshida (o'ngda) */}
        <div 
          className="impact-effect bg-white/30 rounded-full absolute"
          style={{
            width: size * 0.25,
            height: size * 0.08,
            bottom: `${size * 0.8}px`,
            left: '60%',
            transform: 'translateX(-50%)',
            animation: 'impactFlash 2s ease-in-out infinite'
          }}
        ></div>
      </div>
      
      {/* Loading text */}
      {showText && (
        <div className="text-center">
          <p 
            className="text-white font-medium animate-pulse"
            style={{ fontSize: size * 0.3 }}
          >
            {text}
          </p>
        </div>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-[#004085] flex items-center justify-center z-[9999]">
        {hammerContent}
        
        {/* CSS Animatsiyalar */}
        <style jsx>{`
          @keyframes hammerStrike {
            0%, 80%, 100% {
              transform: rotate(-25deg) translateY(-15px);
            }
            15%, 25% {
              transform: rotate(5deg) translateY(8px);
            }
          }

          @keyframes nailDrive {
            0%, 80%, 100% {
              transform: translateX(-50%) translateY(0px);
            }
            15%, 25% {
              transform: translateX(-50%) translateY(4px);
            }
          }

          @keyframes impactFlash {
            0%, 10%, 30%, 100% {
              opacity: 0;
              transform: translateX(-50%) scale(0.8);
            }
            15%, 25% {
              opacity: 1;
              transform: translateX(-50%) scale(1.2);
            }
          }

          /* Responsive o'lchamlar */
          @media (max-width: 640px) {
            .hammer {
              width: ${size * 0.9}px !important;
              height: ${size * 0.9}px !important;
            }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {hammerContent}
      
      {/* CSS Animatsiyalar - inline version */}
      <style jsx>{`
         @keyframes hammerStrike {
           0%, 80%, 100% {
             transform: rotate(-25deg) translateY(-15px);
           }
           15%, 25% {
             transform: rotate(5deg) translateY(8px);
           }
         }

         @keyframes nailDrive {
           0%, 80%, 100% {
             transform: translateX(-50%) translateY(0px);
           }
           15%, 25% {
             transform: translateX(-50%) translateY(4px);
           }
         }

        @keyframes impactFlash {
          0%, 10%, 30%, 100% {
            opacity: 0;
            transform: translateX(-50%) scale(0.8);
          }
          15%, 25% {
            opacity: 1;
            transform: translateX(-50%) scale(1.2);
          }
        }
      `}</style>
    </div>
  )
} 