# Qur'an Page — Premium Polish

## 1. Bigger Makki/Madani icons
`SurahListItem.tsx` — the Kaaba/Madina icon now sits in its own soft gold
badge chip (28x28, up from a bare 14px icon) next to "Makki · X verses" /
"Madani · X verses", so it reads clearly instead of looking like a stray
speck. Same treatment carried onto the Surah reading page header
(`surah/[number]/page.tsx`, 13 → 16px).

## 2. Surah grid: 2 columns → 3 columns
`quran/page.tsx` — the Surah list grid is now `grid-cols-1 md:grid-cols-2
lg:grid-cols-3`, matching the Para tab's grid so both feel consistent on
wide screens.

## 3. Full premium pass on the Qur'an hub page
- **Quick stats strip** under the hero: Surahs / Para / Total Verses /
  Makki / Madani counts — computed live from the actual Surah data (not
  hardcoded), so they can never drift out of sync.
- **Surah & Para cards** (`SurahListItem.tsx`, `ParaListItem.tsx`):
  gradient background, a soft gold radial glow that fades in on hover, a
  brighter hexagon number badge, and a subtle shadow lift — both cards now
  share the exact same premium treatment.
- **Tabs** (Surah/Para): each now has an icon and the active tab uses a
  gold gradient fill with a soft shadow, instead of a flat gold block.
- **Search bar**: gets a soft gold focus ring (matching the site's
  `PremiumSelect` glow) instead of a plain border-color change.

## How to apply
Copy the files in this zip into your project at the same paths (all 4 are
edits to existing files — nothing new to install). `npm run dev` /
`npm run build` as usual.

Verified with `tsc --noEmit` — no new type errors (only the same
pre-existing, unrelated error in
`src/app/api/admin/content/[model]/[id]/route.ts` as before).
