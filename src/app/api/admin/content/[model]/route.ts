import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { adminModels, isValidModelKey, extractYoutubeId, slugify, AdminModelConfig } from '@/lib/admin/models'

// Empty strings from optional text inputs shouldn't override a Prisma
// column default (e.g. an unfilled "category" should fall back to
// "General" rather than being stored as "").
function stripEmptyOptionalStrings<T extends Record<string, any>>(data: T): T {
  const cleaned: Record<string, any> = { ...data }
  for (const key of Object.keys(cleaned)) {
    if (cleaned[key] === '') delete cleaned[key]
  }
  return cleaned as T
}

// Normalizes any 'youtube' field per the model's field config: a
// `youtubeId`-named field stores just the bare video ID, while any other
// field name (e.g. `url`) stores a full canonical watch URL.
function normalizeYoutubeFields(body: Record<string, any>, config: AdminModelConfig) {
  for (const field of config.fields) {
    if (field.type === 'youtube' && body[field.name]) {
      const id = extractYoutubeId(body[field.name])
      body[field.name] = field.name === 'youtubeId' ? id : `https://www.youtube.com/watch?v=${id}`
    }
  }
  return body
}

function addSlugIfNeeded(modelKey: string, body: Record<string, any>) {
  if ((modelKey === 'blog' || modelKey === 'news') && body.title) {
    body.slug = slugify(body.title)
  }
  return body
}

export async function GET(
  request: NextRequest,
  { params }: { params: { model: string } }
) {
  const admin = await requireAdmin(request)
  if (admin instanceof NextResponse) return admin

  if (!isValidModelKey(params.model)) {
    return NextResponse.json({ error: 'Unknown content type' }, { status: 404 })
  }

  const config = adminModels[params.model]
  const items = await config.delegate.findMany({ orderBy: { createdAt: 'desc' } })

  return NextResponse.json({ items })
}

export async function POST(
  request: NextRequest,
  { params }: { params: { model: string } }
) {
  const admin = await requireAdmin(request)
  if (admin instanceof NextResponse) return admin

  if (!isValidModelKey(params.model)) {
    return NextResponse.json({ error: 'Unknown content type' }, { status: 404 })
  }

  const config = adminModels[params.model]

  try {
    let body = await request.json()
    body = normalizeYoutubeFields(body, config)
    body = addSlugIfNeeded(params.model, body)

    const parsed = config.schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid data', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const created = await config.delegate.create({ data: stripEmptyOptionalStrings(parsed.data) })
    return NextResponse.json({ item: created }, { status: 201 })
  } catch (error) {
    console.error(`Error creating ${params.model} item:`, error)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
