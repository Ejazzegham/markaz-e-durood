/**
 * Compresses every raster image in public/ and src/ in place.
 * - Resizes anything wider than a sensible max (images are never
 *   displayed larger than this in the UI) so we're not shipping
 *   4000px source photos for a 1600px hero banner.
 * - Re-encodes at a high quality setting (mozjpeg/pngquant-equivalent
 *   via sharp's built-in encoders) that is visually indistinguishable
 *   from the original but cuts file size dramatically.
 * - Keeps the original file extension/format so no code (import paths,
 *   <img src>) needs to change.
 *
 * Run with: node scripts/compress-images.js
 */
const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

const ROOT = path.join(__dirname, '..')
const TARGET_DIRS = ['public', 'src']
const EXTENSIONS = new Set(['.jpg', '.jpeg', '.png'])

// Max dimension any image needs to render at on the site. Hero/background
// photos never display wider than the viewport, so 1920px covers even
// large desktop monitors at full quality.
const MAX_WIDTH = 1920

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.next') continue
      walk(full, files)
    } else {
      const ext = path.extname(entry.name).toLowerCase()
      if (EXTENSIONS.has(ext)) files.push(full)
    }
  }
  return files
}

async function compress(file) {
  const before = fs.statSync(file).size
  const ext = path.extname(file).toLowerCase()
  const buffer = fs.readFileSync(file)

  let pipeline = sharp(buffer).rotate() // auto-orient from EXIF, then strip it
  const meta = await sharp(buffer).metadata()

  if (meta.width && meta.width > MAX_WIDTH) {
    pipeline = pipeline.resize({ width: MAX_WIDTH })
  }

  let output
  if (ext === '.png') {
    // Photographic PNGs (screenshots/photos exported as PNG) compress far
    // better as re-optimized PNGs with palette+compression tuning; sharp's
    // pngquant-equivalent adaptive filtering keeps them visually identical.
    output = await pipeline
      .png({ quality: 85, compressionLevel: 9, adaptiveFiltering: true, palette: true })
      .toBuffer()
  } else {
    output = await pipeline
      .jpeg({ quality: 82, mozjpeg: true, progressive: true })
      .toBuffer()
  }

  // Safety net: never write a "compressed" file that's actually bigger
  // (can happen on already-tiny images) — keep the original in that case.
  if (output.length < before) {
    fs.writeFileSync(file, output)
    return { file, before, after: output.length }
  }
  return { file, before, after: before }
}

async function main() {
  const files = TARGET_DIRS.flatMap((d) => walk(path.join(ROOT, d)))
  let totalBefore = 0
  let totalAfter = 0

  for (const file of files) {
    const { before, after } = await compress(file)
    totalBefore += before
    totalAfter += after
    const pct = before ? (((before - after) / before) * 100).toFixed(1) : '0.0'
    console.log(
      `${path.relative(ROOT, file).padEnd(45)} ${(before / 1024).toFixed(0).padStart(6)} KB -> ${(after / 1024).toFixed(0).padStart(6)} KB  (-${pct}%)`
    )
  }

  console.log('\n----------------------------------------')
  console.log(
    `Total: ${(totalBefore / 1024 / 1024).toFixed(2)} MB -> ${(totalAfter / 1024 / 1024).toFixed(2)} MB` +
      `  (-${(((totalBefore - totalAfter) / totalBefore) * 100).toFixed(1)}%)`
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
