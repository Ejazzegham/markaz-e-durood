import { NextResponse } from 'next/server'
import { fetchPagePosts, FacebookConfigError } from '@/lib/facebook/api'

// Powers the full-width custom Facebook feed on the homepage.
export async function GET() {
  try {
    const posts = await fetchPagePosts(12)
    return NextResponse.json({ posts })
  } catch (err: any) {
    if (err instanceof FacebookConfigError) {
      return NextResponse.json({ error: 'not_configured', message: err.message }, { status: 501 })
    }
    console.error('Facebook posts fetch failed:', err)
    return NextResponse.json({ error: 'fetch_failed', message: 'Could not load Facebook posts right now.' }, { status: 502 })
  }
}
