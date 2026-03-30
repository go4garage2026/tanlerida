import type { NextConfig } from 'next'

const isFirebaseStaticBuild = process.env.DEPLOY_TARGET === 'firebase-static'

const nextConfig: NextConfig = {
  // Use a static export when preparing the Firebase frontend deployment.
  output: isFirebaseStaticBuild ? 'export' : 'standalone',
  distDir: isFirebaseStaticBuild ? 'dist' : '.next',
  trailingSlash: isFirebaseStaticBuild,

  images: {
    unoptimized: isFirebaseStaticBuild || true,
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
