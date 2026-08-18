import {
  BRAND_THESIS,
  FAQS,
  HOW_WE_WORK,
  PROBLEMS,
  STEPS,
  STEPS_NOTE,
  TIERS,
} from "@/lib/content";
import { Badge, Card, CtaButton, Section, SectionTitle } from "@/components/ui";
import Analytics from "@/components/Analytics";
import Reveal from "@/components/Reveal";
import Hero from "@/components/Hero";
import EoiForm from "@/components/EoiForm";

const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "rafael@digitalpathways.io";

export default function Page() {
  return (
    <>
      <Analytics />
      <Hero />

      {/* --- Problem ------------------------------------------------------ */}
      <Section tone="white">
        <SectionTitle>Sounds familiar?</SectionTitle>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {PROBLEMS.map((problem, index) => (
            <Reveal key={problem.title} delay={index * 80}>
              <Card className="h-full">
                <h3 className="t-h3 text-ink">{problem.title}</h3>
                <p className="t-body mt-3 text-gray-600">{problem.body}</p>
              </Card>
            </Reveal>
          ))}
        </div>

        <p className="t-h3 mt-10 max-w-[24ch]" style={{ color: "var(--color-teal-700)" }}>
          {BRAND_THESIS}
        </p>
      </Section>

      {/* --- How it works ------------------------------------------------- */}
      <Section tone="teal">
        <SectionTitle>How it works</SectionTitle>

        <ol className="mt-8 grid gap-6 md:grid-cols-3">
          {STEPS.map((step, index) => (
            <li key={step.title}>
              <Reveal delay={index * 80}>
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-full text-[16px] font-semibold text-white"
                  style={{ background: "var(--color-coral-600)" }}
                  aria-hidden="true"
                >
                  {index + 1}
                </span>
                <h3 className="t-h3 mt-4 text-ink">{step.title}</h3>
                <p className="t-body mt-2 text-gray-600">{step.body}</p>
              </Reveal>
            </li>
          ))}
        </ol>

        <p className="t-small mt-8 max-w-[65ch] text-gray-600">{STEPS_NOTE}</p>
      </Section>

      {/* --- What's included ---------------------------------------------- */}
      <Section tone="sampaguita">
        <SectionTitle>What membership will include</SectionTitle>
        <p className="t-body mt-3 max-w-[65ch] text-gray-600">
          SynergyCare is pre-launch. This is what we&rsquo;re building, shaped with
          our first founding families.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {TIERS.map((tier) => (
            <Card key={tier.name} className="h-full">
              <h3 className="t-h3 text-ink">{tier.name}</h3>
              {"inherits" in tier && tier.inherits && (
                <p className="t-small mt-2 text-gray-600">{tier.inherits}</p>
              )}
              <ul className="mt-4 space-y-2">
                {tier.items.map((item) => (
                  <li key={item} className="t-body flex gap-2 text-ink">
                    <span aria-hidden="true" style={{ color: "var(--color-teal-700)" }}>
                      ·
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>

        <p className="t-body mt-6 max-w-[65ch] text-ink">
          Founding families help us set fair pricing — tell us what would work
          for you in the registration form.
        </p>
      </Section>

      {/* --- Why trust us -------------------------------------------------- */}
      <Section tone="white">
        <div className="grid gap-10 md:grid-cols-2 md:gap-14">
          <div>
            <SectionTitle>Why trust us</SectionTitle>

            <blockquote className="t-body-lg mt-6 max-w-[60ch] text-ink">
              <p>
                I built SynergyCare because I know what it&rsquo;s like to get that
                call — the one that comes at 2 a.m., when you&rsquo;re 11,000 km
                away and all you can do is send money and wait. My parents are in
                the Philippines. I&rsquo;m here in New Zealand.
              </p>
              <p className="mt-4">
                For years I sent money for &ldquo;gamot&rdquo; and never really knew what
                happened next. So I started arranging it properly — a person on
                the ground, real appointments, real updates. That&rsquo;s what this
                is, and I&rsquo;m building it for families like mine.
              </p>
            </blockquote>

            <p className="t-body mt-5 font-medium text-ink">Rafael</p>
            <p className="t-small text-gray-600">Founder, SynergyCare · Auckland, NZ</p>
          </div>

          <div>
            <Card>
              <h3 className="t-h3 text-ink">How we work</h3>
              <ul className="mt-4 space-y-3">
                {HOW_WE_WORK.map((item) => (
                  <li key={item} className="t-body flex gap-3 text-ink">
                    <span aria-hidden="true" style={{ color: "var(--color-teal-700)" }}>
                      ✓
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <p className="t-small mt-5 text-gray-600">
              SynergyCare is operated by a New Zealand registered company. We
              collect only what we need to contact you about SynergyCare, we
              never sell your data, and you can ask us to delete it at any time.{" "}
              <a href="/privacy" className="text-teal-700 underline-offset-2 hover:underline">
                Read our privacy policy
              </a>
              .
            </p>
          </div>
        </div>
      </Section>

      {/* --- EOI form ------------------------------------------------------ */}
      <Section id="eoi-form" tone="sampaguita">
        <div className="mx-auto max-w-[720px]">
          <div className="mb-6">
            <Badge>Founding families</Badge>
          </div>
          <EoiForm />
        </div>
      </Section>

      {/* --- FAQ ----------------------------------------------------------- */}
      <Section tone="white">
        <SectionTitle>Questions</SectionTitle>

        <div className="mt-8 max-w-[720px] divide-y divide-gray-300 border-y border-gray-300">
          {FAQS.map((faq) => (
            <details key={faq.q} className="group py-5">
              <summary className="t-h3 cursor-pointer list-none text-ink marker:content-none">
                {faq.q}
              </summary>
              <p className="t-body mt-3 max-w-[65ch] text-gray-600">{faq.a}</p>
            </details>
          ))}
        </div>

        <div className="mt-10">
          <CtaButton href="#eoi-form">Register your interest</CtaButton>
        </div>
      </Section>

      {/* --- Footer -------------------------------------------------------- */}
      <footer className="bg-sampaguita px-5 py-12">
        <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-4">
          <p className="t-h3" style={{ color: "var(--color-teal-700)" }}>
            SynergyCare
          </p>
          <p className="t-body max-w-[50ch] text-ink">
            Real care for your parents in the Philippines, arranged from wherever
            you are.
          </p>
          <div className="t-small flex flex-wrap gap-x-6 gap-y-2 text-gray-600">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-teal-700 underline-offset-2 hover:underline"
            >
              {CONTACT_EMAIL}
            </a>
            <a href="/privacy" className="text-teal-700 underline-offset-2 hover:underline">
              Privacy policy
            </a>
          </div>
          <p className="t-small text-gray-600">
            Made with aroha in Aotearoa, for families in the Philippines.
          </p>
        </div>
      </footer>
    </>
  );
}
