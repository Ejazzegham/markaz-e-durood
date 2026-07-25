import { z } from 'zod'
import { collection } from '@/lib/db/collection'

export type AdminModelKey =
  | 'books'
  | 'naat'
  | 'bayan'
  | 'gallery'
  | 'audio'
  | 'video'
  | 'blog'
  | 'faq'
  | 'news'
  | 'naatKhawan'
  | 'qari'
  | 'naqabat'
  | 'qariRecitation'
  | 'naqabatVideo'

export interface AdminFieldConfig {
  name: string
  label: string
  type: 'text' | 'textarea' | 'youtube' | 'image' | 'pdf' | 'checkbox' | 'personSelect'
  required?: boolean
  placeholder?: string
  helpText?: string
  /** For type: 'personSelect' — which profile model (e.g. 'naatKhawan') to
   *  populate the dropdown from, so the name always matches a real profile
   *  instead of relying on a free-text field being typed identically. */
  personSelectModel?: AdminModelKey
}

export interface AdminModelConfig {
  key: AdminModelKey
  label: string
  singularLabel: string
  delegate: ReturnType<typeof collection>
  schema: z.ZodTypeAny
  fields: AdminFieldConfig[]
  titleField: string
  subtitleField?: string
  imageField?: string
  /** For "performance" content models (naat/qariRecitation/naqabatVideo): the
   *  field that stores the performer's name, so the public API can filter a
   *  person's page down to just their items (?person=Name). */
  personField?: string
}

