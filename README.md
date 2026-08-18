# SynergyCare — landing page

Phase 2 smoke test. One page, one action: capture qualified expressions of
interest from Filipinos in New Zealand supporting parents back home.

Built from `SynergyCare_Landing_Page_Instructions.md` (structure, copy, form
logic) and `SynergyCare_Design_System.md` (all visual decisions).

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind v4 — design tokens live in `src/app/globals.css` under `@theme`
- Firebase: Analytics in the browser, Firestore via the Admin SDK on the server
- Fonts: Fraunces (headings) + Inter (body), self-hosted by `next/font`

## Run it

```bash
npm run dev
```

## Firestore

The database is live and the full round trip is verified. Push the lock-down
rules before the page takes real traffic:

```bash
npx firebase deploy --only firestore:rules --project synergy-care-ab574
```

Sanity-check the endpoint any time with:

```bash
curl -s -X POST http://localhost:3000/api/eoi -H 'Content-Type: application/json' -d '{"first_name":"Test","email":"test@example.com","answers":{"q1_region":"auckland","q2_for_whom":"both_parents","q3_age":"75_plus","q4_location":"province_rural","q5_medical_remit":"emergency","q6_budget":"100_149","q7_commitment":"yes"},"headline_variant":"A"}'
```

Expect `{"ok":true,"score":"A"}`. Delete the test document afterwards so it
does not pollute the conversion numbers.


## Admin portal

Sign in at **`/admin`**. The portal has four screens:

| Screen | What it does |
|---|---|
| Dashboard | Registration counts, A/B/C lead quality against the 30% gate, willingness-to-pay spread, where parents live, how people found you, and the headline A/B split |
| Registrations | Every answer as given. Filter by grade, provincial, or "wrote a worry"; search name, email and free text; open a family to read their full questionnaire; export CSV |
| Page content | Every word on the landing page, grouped by section. Save publishes immediately |
| Images | Drag-and-drop upload for the hero photo, social share image and founder photo |

### Access

Admin access is an explicit `admin` custom claim, not merely having a Firebase
account — so if this project ever holds non-staff accounts, they cannot reach
the portal. Grant or revoke it with:

```bash
npm run grant-admin -- someone@synergycare.co.nz
```

Add `--revoke` to remove access. The account is created if it does not exist,
and a temporary password is printed. Changes take effect at the next sign-in,
because existing sessions are revoked.

Sign-in exchanges a Firebase ID token for an httpOnly session cookie, verified
server-side on every admin request. The token is never kept anywhere JavaScript
can read it, so an XSS bug on the public page cannot lift admin credentials.

### Editing content

`src/lib/content.ts` holds the launch copy as defaults **in code**. The CMS
stores only overrides, deep-merged on top. That means the page still renders
the original copy if Firestore is unreachable or a field has never been touched
— a broken CMS cannot take the landing page down mid-campaign.

Both hero headlines are editable, so the A/B test keeps running while copy is
tuned. Saving revalidates the landing page immediately rather than waiting for
the 5-minute ISR window.

### Images

Firebase Storage needs the Blaze plan and this project has no billing account,
so images are stored in Firestore instead. Every upload is re-encoded to WebP
and resized, targeting ~280 KB to protect the sub-2s load on 4G — an 11.6 MB
photo came out at 429 KB in testing, and a normal photograph lands far below
that. Firestore caps a document at 1 MiB, which the encoder enforces.

Images are served from `/api/media/[slug]` with a `?v=` content hash and
immutable cache headers, so a new upload busts every cache instantly. If
billing is ever enabled, only `src/lib/media-store.ts` needs to change.

## Environment

`.env.local` holds real values and is gitignored. `.env.example` is the
template. When deploying to Vercel, add every variable from `.env.local` to the
project settings — paste `FIREBASE_PRIVATE_KEY` **with the quotes and the `\n`
sequences intact**.

## What to add before launch

All of these are now editable in the admin portal — no code changes needed.

| Item | Where |
|---|---|
| Hero photograph (adult child on a video call with a parent) | `/admin/media` — a warm placeholder shows until one is uploaded |
| OG share image, 1200×630 | `/admin/media` |
| Real founder story | `/admin/content` → "Why trust us" |
| NZ company name for the footer trust line | `/admin/content` → "Why trust us" |

## How the measurement works

**Headline A/B** — 50/50 on first visit, persisted in `localStorage`, recorded
on every submit. Force a variant with `?v=A` or `?v=B` for QA and ad creative.

**Analytics events** (Firebase Analytics): `page_view`, `scroll_50`,
`form_step1_complete`, `form_submit`, `share_click`.

**UTMs** are captured on landing and held in `sessionStorage`, so a visitor who
arrives from an ad, leaves, and comes back direct is still attributed correctly.

**Lead scoring** runs server-side on submit (`src/lib/scoring.ts`) and stores
`score` (A/B/C) plus `tags[]` on the record. The `provincial` tag builds the
provincial demand map that decides pilot geography.

Reads that matter, from the Firestore console:

- Conversion: `form_submit` ÷ `page_view` — gate is **≥ 3%**
- Lead quality: share of `score == "A"` — gate is **≥ 30%** A/B grade
- Price signal: distribution of `q6_budget`
- Messaging: submits split by `headline_variant` after ~500 visitors

## Follow-up email

`src/lib/email.ts` sends the plain-text note from Rafael via Resend. It is a
no-op until `RESEND_API_KEY` and `RESEND_FROM` are set — registrations still
save. A failed send never fails the registration.

## Data model — `eoi_leads`

Document ID is the email address, so a resubmission updates rather than
duplicating.

`first_name`, `email`, `mobile`, `worry_text`, `q1_region`, `q2_for_whom`,
`q3_age`, `q4_location`, `q5_medical_remit`, `q6_budget`, `q7_commitment`,
`score`, `tags[]`, `headline_variant`, `utm_source`, `utm_medium`,
`utm_campaign`, `referrer`, `created_at`, `updated_at`, `resubmissions`.

Writes merge, and empty values are stripped before the write. A visitor who
registers from a Facebook ad and later registers again from a direct visit
keeps the original UTMs, free-text answer and `created_at` — only the fields
they actually re-answered change. `tags[]` is derived, so it is replaced
wholesale rather than merged, otherwise a corrected answer would leave a stale
tag behind and skew the provincial demand map.
