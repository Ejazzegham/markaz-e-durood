import { cert, getApps, initializeApp, type App } from 'firebase-admin/app'
import { getFirestore, type Firestore } from 'firebase-admin/firestore'

// Firebase Admin must only ever be initialized once per server process,
// otherwise it throws "app already exists". Next.js can re-evaluate this
// module multiple times in dev (hot reload) and across serverless
// invocations, so we cache the app/db on the global object.

declare global {
  // eslint-disable-next-line no-var
  var __firebaseAdminApp: App | undefined
  // eslint-disable-next-line no-var
  var __firestoreDb: Firestore | undefined
}

function initFirebaseAdmin(): App {
  if (global.__firebaseAdminApp) return global.__firebaseAdminApp

  const existing = getApps()
  if (existing.length > 0) {
    global.__firebaseAdminApp = existing[0]
    return existing[0]
  }

  const projectId = process.env.FIREBASE_PROJECT_ID
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
  // Private keys are stored in .env with literal "\n" sequences (since real
  // newlines aren't valid in most .env formats) — they need to be converted
  // back to actual newlines before Firebase will accept them.
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      'Missing Firebase Admin credentials. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL and ' +
        'FIREBASE_PRIVATE_KEY in your .env file (see .env.example).'
    )
  }

  const app = initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
  })

  global.__firebaseAdminApp = app
  return app
}

export function getDb(): Firestore {
  if (global.__firestoreDb) return global.__firestoreDb
  const app = initFirebaseAdmin()
  const db = getFirestore(app)
  global.__firestoreDb = db
  return db
}
