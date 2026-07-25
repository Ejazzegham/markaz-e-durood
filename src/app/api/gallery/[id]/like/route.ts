import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db/firestore'

export const dynamic = 'force-dynamic'

// Public, unauthenticated like/unlike toggle for a gallery picture. Anyone
// can tap the heart on the home page — there's no account system tying a
// "like" to a person, so the browser itself remembers which pictures it
// already liked (see GalleryHighlights) and this endpoint just nudges the
// counter up or down accordingly.
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json().catch(() => ({}))
    const action: 'like' | 'unlike' = body?.action === 'unlike' ? 'unlike' : 'like'

    const db = getDb()
    const ref = db.collection('galleryImages').doc(params.id)

    const likes = await db.runTransaction(async (tx) => {
      const doc = await tx.get(ref)
      if (!doc.exists) return null

      const current = typeof doc.data()?.likes === 'number' ? doc.data()!.likes : 0
      const next = action === 'like' ? current + 1 : Math.max(0, current - 1)
      tx.update(ref, { likes: next })
      return next
    })

    if (likes === null) {
      return NextResponse.json({ error: 'Picture not found' }, { status: 404 })
    }

    return NextResponse.json({ likes })
  } catch (error) {
    console.error('Gallery like error:', error)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
