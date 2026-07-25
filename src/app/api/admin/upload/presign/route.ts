import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { getPresignedUploadUrl, publicUrlForKey } from '@/lib/storage/r2'

// Issues a short-lived signed URL the admin's browser can PUT a file to
// directly on Cloudflare R2. Used instead of routing the file bytes through
// this server, so large uploads (PDFs) don't hit Vercel's serverless
// function body-size limit (413 Payload Too Large).

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
    const { filename, contentType, size, folder, kind } = await request.json()

    if (!filename || !contentType) {
      return NextResponse.json({ error: 'filename and contentType are required' }, { status: 400 })
    }

    const uploadKind = kind === 'pdf' ? 'pdf' : 'image'
    const allowedTypes = uploadKind === 'pdf' ? ALLOWED_PDF_TYPES : ALLOWED_IMAGE_TYPES
    const maxSize = uploadKind === 'pdf' ? MAX_PDF_SIZE : MAX_IMAGE_SIZE

    if (!allowedTypes.includes(contentType)) {
      return NextResponse.json(
        { error: uploadKind === 'pdf' ? 'Only PDF files are allowed' : 'Only JPG, PNG, WEBP or GIF images are allowed' },
        { status: 400 }
      )
    }

    if (typeof size === 'number' && size > maxSize) {
      return NextResponse.json(
        { error: `File is too large (max ${Math.round(maxSize / 1024 / 1024)}MB)` },
        { status: 400 }
      )
    }

    const safeFolder = /^[a-z0-9-]+$/i.test(folder || '') ? folder : 'misc'
    const key = `uploads/${safeFolder}/${safeFilename(filename)}`

    const uploadUrl = await getPresignedUploadUrl(key, contentType)
    const publicUrl = publicUrlForKey(key)

    return NextResponse.json({ uploadUrl, publicUrl })
  } catch (error) {
    console.error('Presign error:', error)
    return NextResponse.json({ error: 'Could not prepare upload. Please try again.' }, { status: 500 })
  }
}
