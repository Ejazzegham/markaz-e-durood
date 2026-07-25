import { NextRequest, NextResponse } from 'next/server'
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

    const filename = safeFilename(file.name)
    const key = `uploads/${safeFolder}/${filename}`

    const bytes = await file.arrayBuffer()
    const publicUrl = await uploadToR2(key, Buffer.from(bytes), file.type)

    return NextResponse.json({ url: publicUrl })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed. Please try again.' }, { status: 500 })
  }
}
