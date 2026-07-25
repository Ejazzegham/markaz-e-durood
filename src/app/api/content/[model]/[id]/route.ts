import { NextRequest, NextResponse } from 'next/server'
import { adminModels, isValidModelKey } from '@/lib/admin/models'

export const dynamic = 'force-dynamic'

// Read-only, unauthenticated — used by public profile pages (Naat Khawan,
// Qari-e-Quran, Naqabat) to load a single performer's details by id.
export async function GET(
  request: NextRequest,
  { params }: { params: { model: string; id: string } }
) {
  if (!isValidModelKey(params.model)) {
    return NextResponse.json({ error: 'Unknown content type' }, { status: 404 })
  }

  const config = adminModels[params.model]
  const item = await config.delegate.findUnique(params.id)

  if (!item) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json({ item })
}
