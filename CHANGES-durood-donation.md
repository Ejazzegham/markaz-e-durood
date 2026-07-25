# What changed & how to apply

Copy these files into your project, overwriting the files at the same paths
(everything else — public/, node_modules, your other pages/components — is
untouched):

- `src/middleware.ts`
- `src/app/api/durood/submit/route.ts`
- `src/app/api/donations/submit/route.ts` **(new file)**
- `src/app/api/dashboard/my-donations/route.ts` **(new file)**
- `src/app/(site)/account/donate/page.tsx`
- `src/app/(site)/account/submit-durood/page.tsx`
- `src/app/(site)/dashboard/page.tsx`
- `src/components/Navbar.tsx`
- `README.md`

## What was actually broken

1. **`/api/durood/submit` required login.** The public Durood-count widget
   looked guest-friendly, but the API rejected any request without a
   session cookie (`401 Please log in`). Guests could never actually submit.
2. **Donations had no backend at all.** `/account/donate` was a static mock
   form — clicking "Donate Now" just showed a fake "Thank You" and never
   called any API or saved anything.
3. **Middleware forced login** on `/account/donate` and
   `/account/submit-durood`, even though your homepage's "Submit Durood"
   and "Donate Now" buttons are shown to every visitor — so guests clicking
   them were redirected straight to the login page.
4. Donations had **no place in the dashboard history** — only Durood did.

## What's fixed now

1. **Guest, no registration required** — `/durood-count` (widget) and
   `/account/submit-durood` let anyone send Durood by typing a name (or
   ticking "anonymous"). `/account/donate` now really submits to
   `/api/donations/submit` the same way.
2. **Registered users** — same forms work when signed in; the submission is
   also linked to their account (`userId`) so it shows up in their history,
   even if they submit publicly as "Anonymous".
3. **Dashboard history** (`/dashboard`, login required) now shows **both**
   "My Durood History" and a new "My Donations" table with date, amount,
   message, and public/anonymous visibility, plus a running total.

## One important thing to know

**There's no payment gateway wired up** (no Stripe/PayPal keys in your
`.env`). "Donate" records a donation *request/pledge* in Firestore — the
same thing your original placeholder text ("Your donation request has been
received") implied — it does not move any money. If you want real online
payments, that needs a payment processor integrated separately.

## New Firestore collection

A new `donations` collection is created automatically on first use — same
pattern as `duroodSubmissions`. The first time each new query shape runs
(the `ipAddress`+`createdAt` spam guard, and a member's own
`userId`+`createdAt` history), Firestore will log a link to create the
required composite index. Click it once per query shape, same as you
already do for the Durood counter.

## Optional cleanup (not touched, left as-is)

Two pages in your project aren't linked from anywhere and are effectively
dead code — you can leave them or remove them, entirely up to you:
- `src/app/(site)/account/donation/page.tsx` — a duplicate, non-functional
  login/register form.
- `src/app/(site)/account/page.tsx` — an old static "My Account" page with
  hardcoded 0s; `/dashboard` is the real one your Navbar and login/register
  redirects actually point to.
