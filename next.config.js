/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
    // sharp is only used by scripts/compress-images.js, a standalone
    // dev-time script — it is never imported by the app itself, so it
    // doesn't need to be traced into any serverless function. sharp ships
    // 20+ platform-specific native-binary sub-packages (@img/sharp-*),
    // and Next's build-trace step (micromatch/picomatch) has a known bug
    // where walking that huge dependency tree crashes with
    // "RangeError: Maximum call stack size exceeded" during
    // "Collecting build traces" on Vercel. Excluding it avoids the crash.
    // On Next.js 15+ this option moves to the top level of the config.
    // See: https://github.com/lovell/sharp/issues/3955
    outputFileTracingExcludes: {
      '*': ['node_modules/sharp/**', 'node_modules/@img/**'],
    },
  },
  images: {
    domains: [
      'localhost',
      'img.youtube.com',
      'i.ytimg.com',
      ...(process.env.R2_PUBLIC_URL ? [new URL(process.env.R2_PUBLIC_URL).hostname] : []),
    ],
  },
  reactStrictMode: true,
}

module.exports = nextConfig