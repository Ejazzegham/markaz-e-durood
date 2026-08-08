/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
   
    serverComponentsExternalPackages: ['sharp'],

    outputFileTracingExcludes: {
      '*': [
        'node_modules/@img/sharp-darwin-*/**',
        'node_modules/@img/sharp-win32-*/**',
        'node_modules/@img/sharp-linuxmusl-*/**',
        'node_modules/@img/sharp-linux-arm*/**',
        'node_modules/@img/sharp-wasm32/**',
        'node_modules/@img/sharp-libvips-darwin-*/**',
        'node_modules/@img/sharp-libvips-linuxmusl-*/**',
        'node_modules/@img/sharp-libvips-linux-arm*/**',
      ],
    },
  },
  images: {
    domains: [
      'localhost',
      ...(process.env.R2_PUBLIC_URL ? [new URL(process.env.R2_PUBLIC_URL).hostname] : []),
    ],
  },
  reactStrictMode: true,

  typescript: {
    ignoreBuildErrors: true,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig