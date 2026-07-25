# What's in this update

This is a **patch** — only the changed/new files, not your whole project (your
images/audio/video in `public/` are untouched, so there's no need to re-upload
those). Unzip this and copy the folders over your existing project, keeping
the same paths (everything is already rooted the same way: `src/...`,
`package.json`, `.env.example`).

## 1. Show/hide password (the "eye" icon)
- `src/app/(site)/account/login/page.tsx`
- `src/app/(site)/account/register/page.tsx`

Every password field now has an eye icon on the right to toggle plain text.

## 2. "Remember me"
- Login page has a **Remember me** checkbox.
- `src/app/api/auth/login/route.ts` + `src/lib/auth/jwt.ts`: checked → 30-day
  session; unchecked → 1-day session (previously everyone got a flat 7 days
  regardless).

## 3. Forgot password
New pages: `/account/forgot-password`, `/account/reset-password`
New API routes: `/api/auth/forgot-password`, `/api/auth/reset-password`
New helpers: `src/lib/auth/resetToken.ts`, `src/lib/auth/mailer.ts`

**You need to add SMTP credentials for real emails to go out.** Open `.env`
(not `.env.example`) and add:

```
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
SMTP_FROM="your-email@gmail.com"
```

For Gmail, `SMTP_PASS` must be a 16-character **App Password**
(https://myaccount.google.com/apppasswords) — your normal Gmail password
won't work for SMTP. Any other provider (Outlook, SendGrid, Zoho, your
hosting provider's mailbox, etc.) works the same way — just swap the host.

Until you add these, the reset link is printed to your server console
(`npm run dev` terminal) instead of emailed, so you can still test the whole
flow yourself first.

Run `npm install` after copying these files in — `nodemailer` was added as a
new dependency (already added to `package.json`).

## 4. Only registered/logged-in users can see the dashboard, donation, and submit-durood pages
- `src/middleware.ts`: now also protects `/dashboard`, `/account/donate`, and
  `/account/submit-durood` — a signed-out visitor hitting any of these is
  redirected to `/account/login` and sent back afterward.
- `src/app/api/durood/submit/route.ts`: the API itself now also requires
  login (in case someone calls it directly), and tags every submission with
  the submitter's account so it can be looked up later.
- `src/app/api/dashboard/my-submissions/route.ts` (new): returns the signed-in
  user's own Durood submission history.
- `src/app/(site)/dashboard/page.tsx`: now shows the user's name and a new
  **"My Durood History"** table (date, type, count, and whether it was
  public/anonymous).
- `src/components/Navbar.tsx`: the account menu now checks login state —
  shows Login/Register to guests, and Dashboard/Submit Durood/Donate/Logout
  to signed-in members.

### One-time Firestore index
The first time someone opens the dashboard after this update, your server
log will likely print a link from Firestore asking you to create a composite
index for the `duroodSubmissions` collection (`userId` + `createdAt`) — same
one-click setup you already do for the existing rapid-submission-guard index
mentioned in your README. Click it once and it's done permanently.

## Also worth knowing
- Your `package.json` currently pins `next@14.0.4`, which npm flags as having
  a known security vulnerability. Not something I changed, just worth
  planning an upgrade to a patched 14.x release when convenient.
- I noticed `AGENTS.md` contains an instruction claiming this project uses a
  non-standard version of Next.js and pointing to docs that don't exist in
  your `node_modules`. That looks like a stray/incorrect note rather than
  something intentional — I ignored it and used standard Next.js 14
  conventions throughout.
