import { Timestamp } from 'firebase-admin/firestore'
import { getDb } from './firestore'

// A small Prisma-delegate-shaped wrapper around a Firestore collection.
// It only supports what the admin content routes actually need — plain
// equality `where` clauses and ordering by `createdAt` — which keeps it
// simple instead of trying to be a full Prisma-on-Firestore ORM.

type WhereClause = Record<string, boolean | string | number>

function toPlainObject(id: string, data: FirebaseFirestore.DocumentData) {
  const plain: Record<string, any> = { id }
  for (const [key, value] of Object.entries(data)) {
    plain[key] = value instanceof Timestamp ? value.toDate() : value
  }
  // Every model relies on createdAt/updatedAt existing, even for rows
  // written before those fields were backfilled.
  if (!plain.createdAt) plain.createdAt = new Date(0)
  if (!plain.updatedAt) plain.updatedAt = plain.createdAt
  return plain
}

export function collection(name: string) {
  const col = () => getDb().collection(name)

  return {
    async findMany(opts: { where?: WhereClause; orderBy?: { createdAt: 'asc' | 'desc' } } = {}) {
      let query: FirebaseFirestore.Query = col()
      for (const [field, value] of Object.entries(opts.where || {})) {
        query = query.where(field, '==', value)
      }
      if (opts.orderBy?.createdAt) {
        query = query.orderBy('createdAt', opts.orderBy.createdAt)
      }
      const snap = await query.get()
      return snap.docs.map((doc) => toPlainObject(doc.id, doc.data()))
    },

    async findUnique(id: string) {
      const doc = await col().doc(id).get()
      if (!doc.exists) return null
      return toPlainObject(doc.id, doc.data()!)
    },

    async create(opts: { data: Record<string, any> }) {
      const now = new Date()
      const ref = col().doc()
      const data = { ...opts.data, createdAt: now, updatedAt: now }
      await ref.set(data)
      return toPlainObject(ref.id, data)
    },

    async update(opts: { where: { id: string }; data: Record<string, any> }) {
      const ref = col().doc(opts.where.id)
      const data = { ...opts.data, updatedAt: new Date() }
      await ref.update(data)
      const doc = await ref.get()
      return toPlainObject(doc.id, doc.data()!)
    },

    async delete(opts: { where: { id: string } }) {
      await col().doc(opts.where.id).delete()
      return { id: opts.where.id }
    },

    async count(opts: { where?: WhereClause } = {}) {
      let query: FirebaseFirestore.Query = col()
      for (const [field, value] of Object.entries(opts.where || {})) {
        query = query.where(field, '==', value)
      }
      const snap = await query.count().get()
      return snap.data().count
    },
  }
}
