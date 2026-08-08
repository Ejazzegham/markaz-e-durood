import { NextRequest, NextResponse } from 'next/server'
import { fetchUploadsPage, YouTubeConfigError } from '@/lib/youtube/api'

// Powers the infinite-scroll "full channel" grid on the homepage. Each
// call returns one page straight from the channel's uploads playlist
// (which YouTube keeps newest-first automatically) plus a token to fetch
// the next page — the client just keeps calling this as the user scrolls.
export async function GET(request: NextRequest) {
  const pageToken = request.nextUrl.searchParams.get('pageToken') || undefined

  try {
    const { items, nextPageToken } = await fetchUploadsPage(pageToken, 16)
    // Shorts get their own pinned row up top, so keep them out of the
    // regular scrolling grid to avoid showing every video twice.
    const videos = items.filter((v) => !v.isShort)
    return NextResponse.json({ items: videos, nextPageToken: nextPageToken || null })
  } catch (err: any) {
    if (err instanceof YouTubeConfigError) {
      return NextResponse.json({ error: 'not_configured', message: err.message }, { status: 501 })
    }
    console.error('YouTube videos fetch failed:', err)
    return NextResponse.json({ error: 'fetch_failed', message: 'Could not load channel videos right now.' }, { status: 502 })
  }
}
