# What's in this update

Drop these files into your project at the same paths (they will overwrite the
existing ones), then restart `npm run dev` / redeploy. No new packages and no
database/schema changes are needed — everything uses your existing APIs.

## 1. Admin — Edit & Update for every category
**File:** `src/app/admin/(dashboard)/ContentManager.tsx`

This one component is shared by all 9 admin pages (Audio, Naat, Bayan, Books,
Video, Blog, News, FAQ, Pictures) — so this single file fixes it everywhere.
Each item card now has an Edit (pencil) button next to Delete. Clicking it
pre-fills the form and the Save button becomes "Update"; it calls your
existing PATCH endpoint, so nothing on the backend had to change.

## 2. Audio Library — real audio player (no more video box)
**New file:** `src/components/resources/AudioTheater.tsx`
**Updated:** `src/app/(site)/resources/audio/page.tsx` (now uses `AudioTheater`
instead of `YoutubeStyleTheater`)

Your audio entries are stored as YouTube links, so under the hood this still
uses YouTube to actually play the sound — but the video frame is now hidden
entirely (1x1, invisible). What the visitor sees is a proper audio player:
cover art, play/pause, seek bar, volume, next/previous, and a track list —
never a video screen. Tracks auto-advance to the next one when they finish.

Naat, Bayan, and Video pages were left untouched since you only asked about
the Audio Library.

## 3. Homepage — stats section now counts up
**File:** `src/app/(site)/page.tsx`

The "500K+ / 50+ / 100+ / 100%" numbers now animate from 0 up to their value
the moment that section scrolls into view, instead of sitting there as static
text. This is a front-end animation only — the target numbers themselves are
still the same ones you had; update the `target` props in the `AnimatedStat`
components in `page.tsx` if you want to change the actual figures.

## 4. Homepage — slides are now a small continuous strip
**Files:** `src/app/(site)/page.tsx`, `src/app/globals.css`

The old big slide-swapping carousel (one full image every 5s, with dots) has
been replaced with a small strip of images that scrolls continuously and
seamlessly to the left, like a ticker (it pauses on hover). It reuses the same
marquee technique already used by your Durood Arabic banner at the top of the
page, so it matches the site's existing motion style.
