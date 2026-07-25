This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
"# markaz-e-durood" 

---

## Admin Panel

Manage Books, Naat Shareef, Bayan, and Pictures from a built-in admin panel at `/admin`.

### One-time setup

This project uses **Firestore** (Firebase) as its database and **Cloudflare R2** for file storage (book covers, PDFs, pictures, etc).

1. Copy `.env.example` to `.env` and fill in:
   - `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` — from Firebase Console > Project settings > Service accounts > Generate new private key.
   - `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_PUBLIC_URL` — from the Cloudflare dashboard under R2.
   - `ADMIN_EMAIL` and `ADMIN_PASSWORD` for the account you want to log in with.
2. In Firestore, make sure Native mode is enabled for your project (not Datastore mode).
3. Create your admin account from the credentials in your `.env` file:
   ```bash
   npm run db:seed
   ```
4. Start the app and log in at `/admin/login` with that email/password.

### Notes

- Uploaded files are streamed straight to your Cloudflare R2 bucket (`src/lib/storage/r2.ts`) and served from `R2_PUBLIC_URL`. Nothing is written to local disk, so this works on serverless hosts like Vercel.
- All data lives in Firestore, via a thin adapter (`src/lib/db/collection.ts` and `src/lib/db/firestore.ts`) that keeps the same `findMany`/`create`/`update`/`delete` shape the admin panel already used. Collections: `users`, `duroodSubmissions`, `bookResources`, `naats`, `bayans`, `galleryImages`, `audioResources`, `videoResources`, `blogPosts`, `news`, `faqs`.
- Firestore will prompt (with a direct link in the server logs) to create a composite index the first time a query needs one — e.g. the rapid-submission guard on the Durood counter (`ipAddress` + `createdAt`). Click that link once and it's a one-time setup per query shape.
- The Durood counter stats route (`/api/durood/stats`) computes its aggregates (totals, leaderboards, trend) in memory from all approved submissions, since Firestore has no server-side SUM/GROUP BY. Fine at this site's scale; if submissions grow very large, consider maintaining running totals with a Cloud Function trigger instead.
- All public pages (Books, Naat, Bayan, Audio, Video, Blog, News, FAQ, Gallery, and the Durood counter) read live from Firestore via the admin panel — there's no hardcoded/demo content. New sites start empty; add content through `/admin`.
"# markaz-e-durood" 
