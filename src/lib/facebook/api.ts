// ============================================================
// FACEBOOK GRAPH API — server-side helper
// ============================================================
// Runs on the server only (API routes) so the Page access token never
// reaches the browser. Fetches real posts from the Page and returns
// them in a simplified shape the UI can render as full-width custom
// cards — the only way to get a genuinely wide Facebook feed, since
// the free Page Plugin widget is hard-capped at 500px by Facebook
// itself.
//
// Required env vars (see .env.example):
//   FACEBOOK_PAGE_ID            — the Page's numeric id
//   FACEBOOK_PAGE_ACCESS_TOKEN  — a long-lived Page access token
//                                 (does not expire under normal use —
//                                 see .env.example for how to get one)
// ============================================================

const GRAPH_API_BASE = 'https://graph.facebook.com/v19.0'

export interface FacebookPost {
  id: string
  message: string
  permalinkUrl: string
  createdTime: string
  image: string | null
  likeCount: number
  commentCount: number
}

class FacebookConfigError extends Error {}

function getConfig() {
  const pageId = process.env.FACEBOOK_PAGE_ID
  const accessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN
  if (!pageId || !accessToken) {
    throw new FacebookConfigError(
      'FACEBOOK_PAGE_ID / FACEBOOK_PAGE_ACCESS_TOKEN are not set — add them to your .env file to enable the live full-width Facebook feed.'
    )
  }
  return { pageId, accessToken }
}

export async function fetchPagePosts(limit = 12): Promise<FacebookPost[]> {
  const { pageId, accessToken } = getConfig()

  const fields = [
    'message',
    'permalink_url',
    'created_time',
    'full_picture',
    'likes.summary(true).limit(0)',
    'comments.summary(true).limit(0)',
  ].join(',')

  const url = `${GRAPH_API_BASE}/${pageId}/posts?fields=${fields}&limit=${limit}&access_token=${accessToken}`

  // Cache for 10 minutes — plenty "live" for a Page feed while keeping
  // us well inside Graph API rate limits.
  const res = await fetch(url, { next: { revalidate: 600 } })

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`Facebook Graph API error (${res.status}): ${body}`)
  }

  const data = await res.json()

  const posts: FacebookPost[] = (data.data || [])
    // Skip posts with neither text nor an image — nothing to show.
    .filter((p: any) => p.message || p.full_picture)
    .map((p: any) => ({
      id: p.id,
      message: p.message || '',
      permalinkUrl: p.permalink_url,
      createdTime: p.created_time,
      image: p.full_picture || null,
      likeCount: p.likes?.summary?.total_count ?? 0,
      commentCount: p.comments?.summary?.total_count ?? 0,
    }))

  return posts
}

export { FacebookConfigError }
