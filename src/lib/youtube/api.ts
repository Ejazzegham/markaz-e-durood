// ============================================================
// YOUTUBE DATA API v3 — server-side helper
// ============================================================
// Everything here runs on the server (API routes only) so the API key
// never reaches the browser. Uses Next.js's built-in fetch cache
// (`next: { revalidate }`) instead of hitting Google on every page
// view — YouTube Data API has a modest daily quota, so caching for a
// while keeps us comfortably inside it while still feeling "live".
//
// Required env vars (see .env.example):
//   YOUTUBE_API_KEY      — Google Cloud Console > APIs & Services >
//                           Credentials > Create API key, with the
//                           "YouTube Data API v3" enabled on the project.
//   YOUTUBE_CHANNEL_ID    — the channel's UC... id (Channel > Advanced
//                           settings, or view-source the channel page
//                           for "channelId").
// ============================================================

const API_BASE = 'https://www.googleapis.com/youtube/v3'

// Shorts are, by definition, 60 seconds or less.
const SHORT_MAX_SECONDS = 60

export interface YouTubeVideo {
  id: string
  title: string
  description: string
  thumbnail: string
  publishedAt: string
  durationSeconds: number
  isShort: boolean
  viewCount?: string
}

export interface YouTubeComment {
  id: string
  author: string
  authorImage: string
  text: string
  likeCount: number
  publishedAt: string
  replyCount: number
}

class YouTubeConfigError extends Error {}

function getConfig() {
  const apiKey = process.env.YOUTUBE_API_KEY
  const channelId = process.env.YOUTUBE_CHANNEL_ID || 'UCLFXZpwfGcxsCB-nzCRyI1A'
  if (!apiKey) {
    throw new YouTubeConfigError(
      'YOUTUBE_API_KEY is not set — add it to your .env file to enable the live channel section.'
    )
  }
  return { apiKey, channelId }
}

// Uploads playlist id is always the channel id with "UC" swapped for "UU" —
// YouTube keeps this playlist automatically in sync with new uploads, so we
// don't need a separate API call just to look it up.
function uploadsPlaylistId(channelId: string) {
  return `UU${channelId.slice(2)}`
}

function parseISODuration(iso: string): number {
  // e.g. "PT1M32S" -> 92, "PT45S" -> 45, "PT2H3M" -> 7380
  const match = iso.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/)
  if (!match) return 0
  const [, h, m, s] = match
  return (Number(h) || 0) * 3600 + (Number(m) || 0) * 60 + (Number(s) || 0)
}

async function youtubeFetch(path: string, params: Record<string, string>, revalidateSeconds: number) {
  const { apiKey } = getConfig()
  const url = new URL(`${API_BASE}${path}`)
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  url.searchParams.set('key', apiKey)

  const res = await fetch(url.toString(), { next: { revalidate: revalidateSeconds } })
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`YouTube API error (${res.status}): ${body.slice(0, 300)}`)
  }
  return res.json()
}

// Fetches one page of the uploads playlist, then looks up full duration/
// view-count details for those videos in a single batched call.
export async function fetchUploadsPage(pageToken?: string, maxResults = 16) {
  const { channelId } = getConfig()
  const playlistId = uploadsPlaylistId(channelId)

  const playlistData = await youtubeFetch(
    '/playlistItems',
    {
      part: 'snippet,contentDetails',
      playlistId,
      maxResults: String(maxResults),
      ...(pageToken ? { pageToken } : {}),
    },
    1800 // 30 min
  )

  const videoIds: string[] = (playlistData.items || [])
    .map((it: any) => it.contentDetails?.videoId)
    .filter(Boolean)

  const videos = videoIds.length ? await fetchVideoDetails(videoIds) : []
  const byId = new Map(videos.map((v) => [v.id, v]))

  const items: YouTubeVideo[] = (playlistData.items || [])
    .map((it: any) => {
      const id = it.contentDetails?.videoId
      const details = byId.get(id)
      if (!details) return null
      return details
    })
    .filter(Boolean) as YouTubeVideo[]

  return {
    items,
    nextPageToken: playlistData.nextPageToken as string | undefined,
  }
}

export async function fetchVideoDetails(videoIds: string[]): Promise<YouTubeVideo[]> {
  if (!videoIds.length) return []
  const data = await youtubeFetch(
    '/videos',
    { part: 'snippet,contentDetails,statistics', id: videoIds.join(',') },
    1800
  )

  return (data.items || []).map((v: any) => {
    const durationSeconds = parseISODuration(v.contentDetails?.duration || 'PT0S')
    const thumb =
      v.snippet?.thumbnails?.maxres?.url ||
      v.snippet?.thumbnails?.high?.url ||
      v.snippet?.thumbnails?.medium?.url ||
      `https://img.youtube.com/vi/${v.id}/hqdefault.jpg`
    return {
      id: v.id,
      title: v.snippet?.title || '',
      description: v.snippet?.description || '',
      thumbnail: thumb,
      publishedAt: v.snippet?.publishedAt,
      durationSeconds,
      isShort: durationSeconds > 0 && durationSeconds <= SHORT_MAX_SECONDS,
      viewCount: v.statistics?.viewCount,
    } as YouTubeVideo
  })
}

// Walks a handful of uploads-playlist pages (most recent first) to collect
// the newest Shorts. Shorts aren't a separate feed in the public API, so
// scanning recent uploads and filtering by duration is the standard
// approach — in practice a channel's Shorts are almost always within the
// most recent ~80-100 uploads.
export async function fetchRecentShorts(limit = 12): Promise<YouTubeVideo[]> {
  const shorts: YouTubeVideo[] = []
  let pageToken: string | undefined = undefined
  let pagesScanned = 0

  while (shorts.length < limit && pagesScanned < 6) {
    const { items, nextPageToken } = await fetchUploadsPage(pageToken, 50)
    shorts.push(...items.filter((v) => v.isShort))
    pagesScanned += 1
    if (!nextPageToken) break
    pageToken = nextPageToken
  }

  return shorts
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit)
}

export async function fetchComments(videoId: string, pageToken?: string) {
  try {
    const data = await youtubeFetch(
      '/commentThreads',
      {
        part: 'snippet',
        videoId,
        maxResults: '20',
        order: 'relevance',
        textFormat: 'plainText',
        ...(pageToken ? { pageToken } : {}),
      },
      600 // 10 min — comments change more often than the upload list
    )

    const items: YouTubeComment[] = (data.items || []).map((it: any) => {
      const top = it.snippet?.topLevelComment?.snippet
      return {
        id: it.id,
        author: top?.authorDisplayName || 'YouTube user',
        authorImage: top?.authorProfileImageUrl || '',
        text: top?.textDisplay || '',
        likeCount: top?.likeCount || 0,
        publishedAt: top?.publishedAt,
        replyCount: it.snippet?.totalReplyCount || 0,
      }
    })

    return { items, nextPageToken: data.nextPageToken as string | undefined, commentsDisabled: false }
  } catch (err: any) {
    // Comments can be turned off per-video — that's a normal 403, not a
    // real error, so surface it as a friendly state instead of throwing.
    if (String(err.message).includes('403')) {
      return { items: [] as YouTubeComment[], nextPageToken: undefined, commentsDisabled: true }
    }
    throw err
  }
}

export { YouTubeConfigError }
