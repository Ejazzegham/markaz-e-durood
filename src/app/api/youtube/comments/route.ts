import { NextRequest, NextResponse } from 'next/server'
import { fetchComments, YouTubeConfigError } from '@/lib/youtube/api'

// Renders a video's real YouTube comments directly on our own page, so
// visitors can read (and see the conversation around) a naat without
// being sent to youtube.com. Posting a *new* comment still has to happen
// on YouTube itself — Google does not allow their comment-composer to be
// embedded on another domain (no API exists for third-party sites to
// publish as the viewer), so a "Reply on YouTube" link is the honest way
// to offer that specific action without pretending otherwise.
export async function GET(request: NextRequest) {
  const videoId = request.nextUrl.searchParams.get('videoId')
  const pageToken = request.nextUrl.searchParams.get('pageToken') || undefined

  if (!videoId) {
    return NextResponse.json({ error: 'missing_videoId' }, { status: 400 })
  }

  try {
    const result = await fetchComments(videoId, pageToken)
    return NextResponse.json({ ...result, nextPageToken: result.nextPageToken || null })
  } catch (err: any) {
    if (err instanceof YouTubeConfigError) {
      return NextResponse.json({ error: 'not_configured', message: err.message }, { status: 501 })
    }
    console.error('YouTube comments fetch failed:', err)
    return NextResponse.json({ error: 'fetch_failed', message: 'Could not load comments right now.' }, { status: 502 })
  }
}
