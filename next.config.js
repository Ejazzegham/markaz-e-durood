/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
  },
  images: {
    domains: ['localhost'],
  },
  // Enable if you want to use React Strict Mode
  reactStrictMode: true,
}

module.exports = nextConfig