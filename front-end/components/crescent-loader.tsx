interface CrescentLoaderProps {
  size?: number
  className?: string
}

export default function CrescentLoader({ size = 40, className = "" }: CrescentLoaderProps) {
  return (
    <div
      className={`rounded-full animate-spin border-y-8 border-solid border-[#004085] border-t-[#CED4DA] shadow-md ${className}`}
      style={{ width: size, height: size }}
    ></div>
  )
}
