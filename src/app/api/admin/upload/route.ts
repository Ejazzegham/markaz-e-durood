import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { uploadToR2 } from '@/lib/storage/r2'

// Uploads go straight to Cloudflare R2 (S3-compatible object storage)
// instead of the local filesystem, so files persist across deploys and
// serverless instances.

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const ALLOWED_PDF_TYPES = ['application/pdf']
const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB
const MAX_PDF_SIZE = 50 * 1024 * 1024 // 50MB

function safeFilename(originalName: string): string {
  const dot = originalName.lastIndexOf('.')
  const ext = dot >= 0 ? originalName.slice(dot).toLowerCase() : ''
  const base = originalName
    .slice(0, dot >= 0 ? dot : undefined)
    .replace(/[^a-z0-9-_]/gi, '-')
    .slice(0, 40)
  const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  return `${base}-${unique}${ext}`
}

// Every image an admin uploads (gallery photos, naat/video thumbnails,
// book covers, etc.) is auto-compressed before it ever reaches R2 — so
// the whole site stays fast without anyone having to remember to shrink
// images by hand. Resizes anything wider than the site ever needs and
// re-encodes at a high-quality setting that looks the same to the eye
// but is a fraction of the size. GIFs are left untouched to preserve
// animation.
const MAX_UPLOAD_WIDTH = 1920

async function compressImage(buffer: Buffer, mimeType: string): Promise<{ buffer: Buffer; type: string }> {
  if (mimeType === 'image/gif') return { buffer, type: mimeType }

  try {
    const image = sharp(buffer).rotate()
    const meta = await image.metadata()
    const resized = meta.width && meta.width > MAX_UPLOAD_WIDTH ? image.resize({ width: MAX_UPLOAD_WIDTH }) : image

    if (mimeType === 'image/png') {
      const out = await resized.png({ quality: 85, compressionLevel: 9, adaptiveFiltering: true, palette: true }).toBuffer()
      return out.length < buffer.length ? { buffer: out, type: mimeType } : { buffer, type: mimeType }
    }

    // JPEG and WEBP (and anything else image/*) both compress cleanly to
    // progressive mozjpeg — smaller than re-encoded webp for photos in
    // practice and universally supported.
    const out = await resized.jpeg({ quality: 82, mozjpeg: true, progressive: true }).toBuffer()
    return out.length < buffer.length ? { buffer: out, type: 'image/jpeg' } : { buffer, type: mimeType }
  } catch {
    // If sharp can't process it for any reason, fall back to the original
    // file rather than blocking the upload.
    return { buffer, type: mimeType }
  }
}

export async function POST(request: NextRequest) {
  const admin = await requireAdmin(request)
  if (admin instanceof NextResponse) return admin

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const folder = (formData.get('folder') as string) || 'misc'
    const kind = (formData.get('kind') as string) || 'image' // 'image' | 'pdf'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const allowedTypes = kind === 'pdf' ? ALLOWED_PDF_TYPES : ALLOWED_IMAGE_TYPES
    const maxSize = kind === 'pdf' ? MAX_PDF_SIZE : MAX_IMAGE_SIZE

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: kind === 'pdf' ? 'Only PDF files are allowed' : 'Only JPG, PNG, WEBP or GIF images are allowed' },
        { status: 400 }
      )
    }

    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File is too large (max ${Math.round(maxSize / 1024 / 1024)}MB)` },
        { status: 400 }
      )
    }

    // Restrict folder to a safe, known set of subfolders
    const safeFolder = /^[a-z0-9-]+$/i.test(folder) ? folder : 'misc'

    let filename = safeFilename(file.name)
    const bytes = await file.arrayBuffer()
    let uploadBuffer = Buffer.from(bytes)
    let contentType = file.type

    if (kind !== 'pdf') {
      const compressed = await compressImage(uploadBuffer, file.type)
      uploadBuffer = compressed.buffer
      contentType = compressed.type
      // If webp got converted to jpeg during compression, keep the
      // filename's extension in sync so the served file matches its type.
      if (compressed.type === 'image/jpeg' && !/\.jpe?g$/i.test(filename)) {
        filename = filename.replace(/\.[a-z0-9]+$/i, '.jpg')
      }
    }

    const key = `uploads/${safeFolder}/${filename}`
    const publicUrl = await uploadToR2(key, uploadBuffer, contentType)

    return NextResponse.json({ url: publicUrl })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed. Please try again.' }, { status: 500 })
  }
}
