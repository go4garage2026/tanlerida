import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Full-stack SSR mode (API routes + server components)
  output: 'standalone',

  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: '*.googleusercontent.com' },
    ],
  },

  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || '',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },

  typescript: {
    ignoreBuildErrors: false,
  },
}

export default nextConfig
