/**
 * Seeds the admin account used to log in to /admin.
 * Reads ADMIN_EMAIL and ADMIN_PASSWORD from your .env file.
 *
 * Run with: npm run db:seed
 */
require('dotenv').config()
const bcrypt = require('bcryptjs')
const { initializeApp, cert } = require('firebase-admin/app')
const { getFirestore } = require('firebase-admin/firestore')

async function main() {
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD
  const projectId = process.env.FIREBASE_PROJECT_ID
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')

  if (!email || !password) {
    console.error(
      '\nADMIN_EMAIL and/or ADMIN_PASSWORD are missing from your .env file.\n' +
        'Add both, then run "npm run db:seed" again.\n'
    )
    process.exit(1)
  }

  if (!projectId || !clientEmail || !privateKey) {
    console.error(
      '\nFIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL and/or FIREBASE_PRIVATE_KEY are missing ' +
        'from your .env file. See .env.example.\n'
    )
    process.exit(1)
  }

  initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) })
  const db = getFirestore()

  const hashedPassword = await bcrypt.hash(password, 10)
  const users = db.collection('users')

  const existingSnap = await users.where('email', '==', email).limit(1).get()
  const now = new Date()

  if (!existingSnap.empty) {
    await existingSnap.docs[0].ref.update({
      password: hashedPassword,
      role: 'SUPER_ADMIN',
      isActive: true,
      updatedAt: now,
    })
  } else {
    await users.add({
      name: 'Admin',
      email,
      password: hashedPassword,
      role: 'SUPER_ADMIN',
      isActive: true,
      totalSubmissions: 0,
      createdAt: now,
      updatedAt: now,
    })
  }

  console.log(`\nAdmin account ready: ${email}`)
  console.log('You can now log in at /admin/login with the credentials from your .env file.\n')
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
