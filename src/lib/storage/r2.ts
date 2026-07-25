import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

// Cloudflare R2 speaks the S3 API, so the standard AWS SDK works against it —
// you just point `endpoint` at your R2 account instead of AWS.

let client: S3Client | null = null

function getClient(): S3Client {
  if (client) return client

  const accountId = process.env.R2_ACCOUNT_ID
  const accessKeyId = process.env.R2_ACCESS_KEY_ID
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY

  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error(
      'Missing Cloudflare R2 credentials. Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID and ' +
        'R2_SECRET_ACCESS_KEY in your .env file (see .env.example).'
    )
  }

  client = new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  })
  return client
}

function getBucket(): string {
  const bucket = process.env.R2_BUCKET_NAME
  if (!bucket) throw new Error('Missing R2_BUCKET_NAME in your .env file.')
  return bucket
}

// The bucket's public URL — either an r2.dev dev URL or a custom domain
// mapped to the bucket via Cloudflare (recommended for production).
function getPublicBaseUrl(): string {
  const base = process.env.R2_PUBLIC_URL
  if (!base) throw new Error('Missing R2_PUBLIC_URL in your .env file.')
  return base.replace(/\/$/, '')
}

// Generates a short-lived, signed URL the browser can PUT a file to directly.
// This is what lets large files (PDFs up to 50MB) get uploaded straight to
// R2 without passing through — and hitting the body-size limit of — a
// Vercel serverless function.
export async function getPresignedUploadUrl(
  key: string,
  contentType: string,
  expiresInSeconds = 300
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: getBucket(),
    Key: key,
    ContentType: contentType,
  })
  return getSignedUrl(getClient(), command, { expiresIn: expiresInSeconds })
}

export function publicUrlForKey(key: string): string {
  return `${getPublicBaseUrl()}/${key}`
}

export async function uploadToR2(
  key: string,
  body: Buffer,
  contentType: string
): Promise<string> {
  await getClient().send(
    new PutObjectCommand({
      Bucket: getBucket(),
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  )
  return `${getPublicBaseUrl()}/${key}`
}

export async function deleteFromR2(key: string): Promise<void> {
  await getClient().send(new DeleteObjectCommand({ Bucket: getBucket(), Key: key }))
}

// Turns a stored public URL back into the R2 object key, e.g. for deleting
// a file when its record is removed from the admin panel.
export function keyFromPublicUrl(url: string): string | null {
  try {
    const base = getPublicBaseUrl()
    if (!url.startsWith(base)) return null
    return url.slice(base.length + 1)
  } catch {
    return null
  }
}
