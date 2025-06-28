/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  },
  images: {
    unoptimized: true,
    domains: ['localhost'],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
  },
  productionBrowserSourceMaps: false,
  experimental: {
    optimizePackageImports: ['lucide-react']
  },
  // Telegram Web App uchun qo'shimcha sozlamalar
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'ALLOWALL'
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors *; default-src 'self' 'unsafe-inline' 'unsafe-eval' https: http://localhost:* data: blob:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://telegram.org; connect-src 'self' http://localhost:* https:;"
          }
        ],
      },
    ]
  },
  // Telegram Web App iframe ichida ishlashi uchun
  trailingSlash: false,
  generateEtags: false
}

export default nextConfig