export const adminModels: Record<AdminModelKey, AdminModelConfig> = {
  books: {
    key: 'books',
    label: 'Books',
    singularLabel: 'Book',
    delegate: collection('bookResources'),
    titleField: 'title',
    subtitleField: 'author',
    imageField: 'coverUrl',
    schema: z.object({
      title: z.string().min(1),
      author: z.string().min(1),
      description: z.string().optional().nullable(),
      category: z.string().min(1),
      pdfUrl: z.string().min(1),
      coverUrl: z.string().optional().nullable(),
      isFeatured: z.boolean().optional(),
    }),
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'author', label: 'Author', type: 'text', required: true },
      { name: 'category', label: 'Category', type: 'text', required: true, placeholder: 'e.g. Fiqh, Seerah, Duas' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'coverUrl', label: 'Cover Image', type: 'image', helpText: 'Upload a cover image, or paste an image URL' },
      { name: 'pdfUrl', label: 'PDF File', type: 'pdf', required: true, helpText: 'Upload a PDF, or paste a link to one' },
      { name: 'isFeatured', label: 'Feature this book', type: 'checkbox' },
    ],
  },
  naat: {
    key: 'naat',
    label: 'Naat Shareef',
    singularLabel: 'Naat',
    delegate: collection('naats'),
    titleField: 'title',
    subtitleField: 'reciter',
    personField: 'reciter',
    schema: z.object({
      title: z.string().min(1),
      reciter: z.string().min(1),
      description: z.string().optional().nullable(),
      youtubeId: z.string().min(1),
      category: z.string().optional(),
      isFeatured: z.boolean().optional(),
    }),
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'reciter', label: 'Reciter', type: 'personSelect', required: true, personSelectModel: 'naatKhawan', helpText: "Choose the reciter's Naat Khawan profile — this is how their videos show up on their profile page" },
      { name: 'youtubeId', label: 'YouTube Link or Video ID', type: 'youtube', required: true, placeholder: 'https://www.youtube.com/watch?v=...' },
      { name: 'category', label: 'Category', type: 'text', placeholder: 'e.g. General' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'isFeatured', label: 'Feature this naat', type: 'checkbox' },
    ],
  },
  bayan: {
    key: 'bayan',
    label: 'Bayan',
    singularLabel: 'Bayan',
    delegate: collection('bayans'),
    titleField: 'title',
    subtitleField: 'speaker',
    schema: z.object({
      title: z.string().min(1),
      speaker: z.string().min(1),
      description: z.string().optional().nullable(),
      youtubeId: z.string().min(1),
      category: z.string().optional(),
      isFeatured: z.boolean().optional(),
    }),
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'speaker', label: 'Speaker', type: 'text', required: true },
      { name: 'youtubeId', label: 'YouTube Link or Video ID', type: 'youtube', required: true, placeholder: 'https://www.youtube.com/watch?v=...' },
      { name: 'category', label: 'Category', type: 'text', placeholder: 'e.g. General' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'isFeatured', label: 'Feature this bayan', type: 'checkbox' },
    ],
  },
  gallery: {
    key: 'gallery',
    label: 'Pictures',
    singularLabel: 'Picture',
    delegate: collection('galleryImages'),
    titleField: 'title',
    imageField: 'imageUrl',
    schema: z.object({
      title: z.string().optional().nullable(),
      imageUrl: z.string().min(1),
      category: z.string().optional(),
    }),
    fields: [
      { name: 'imageUrl', label: 'Picture', type: 'image', required: true, helpText: 'Upload an image, or paste an image URL' },
      { name: 'title', label: 'Title / Caption', type: 'text' },
      { name: 'category', label: 'Category', type: 'text', placeholder: 'e.g. Events, Masjid, Community' },
    ],
  },
  audio: {
    key: 'audio',
    label: 'Audio Library',
    singularLabel: 'Audio Track',
    delegate: collection('audioResources'),
    titleField: 'title',
    subtitleField: 'reciter',
    schema: z.object({
      title: z.string().min(1),
      reciter: z.string().min(1),
      description: z.string().optional().nullable(),
      url: z.string().min(1),
      duration: z.string().optional().nullable(),
      category: z.string().min(1),
      isFeatured: z.boolean().optional(),
    }),
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'reciter', label: 'Reciter', type: 'text', required: true },
      { name: 'url', label: 'YouTube Link or Video ID', type: 'youtube', required: true, placeholder: 'https://www.youtube.com/watch?v=...' },
      { name: 'category', label: 'Category', type: 'text', required: true, placeholder: 'e.g. Naat, Recitation' },
      { name: 'duration', label: 'Duration', type: 'text', placeholder: 'e.g. 8:30' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'isFeatured', label: 'Feature this track', type: 'checkbox' },
    ],
  },
  video: {
    key: 'video',
    label: 'Video Library',
    singularLabel: 'Video',
    delegate: collection('videoResources'),
    titleField: 'title',
    subtitleField: 'category',
    imageField: 'thumbnailUrl',
    schema: z.object({
      title: z.string().min(1),
      description: z.string().optional().nullable(),
      url: z.string().min(1),
      thumbnailUrl: z.string().optional().nullable(),
      duration: z.string().optional().nullable(),
      category: z.string().min(1),
      isFeatured: z.boolean().optional(),
    }),
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'url', label: 'YouTube Link or Video ID', type: 'youtube', required: true, placeholder: 'https://www.youtube.com/watch?v=...' },
      { name: 'category', label: 'Category', type: 'text', required: true, placeholder: 'e.g. Lecture, Naat' },
      { name: 'thumbnailUrl', label: 'Thumbnail', type: 'image', helpText: 'Optional — leave blank to use the YouTube thumbnail automatically' },
      { name: 'duration', label: 'Duration', type: 'text', placeholder: 'e.g. 15:30' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'isFeatured', label: 'Feature this video', type: 'checkbox' },
    ],
  },
  blog: {
    key: 'blog',
    label: 'Blog',
    singularLabel: 'Blog Post',
    delegate: collection('blogPosts'),
    titleField: 'title',
    subtitleField: 'category',
    imageField: 'featuredImage',
    schema: z.object({
      title: z.string().min(1),
      slug: z.string().optional(),
      excerpt: z.string().optional().nullable(),
      content: z.string().min(1),
      featuredImage: z.string().optional().nullable(),
      author: z.string().min(1),
      category: z.string().min(1),
      isPublished: z.boolean().optional(),
    }),
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'author', label: 'Author', type: 'text', required: true, placeholder: 'e.g. Admin' },
      { name: 'category', label: 'Category', type: 'text', required: true, placeholder: 'e.g. Durood, Tips' },
      { name: 'featuredImage', label: 'Featured Image', type: 'image' },
      { name: 'excerpt', label: 'Short Excerpt', type: 'textarea', helpText: 'Shown in post listings' },
      { name: 'content', label: 'Full Content', type: 'textarea', required: true },
      { name: 'isPublished', label: 'Publish now', type: 'checkbox' },
    ],
  },
  news: {
    key: 'news',
    label: 'News',
    singularLabel: 'News Article',
    delegate: collection('news'),
    titleField: 'title',
    subtitleField: 'category',
    imageField: 'featuredImage',
    schema: z.object({
      title: z.string().min(1),
      slug: z.string().optional(),
      excerpt: z.string().optional().nullable(),
      content: z.string().min(1),
      featuredImage: z.string().optional().nullable(),
      author: z.string().min(1),
      category: z.string().min(1),
      isPublished: z.boolean().optional(),
    }),
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'author', label: 'Author', type: 'text', required: true, placeholder: 'e.g. Admin' },
      { name: 'category', label: 'Category', type: 'text', required: true, placeholder: 'e.g. Announcement, Education' },
      { name: 'featuredImage', label: 'Featured Image', type: 'image' },
      { name: 'excerpt', label: 'Short Excerpt', type: 'textarea', helpText: 'Shown in article listings' },
      { name: 'content', label: 'Full Content', type: 'textarea', required: true },
      { name: 'isPublished', label: 'Publish now', type: 'checkbox' },
    ],
  },
  naatKhawan: {
    key: 'naatKhawan',
    label: 'Naat Khawan',
    singularLabel: 'Naat Khawan',
    delegate: collection('naatKhawanProfiles'),
    titleField: 'name',
    imageField: 'photoUrl',
    schema: z.object({
      name: z.string().min(1),
      photoUrl: z.string().min(1),
      bio: z.string().optional().nullable(),
      isFeatured: z.boolean().optional(),
    }),
    fields: [
      { name: 'photoUrl', label: 'Photo', type: 'image', required: true, helpText: 'Upload a photo, or paste an image URL' },
      { name: 'name', label: 'Name', type: 'text', required: true, placeholder: 'e.g. Sultan Fiaz-ul-Hassan' },
      { name: 'bio', label: 'Short Bio', type: 'textarea', helpText: 'Optional — shown on their profile page' },
      { name: 'isFeatured', label: 'Feature this Naat Khawan', type: 'checkbox' },
    ],
  },
  qari: {
    key: 'qari',
    label: 'Qari-e-Quran',
    singularLabel: 'Qari',
    delegate: collection('qariProfiles'),
    titleField: 'name',
    imageField: 'photoUrl',
    schema: z.object({
      name: z.string().min(1),
      photoUrl: z.string().min(1),
      bio: z.string().optional().nullable(),
      isFeatured: z.boolean().optional(),
    }),
    fields: [
      { name: 'photoUrl', label: 'Photo', type: 'image', required: true, helpText: 'Upload a photo, or paste an image URL' },
      { name: 'name', label: 'Name', type: 'text', required: true, placeholder: 'e.g. Qari Abdul Basit' },
      { name: 'bio', label: 'Short Bio', type: 'textarea', helpText: 'Optional — shown on their profile page' },
      { name: 'isFeatured', label: 'Feature this Qari', type: 'checkbox' },
    ],
  },
  naqabat: {
    key: 'naqabat',
    label: 'Naqabat',
    singularLabel: 'Naqabat Performer',
    delegate: collection('naqabatProfiles'),
    titleField: 'name',
    imageField: 'photoUrl',
    schema: z.object({
      name: z.string().min(1),
      photoUrl: z.string().min(1),
      bio: z.string().optional().nullable(),
      isFeatured: z.boolean().optional(),
    }),
    fields: [
      { name: 'photoUrl', label: 'Photo', type: 'image', required: true, helpText: 'Upload a photo, or paste an image URL' },
      { name: 'name', label: 'Name', type: 'text', required: true, placeholder: 'e.g. Naqeeb name' },
      { name: 'bio', label: 'Short Bio', type: 'textarea', helpText: 'Optional — shown on their profile page' },
      { name: 'isFeatured', label: 'Feature this performer', type: 'checkbox' },
    ],
  },
  qariRecitation: {
    key: 'qariRecitation',
    label: 'Qari-e-Quran Recitations',
    singularLabel: 'Recitation',
    delegate: collection('qariRecitations'),
    titleField: 'title',
    subtitleField: 'qari',
    personField: 'qari',
    schema: z.object({
      title: z.string().min(1),
      qari: z.string().min(1),
      description: z.string().optional().nullable(),
      youtubeId: z.string().min(1),
      category: z.string().optional(),
      isFeatured: z.boolean().optional(),
    }),
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'qari', label: 'Qari Name', type: 'personSelect', required: true, personSelectModel: 'qari', helpText: "Choose the Qari's profile — this is how the recitation shows up on their profile page" },
      { name: 'youtubeId', label: 'YouTube Link or Video ID', type: 'youtube', required: true, placeholder: 'https://www.youtube.com/watch?v=...' },
      { name: 'category', label: 'Category', type: 'text', placeholder: 'e.g. General' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'isFeatured', label: 'Feature this recitation', type: 'checkbox' },
    ],
  },
  naqabatVideo: {
    key: 'naqabatVideo',
    label: 'Naqabat Videos',
    singularLabel: 'Naqabat Video',
    delegate: collection('naqabatVideos'),
    titleField: 'title',
    subtitleField: 'performer',
    personField: 'performer',
    schema: z.object({
      title: z.string().min(1),
      performer: z.string().min(1),
      description: z.string().optional().nullable(),
      youtubeId: z.string().min(1),
      category: z.string().optional(),
      isFeatured: z.boolean().optional(),
    }),
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'performer', label: 'Performer Name', type: 'personSelect', required: true, personSelectModel: 'naqabat', helpText: 'Choose the performer\'s Naqabat profile — this is how the video shows up on their profile page' },
      { name: 'youtubeId', label: 'YouTube Link or Video ID', type: 'youtube', required: true, placeholder: 'https://www.youtube.com/watch?v=...' },
      { name: 'category', label: 'Category', type: 'text', placeholder: 'e.g. General' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'isFeatured', label: 'Feature this video', type: 'checkbox' },
    ],
  },
  faq: {
    key: 'faq',
    label: 'FAQ',
    singularLabel: 'Question',
    delegate: collection('faqs'),
    titleField: 'question',
    subtitleField: 'category',
    schema: z.object({
      question: z.string().min(1),
      answer: z.string().min(1),
      category: z.string().min(1),
      isActive: z.boolean().optional(),
    }),
    fields: [
      { name: 'question', label: 'Question', type: 'text', required: true },
      { name: 'category', label: 'Category', type: 'text', required: true, placeholder: 'e.g. Durood, General' },
      { name: 'answer', label: 'Answer', type: 'textarea', required: true },
      { name: 'isActive', label: 'Published', type: 'checkbox' },
    ],
  },
}

export function isValidModelKey(key: string): key is AdminModelKey {
  return key in adminModels
}

// Extracts a plain 11-character YouTube video ID from either a raw ID or
// any common YouTube URL format, so admins can paste whatever they have.
export function extractYoutubeId(input: string): string {
  const trimmed = input.trim()
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([\w-]{11})/,
  ]
  for (const pattern of patterns) {
    const match = trimmed.match(pattern)
    if (match) return match[1]
  }
  return trimmed
}

// Blog/News posts need a unique slug for their URL, but the admin form
// doesn't expose one — it's derived from the title automatically.
export function slugify(title: string): string {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 60) || 'post'
  const unique = Date.now().toString(36)
  return `${base}-${unique}`
}
