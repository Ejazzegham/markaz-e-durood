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
    // Belt-and-suspenders: also exclude the binaries for platforms
    // Vercel never runs on from the build-trace scan itself. Without
    // this, tracing every sharp platform package can overflow the
    // matcher's call stack during "Collecting build traces".
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