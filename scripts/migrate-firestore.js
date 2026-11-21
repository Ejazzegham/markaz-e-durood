/**
 * Copy ALL Firestore data from the OLD Firebase project to the NEW one.
 *
 * Usage (from the project root, where firebase-admin is installed):
 *
 *   node scripts/migrate-firestore.js --old old-key.json --new new-key.json
 *
 * Options:
 *   --dry-run            Only count documents, write nothing.
 *   --skip a,b,c         Collections to skip, e.g. --skip siteVisitors
 *   --only a,b,c         Copy only these collections.
 *
 * Safe to re-run: documents keep their original IDs, so running it again
 * simply overwrites the same documents (no duplicates).
 * The OLD project is only READ from, never modified.
 */

const fs = require('fs')
const path = require('path')
const { initializeApp, cert } = require('firebase-admin/app')
const { getFirestore } = require('firebase-admin/firestore')

function arg(name) {
  const i = process.argv.indexOf(`--${name}`)
  return i === -1 ? undefined : process.argv[i + 1]
}
const flag = (name) => process.argv.includes(`--${name}`)
const list = (v) => (v ? v.split(',').map((s) => s.trim()).filter(Boolean) : [])

function loadKey(file, label) {
  if (!file) {
    console.error(`Missing --${label} <service-account.json>`)
    process.exit(1)
  }
  const full = path.resolve(file)
  if (!fs.existsSync(full)) {
    console.error(`File not found: ${full}`)
    process.exit(1)
  }
  const json = JSON.parse(fs.readFileSync(full, 'utf8'))
  if (!json.project_id || !json.client_email || !json.private_key) {
    console.error(`${file} is not a valid service account key (needs project_id, client_email, private_key).`)
    process.exit(1)
  }
  return json
}

async function copyCollection(srcCol, dstCol, writer, dryRun, indent = '') {
  let count = 0
  const snap = await srcCol.get()
  for (const doc of snap.docs) {
    count++
    if (!dryRun) writer.set(dstCol.doc(doc.id), doc.data())

    // Copy any subcollections too (your app doesn't use them, but this is safe).
    const subs = await doc.ref.listCollections()
    for (const sub of subs) {
      const n = await copyCollection(sub, dstCol.doc(doc.id).collection(sub.id), writer, dryRun, indent + '  ')
      console.log(`${indent}  ↳ ${doc.ref.path}/${sub.id}: ${n} docs`)
    }
  }
  return count
}

async function main() {
  const oldKey = loadKey(arg('old'), 'old')
  const newKey = loadKey(arg('new'), 'new')
  const dryRun = flag('dry-run')
  const skip = new Set(list(arg('skip')))
  const only = list(arg('only'))

  if (oldKey.project_id === newKey.project_id) {
    console.error('OLD and NEW keys point to the same project. Aborting.')
    process.exit(1)
  }

  console.log(`OLD project: ${oldKey.project_id}`)
  console.log(`NEW project: ${newKey.project_id}`)
  console.log(dryRun ? 'Mode: DRY RUN (nothing will be written)\n' : 'Mode: COPY\n')

  const oldDb = getFirestore(initializeApp({ credential: cert(oldKey) }, 'old'))
  const newDb = getFirestore(initializeApp({ credential: cert(newKey) }, 'new'))

  const writer = newDb.bulkWriter()
  let failed = 0
  writer.onWriteError((err) => {
    if (err.failedAttempts < 5) return true // retry
    failed++
    console.error(`  ✗ failed to write ${err.documentRef.path}: ${err.message}`)
    return false
  })

  let collections = await oldDb.listCollections()
  if (only.length) collections = collections.filter((c) => only.includes(c.id))
  collections = collections.filter((c) => !skip.has(c.id))

  if (collections.length === 0) {
    console.log('No collections found to copy.')
    return
  }

  let total = 0
  for (const col of collections) {
    process.stdout.write(`Copying ${col.id} ... `)
    const n = await copyCollection(col, newDb.collection(col.id), writer, dryRun)
    total += n
    console.log(`${n} docs`)
  }

  if (!dryRun) {
    await writer.close()
  }

  console.log(`\nDone. ${total} documents ${dryRun ? 'would be copied' : 'processed'}.`)
  if (failed) console.log(`WARNING: ${failed} document(s) failed. Re-run the script to retry.`)
}

main().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})
