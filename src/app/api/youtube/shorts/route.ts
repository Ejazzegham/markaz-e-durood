import { NextResponse } from 'next/server'
import { fetchRecentShorts, YouTubeConfigError } from '@/lib/youtube/api'

export async function GET() {
  try {
    const items = await fetchRecentShorts(12)
    return NextResponse.json({ items })
  } catch (err: any) {
    if (err instanceof YouTubeConfigError) {
      return NextResponse.json({ error: 'not_configured', message: err.message }, { status: 501 })
    }
    console.error('YouTube shorts fetch failed:', err)
    return NextResponse.json({ error: 'fetch_failed', message: 'Could not load Shorts right now.' }, { status: 502 })
  }
}
