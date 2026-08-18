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

## One manual step before the form will save

The Firestore API is not yet enabled on `synergy-care-ab574`. The service
account cannot enable it itself — it needs an owner click:

1. Open https://console.firebase.google.com/project/synergy-care-ab574/firestore
2. **Create database** → production mode → region `australia-southeast1`
   (closest to NZ; keeps writes fast and data in-region)
3. Push the lock-down rules:

```bash
npx firebase deploy --only firestore:rules --project synergy-care-ab574
```

Then confirm the round trip:

```bash
curl -s -X POST http://localhost:3000/api/eoi -H 'Content-Type: application/json' -d '{"first_name":"Test","email":"test@example.com","answers":{"q1_region":"auckland","q2_for_whom":"both_parents","q3_age":"75_plus","q4_location":"province_rural","q5_medical_remit":"emergency","q6_budget":"100_149","q7_commitment":"yes"},"headline_variant":"A"}'
```

Expect `{"ok":true,"score":"A"}`.

## Environment

`.env.local` holds real values and is gitignored. `.env.example` is the
template. When deploying to Vercel, add every variable from `.env.local` to the
project settings — paste `FIREBASE_PRIVATE_KEY` **with the quotes and the `\n`
sequences intact**.

## What to add before launch

| Item | Where |
|---|---|
| Hero photograph (adult child on a video call with a parent) | `public/hero.webp` — a warm placeholder shows until it exists |
| OG share image, 1200×630 | `public/og.jpg` |
| Founder photo + real founder story | `src/app/page.tsx`, "Why trust us" |
| NZ company name for the footer trust line | `src/app/page.tsx` |

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
`utm_campaign`, `referrer`, `created_at`, `updated_at`.
