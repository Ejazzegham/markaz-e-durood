/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
    // sharp (used to auto-compress admin image uploads) ships several
    // platform-specific native binaries. Marking it external stops
    // Next from trying to bundle every variant into the serverless
    // function — it's loaded directly from node_modules at runtime
    // instead, which Vercel supports natively.
    serverComponentsExternalPackages: ['sharp'],
  },
  images: {
    domains: [
      'localhost',
      ...(process.env.R2_PUBLIC_URL ? [new URL(process.env.R2_PUBLIC_URL).hostname] : []),
    ],
  },
  reactStrictMode: true,
  // Temporarily ignore TypeScript errors during build
  typescript: {
    ignoreBuildErrors: true,
  },
  // Temporarily ignore ESLint errors during build
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig