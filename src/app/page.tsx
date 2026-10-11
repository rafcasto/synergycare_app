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

      {/* --- Pricing ------------------------------------------------------ */}
      <Section tone="sampaguita">
        <SectionTitle>{c.pricing.title}</SectionTitle>
        <p className="t-body mt-3 max-w-[65ch] text-gray-600">{c.pricing.intro}</p>

        <div className="mt-10 grid gap-6 md:grid-cols-2 md:items-stretch">
          {/* Option 1 — membership */}
          <Reveal className="relative flex">
            {c.pricing.member.badge && (
              <div className="absolute -top-3 left-6 z-10">
                <Badge>{c.pricing.member.badge}</Badge>
              </div>
            )}
            <div className="flex w-full flex-col rounded-[16px] bg-teal-700 p-8 text-white">
              <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-teal-100">
                {c.pricing.member.eyebrow}
              </p>
              <h3 className="t-h2 mt-2 text-white">{c.pricing.member.name}</h3>
              <p className="t-body mt-3 text-teal-100">{c.pricing.member.description}</p>

              <p className="mt-6 flex flex-wrap items-baseline gap-x-2">
                {c.pricing.member.pricePrefix && (
                  <span className="t-body text-teal-100">{c.pricing.member.pricePrefix}</span>
                )}
                <span className="t-display text-white">{c.pricing.member.price}</span>
                {c.pricing.member.priceSuffix && (
                  <span className="t-body text-teal-100">{c.pricing.member.priceSuffix}</span>
                )}
              </p>

              <hr className="my-6 border-white/20" />

              <p className="t-small font-semibold text-white">{c.pricing.member.includedTitle}</p>
              <ul className="mt-4 space-y-3">
                {c.pricing.member.features.map((item, i) => (
                  <li key={`${item}-${i}`} className="t-body flex gap-3">
                    <span aria-hidden="true" className="font-semibold text-gold-400">
                      ✓
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-10">
                <a
                  href="#eoi-form"
                  className="inline-flex min-h-[48px] w-full items-center justify-center rounded-[12px] bg-white px-6 py-3 text-[16px] font-semibold text-teal-700 transition-colors duration-200 ease-out hover:bg-teal-100"
                >
                  {c.pricing.member.ctaLabel}
                </a>
              </div>
            </div>
          </Reveal>

          {/* Option 2 — pay as you go */}
          <Reveal className="flex" delay={80}>
            <div className="flex w-full flex-col rounded-[16px] border border-gray-300 bg-white p-8">
              <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-gray-600">
                {c.pricing.payg.eyebrow}
              </p>
              <h3 className="t-h2 mt-2" style={{ color: "var(--color-teal-700)" }}>
                {c.pricing.payg.name}
              </h3>
              <p className="t-body mt-3 text-gray-600">{c.pricing.payg.description}</p>

              <p className="mt-6 flex flex-wrap items-baseline gap-x-2">
                <span className="t-display" style={{ color: "var(--color-teal-700)" }}>
                  {c.pricing.payg.price}
                </span>
                {c.pricing.payg.priceSuffix && (
                  <span className="t-body text-gray-600">{c.pricing.payg.priceSuffix}</span>
                )}
              </p>

              <hr className="my-6 border-gray-300" />

              <p className="t-small font-semibold text-ink">{c.pricing.payg.servicesTitle}</p>
              <ul className="mt-2 divide-y divide-gray-300">
                {c.pricing.payg.services.map((service, i) => (
                  <li
                    key={`${service.name}-${i}`}
                    className="t-body flex items-baseline justify-between gap-4 py-3"
                  >
                    <span className="font-medium" style={{ color: "var(--color-teal-700)" }}>
                      {service.name}
                    </span>
                    <span className="shrink-0 text-ink">{service.price}</span>
                  </li>
                ))}
              </ul>

              {c.pricing.payg.note && (
                <p className="t-small mt-6 text-gray-600">{c.pricing.payg.note}</p>
              )}

              <div className="mt-auto pt-8">
                <a
                  href="#eoi-form"
                  className="inline-flex min-h-[48px] w-full items-center justify-center rounded-[12px] border-2 border-teal-700 bg-white px-6 py-3 text-[16px] font-semibold text-teal-700 transition-colors duration-200 ease-out hover:bg-teal-100"
                >
                  {c.pricing.payg.ctaLabel}
                </a>
              </div>
            </div>
          </Reveal>
        </div>

        {c.pricing.footnote && (
          <p className="t-small mt-8 max-w-[65ch] text-gray-600">{c.pricing.footnote}</p>
        )}
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
