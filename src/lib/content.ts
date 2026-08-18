/**
 * All page copy lives here so it can be edited without touching components.
 * Source: SynergyCare_Landing_Page_Instructions.md §3, §4, §7
 */

export const HEADLINES = {
  A: "Real care for your parents in the Philippines. Arranged by you, from New Zealand.",
  B: "Stop waiting for the emergency call. Start caring before it happens.",
} as const;

export type HeadlineVariant = keyof typeof HEADLINES;

export const SUBHEADLINE =
  "SynergyCare gives your family a dedicated care coordinator in the Philippines — doctor visits, check-ups, medicines, and honest updates back to you. So you always know they're truly okay.";

export const BRAND_THESIS =
  "Most of us can't be there. All of us can make sure someone is.";

export const PROBLEMS = [
  {
    title: "“Okay lang kami.”",
    body: "You ask how they are. They say they're fine. The check-up they skipped doesn't come up.",
  },
  {
    title: "The 2 a.m. message.",
    body: "A hospital bill, a rushed transfer, and no way to help from 11,000 km away except send money and wait.",
  },
  {
    title: "Money sent, story unknown.",
    body: "You paid for medicines and consultations — but you never see a receipt, a result, or a plan.",
  },
] as const;

export const STEPS = [
  {
    title: "Tell us about your parents.",
    body: "Where they live, their health, what worries you.",
  },
  {
    title: "We build their care routine.",
    body: "A dedicated coordinator arranges doctor consultations, home check-ups, labs, and medicine delivery with trusted local providers.",
  },
  {
    title: "You see everything.",
    body: "After every visit: a plain-English summary, photos, results, and what's next — straight to your phone.",
  },
] as const;

export const STEPS_NOTE =
  "Works anywhere in the Philippines we can verify quality providers — we'll confirm coverage for your family's location when you register.";

export const TIERS = [
  {
    name: "Essentials",
    items: [
      "Dedicated care coordinator",
      "Unlimited GP teleconsults for your parents",
      "Medicine and lab coordination",
      "Quarterly written health report",
    ],
  },
  {
    name: "Complete",
    inherits: "Everything in Essentials, plus",
    items: [
      "Scheduled nurse home visits",
      "Annual full lab panel",
      "Medication management",
      "Covers both parents",
    ],
  },
  {
    name: "Total Care",
    inherits: "Everything in Complete, plus",
    items: [
      "Monthly visits",
      "Chronic-condition monitoring",
      "Hospital accompaniment",
    ],
  },
] as const;

export const HOW_WE_WORK = [
  "Verified licensed PH providers only",
  "You approve every expense",
  "Reports after every interaction",
  "Cancel anytime",
] as const;

export const FAQS = [
  {
    q: "Is this available now?",
    a: "We're onboarding a small group of founding families first. Registering puts you in the queue — we'll contact you personally.",
  },
  {
    q: "Where in the Philippines do you operate?",
    a: "Anywhere we can verify quality providers. Metro areas are easiest; we're building provincial coverage first because that's where most of our parents live. We'll confirm for your family's barangay or city when we talk.",
  },
  {
    q: "Is this insurance?",
    a: "No. It's hands-on care coordination — real appointments, real visits, real updates. It works alongside PhilHealth and any HMO.",
  },
  {
    q: "My parents are private / don't like fuss.",
    a: "Ours too. Care is arranged around their routine, with their consent, framed as what it is: their child making sure they're looked after.",
  },
  {
    q: "How much will it cost?",
    a: "Founding families will help set pricing. Comparable services overseas run US$85–180/month; we're committed to fair NZ pricing for what's included.",
  },
] as const;
