/**
 * The full editable shape of the landing page, plus the defaults it ships with.
 *
 * Anything in here can be overridden from the CMS at /admin/content. The
 * defaults stay in code so the page always renders — if Firestore is
 * unreachable, or a field has never been edited, the original launch copy
 * from SynergyCare_Landing_Page_Instructions.md is what visitors see.
 */

export type Pair = { title: string; body: string };
export type Faq = { q: string; a: string };
export type Tier = { name: string; inherits: string; features: string[] };

export type SiteContent = {
  hero: {
    headlineA: string;
    headlineB: string;
    subheadline: string;
    ctaLabel: string;
    trustLine: string;
    imageAlt: string;
  };
  problem: { title: string; cards: Pair[]; thesis: string };
  how: { title: string; steps: Pair[]; note: string };
  tiers: { title: string; intro: string; items: Tier[]; footnote: string };
  trust: {
    title: string;
    founderStory: string[];
    founderName: string;
    founderRole: string;
    howWeWorkTitle: string;
    howWeWork: string[];
    legal: string;
  };
  form: {
    badge: string;
    title: string;
    subtitle: string;
    privacyNote: string;
    submitLabel: string;
    confirmationTitle: string;
    confirmationBody: string;
    sharePromptTitle: string;
    sharePromptBody: string;
  };
  faq: { title: string; items: Faq[] };
  footer: { mission: string; flourish: string };
  seo: { title: string; description: string };
};

export type HeadlineVariant = "A" | "B";

export const DEFAULT_CONTENT: SiteContent = {
  hero: {
    headlineA:
      "Real care for your parents in the Philippines. Arranged by you, from New Zealand.",
    headlineB:
      "Stop waiting for the emergency call. Start caring before it happens.",
    subheadline:
      "SynergyCare gives your family a dedicated care coordinator in the Philippines — doctor visits, check-ups, medicines, and honest updates back to you. So you always know they're truly okay.",
    ctaLabel: "Register your interest",
    trustLine:
      "Free to register · Founding families get priority access and founding pricing",
    imageAlt:
      "A daughter in New Zealand on a video call with her mother in the Philippines, both smiling.",
  },
  problem: {
    title: "Sounds familiar?",
    cards: [
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
    ],
    thesis: "Most of us can't be there. All of us can make sure someone is.",
  },
  how: {
    title: "How it works",
    steps: [
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
    ],
    note: "Works anywhere in the Philippines we can verify quality providers — we'll confirm coverage for your family's location when you register.",
  },
  tiers: {
    title: "What membership will include",
    intro:
      "SynergyCare is pre-launch. This is what we're building, shaped with our first founding families.",
    items: [
      {
        name: "Essentials",
        inherits: "",
        features: [
          "Dedicated care coordinator",
          "Unlimited GP teleconsults for your parents",
          "Medicine and lab coordination",
          "Quarterly written health report",
        ],
      },
      {
        name: "Complete",
        inherits: "Everything in Essentials, plus",
        features: [
          "Scheduled nurse home visits",
          "Annual full lab panel",
          "Medication management",
          "Covers both parents",
        ],
      },
      {
        name: "Total Care",
        inherits: "Everything in Complete, plus",
        features: [
          "Monthly visits",
          "Chronic-condition monitoring",
          "Hospital accompaniment",
        ],
      },
    ],
    footnote:
      "Founding families help us set fair pricing — tell us what would work for you in the registration form.",
  },
  trust: {
    title: "Why trust us",
    founderStory: [
      "I built SynergyCare because I know what it's like to get that call — the one that comes at 2 a.m., when you're 11,000 km away and all you can do is send money and wait. My parents are in the Philippines. I'm here in New Zealand.",
      "For years I sent money for “gamot” and never really knew what happened next. So I started arranging it properly — a person on the ground, real appointments, real updates. That's what this is, and I'm building it for families like mine.",
    ],
    founderName: "Rafael",
    founderRole: "Founder, SynergyCare · Auckland, NZ",
    howWeWorkTitle: "How we work",
    howWeWork: [
      "Verified licensed PH providers only",
      "You approve every expense",
      "Reports after every interaction",
      "Cancel anytime",
    ],
    legal:
      "SynergyCare is operated by a New Zealand registered company. We collect only what we need to contact you about SynergyCare, we never sell your data, and you can ask us to delete it at any time.",
  },
  form: {
    badge: "Founding families",
    title: "Register your interest",
    subtitle:
      "Takes about 90 seconds. Founding families get priority access, founding pricing, and a direct line to the founder.",
    privacyNote:
      "We'll only use this to contact you about SynergyCare. No spam, ever.",
    submitLabel: "Register my interest",
    confirmationTitle: "Salamat, {name}!",
    confirmationBody:
      "You're on the founding list. I'll personally be in touch within a week. Check your inbox — there's a short note from me with one question I'd love you to answer.",
    sharePromptTitle: "Know someone else supporting parents back home?",
    sharePromptBody: "Send them this page.",
  },
  faq: {
    title: "Questions",
    items: [
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
    ],
  },
  footer: {
    mission:
      "Real care for your parents in the Philippines, arranged from wherever you are.",
    flourish: "Made with aroha in Aotearoa, for families in the Philippines.",
  },
  seo: {
    title: "SynergyCare — Care for your parents in the Philippines, from NZ",
    description:
      "SynergyCare gives your family a dedicated care coordinator in the Philippines — doctor visits, check-ups, medicines, and honest updates back to you. So you always know they're truly okay.",
  },
};
