// ============================================================
// BROWSER-SIDE IMAGE COMPRESSION
// ============================================================
// Resizes/re-encodes an image file in the browser (via <canvas>) before
// it's uploaded, so every image an admin adds is automatically shrunk —
// without needing any server-side image library. This intentionally
// avoids a server dependency like `sharp`: native image libraries ship
// platform-specific binaries that Next.js's build-time file tracer can
// choke on in serverless deployments, and doing the work client-side
// sidesteps that entirely while still hitting the same goal (smaller
// files, same visual quality, faster page loads for visitors).
// ============================================================

const MAX_DIMENSION = 1920 // never need a larger source image on this site
const JPEG_QUALITY = 0.82 // visually indistinguishable, much smaller

export async function compressImageFile(file: File): Promise<File> {
  // GIFs would lose their animation if re-encoded through canvas — leave
  // them untouched.
  if (file.type === 'image/gif') return file

  try {
    const bitmap = await createImageBitmap(file)
    const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height))
    const width = Math.round(bitmap.width * scale)
    const height = Math.round(bitmap.height * scale)

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) return file

    ctx.drawImage(bitmap, 0, 0, width, height)
    bitmap.close?.()

    // PNGs with transparency need to stay PNG; everything else compresses
    // much smaller as JPEG, which is the common case for photos.
    const outputType = file.type === 'image/png' ? 'image/png' : 'image/jpeg'
    const blob: Blob | null = await new Promise((resolve) =>
      canvas.toBlob(resolve, outputType, outputType === 'image/jpeg' ? JPEG_QUALITY : undefined)
    )
    if (!blob) return file

    // Safety net: if compression somehow produced a bigger file (can
    // happen on already-tiny images), keep the original.
    if (blob.size >= file.size) return file

    const newName =
      outputType === 'image/jpeg' && !/\.jpe?g$/i.test(file.name)
        ? file.name.replace(/\.[a-z0-9]+$/i, '.jpg')
        : file.name

    return new File([blob], newName, { type: outputType })
  } catch {
    // If anything about compression fails (unsupported format, browser
    // quirk, etc.), just upload the original rather than blocking it.
    return file
  }
}
