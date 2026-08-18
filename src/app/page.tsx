import { getSiteContent } from "@/lib/site-content";
import { Badge, Card, CtaButton, Section, SectionTitle } from "@/components/ui";
import Analytics from "@/components/Analytics";
import Reveal from "@/components/Reveal";
import Hero from "@/components/Hero";
import EoiForm from "@/components/EoiForm";

const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "rafael@digitalpathways.io";

// Regenerated on demand whenever the CMS saves, with a slow ceiling as a
// backstop so a missed revalidation can never strand stale copy for long.
export const revalidate = 300;

export default async function Page() {
  const c = await getSiteContent();

  return (
    <>
      <Analytics />
      <Hero hero={c.hero} image={c.heroImage} />

      {/* --- Problem ------------------------------------------------------ */}
      <Section tone="white">
        <SectionTitle>{c.problem.title}</SectionTitle>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {c.problem.cards.map((problem, index) => (
            <Reveal key={`${problem.title}-${index}`} delay={index * 80}>
              <Card className="h-full">
                <h3 className="t-h3 text-ink">{problem.title}</h3>
                <p className="t-body mt-3 text-gray-600">{problem.body}</p>
              </Card>
            </Reveal>
          ))}
        </div>

        <p className="t-h3 mt-10 max-w-[24ch]" style={{ color: "var(--color-teal-700)" }}>
          {c.problem.thesis}
        </p>
      </Section>

      {/* --- How it works ------------------------------------------------- */}
      <Section tone="teal">
        <SectionTitle>{c.how.title}</SectionTitle>

        <ol className="mt-8 grid gap-6 md:grid-cols-3">
          {c.how.steps.map((step, index) => (
            <li key={`${step.title}-${index}`}>
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

        <p className="t-small mt-8 max-w-[65ch] text-gray-600">{c.how.note}</p>
      </Section>

      {/* --- What's included ---------------------------------------------- */}
      <Section tone="sampaguita">
        <SectionTitle>{c.tiers.title}</SectionTitle>
        <p className="t-body mt-3 max-w-[65ch] text-gray-600">{c.tiers.intro}</p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {c.tiers.items.map((tier, index) => (
            <Card key={`${tier.name}-${index}`} className="h-full">
              <h3 className="t-h3 text-ink">{tier.name}</h3>
              {tier.inherits && <p className="t-small mt-2 text-gray-600">{tier.inherits}</p>}
              <ul className="mt-4 space-y-2">
                {tier.features.map((item, i) => (
                  <li key={`${item}-${i}`} className="t-body flex gap-2 text-ink">
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

        <p className="t-body mt-6 max-w-[65ch] text-ink">{c.tiers.footnote}</p>
      </Section>

      {/* --- Why trust us -------------------------------------------------- */}
      <Section tone="white">
        <div className="grid gap-10 md:grid-cols-2 md:gap-14">
          <div>
            <SectionTitle>{c.trust.title}</SectionTitle>

            <blockquote className="t-body-lg mt-6 max-w-[60ch] text-ink">
              {c.trust.founderStory.map((para, i) => (
                <p key={i} className={i ? "mt-4" : undefined}>
                  {para}
                </p>
              ))}
            </blockquote>

            <p className="t-body mt-5 font-medium text-ink">{c.trust.founderName}</p>
            <p className="t-small text-gray-600">{c.trust.founderRole}</p>
          </div>

          <div>
            <Card>
              <h3 className="t-h3 text-ink">{c.trust.howWeWorkTitle}</h3>
              <ul className="mt-4 space-y-3">
                {c.trust.howWeWork.map((item, i) => (
                  <li key={`${item}-${i}`} className="t-body flex gap-3 text-ink">
                    <span aria-hidden="true" style={{ color: "var(--color-teal-700)" }}>
                      ✓
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <p className="t-small mt-5 text-gray-600">
              {c.trust.legal}{" "}
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
          {c.form.badge && (
            <div className="mb-6">
              <Badge>{c.form.badge}</Badge>
            </div>
          )}
          <EoiForm content={c.form} />
        </div>
      </Section>

      {/* --- FAQ ----------------------------------------------------------- */}
      <Section tone="white">
        <SectionTitle>{c.faq.title}</SectionTitle>

        <div className="mt-8 max-w-[720px] divide-y divide-gray-300 border-y border-gray-300">
          {c.faq.items.map((faq, i) => (
            <details key={`${faq.q}-${i}`} className="group py-5">
              <summary className="t-h3 cursor-pointer list-none text-ink marker:content-none">
                {faq.q}
              </summary>
              <p className="t-body mt-3 max-w-[65ch] text-gray-600">{faq.a}</p>
            </details>
          ))}
        </div>

        <div className="mt-10">
          <CtaButton href="#eoi-form">{c.hero.ctaLabel}</CtaButton>
        </div>
      </Section>

      {/* --- Footer -------------------------------------------------------- */}
      <footer className="bg-sampaguita px-5 py-12">
        <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-4">
          <p className="t-h3" style={{ color: "var(--color-teal-700)" }}>
            SynergyCare
          </p>
          <p className="t-body max-w-[50ch] text-ink">{c.footer.mission}</p>
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
          {c.footer.flourish && <p className="t-small text-gray-600">{c.footer.flourish}</p>}
        </div>
      </footer>
    </>
  );
}
