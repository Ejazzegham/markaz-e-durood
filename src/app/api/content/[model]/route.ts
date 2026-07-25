import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { adminModels, isValidModelKey } from '@/lib/admin/models'

// Read-only, unauthenticated — this is what the public pages fetch from.
// Only ever returns content that's meant to be public (published/active).
export async function GET(
  request: NextRequest,
  { params }: { params: { model: string } }
) {
  if (!isValidModelKey(params.model)) {
    return NextResponse.json({ error: 'Unknown content type' }, { status: 404 })
  }

  const config = adminModels[params.model]

  const where: Record<string, any> =
    params.model === 'blog' || params.model === 'news'
      ? { isPublished: true }
      : params.model === 'faq'
      ? { isActive: true }
      : {}

  const items = await config.delegate.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ items })
}

const publicFaqSubmissionSchema = z.object({
  question: z.string().min(5).max(1000),
  category: z.string().min(1).max(50).optional(),
})

// The only public write in this route: visitors can submit a new question
// on the Ask & Learn page. It's saved as unanswered/unpublished until an
// admin adds a real answer, so nothing fake ever shows up on the public FAQ.
export async function POST(
  request: NextRequest,
  { params }: { params: { model: string } }
) {
  if (params.model !== 'faq') {
    return NextResponse.json({ error: 'This content type does not accept public submissions' }, { status: 403 })
  }

  try {
    const body = await request.json()
    const parsed = publicFaqSubmissionSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Please enter a valid question.' }, { status: 400 })
    }

    const { collection } = await import('@/lib/db/collection')
    const created = await collection('faqs').create({
      data: {
        question: parsed.data.question,
        category: parsed.data.category || 'General',
        answer: '',
        isActive: false, // stays hidden until an admin answers and publishes it
      },
    })

    return NextResponse.json({ item: created }, { status: 201 })
  } catch (error) {
    console.error('FAQ submission error:', error)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
