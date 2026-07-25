import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { adminModels, isValidModelKey, extractYoutubeId, AdminModelConfig } from '@/lib/admin/models'

function normalizeYoutubeFields(body: Record<string, any>, config: AdminModelConfig) {
  for (const field of config.fields) {
    if (field.type === 'youtube' && body[field.name]) {
      const id = extractYoutubeId(body[field.name])
      body[field.name] = field.name === 'youtubeId' ? id : `https://www.youtube.com/watch?v=${id}`
    }
  }
  return body
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { model: string; id: string } }
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

    const parsed = config.schema.partial().safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid data', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const updated = await config.delegate.update({
      where: { id: params.id },
      data: parsed.data,
    })
    return NextResponse.json({ item: updated })
  } catch (error) {
    console.error(`Error updating ${params.model} item:`, error)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { model: string; id: string } }
) {
  const admin = await requireAdmin(request)
  if (admin instanceof NextResponse) return admin

  if (!isValidModelKey(params.model)) {
    return NextResponse.json({ error: 'Unknown content type' }, { status: 404 })
  }

  const config = adminModels[params.model]

  try {
    await config.delegate.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`Error deleting ${params.model} item:`, error)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
