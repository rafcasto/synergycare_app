import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy policy — SynergyCare",
  description: "How SynergyCare collects, uses, and protects your information.",
  robots: { index: false, follow: true },
};

const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "rafael@digitalpathways.io";

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-[720px] px-5 py-16 md:py-24">
      <a href="/" className="t-small text-teal-700 underline-offset-2 hover:underline">
        ← Back to SynergyCare
      </a>

      <h1 className="t-h2 mt-6 text-ink">Privacy policy</h1>
      <p className="t-small mt-2 text-gray-600">Last updated: 18 August 2026</p>

      <div className="mt-8 space-y-8">
        <section>
          <h2 className="t-h3 text-ink">What we collect</h2>
          <p className="t-body mt-2 text-gray-600">
            When you register your interest we collect your first name, email
            address, and — if you choose to give it — your mobile number. We also
            collect the answers you give in the registration questionnaire, and
            basic information about how you found the page (referring site and
            campaign tags).
          </p>
        </section>

        <section>
          <h2 className="t-h3 text-ink">Why we collect it</h2>
          <p className="t-body mt-2 text-gray-600">
            To contact you about SynergyCare, to understand what families need so
            we build the right service, and to decide where we launch first. That
            is the only purpose. We do not sell your information, and we do not
            share it with advertisers.
          </p>
        </section>

        <section>
          <h2 className="t-h3 text-ink">Where it is stored</h2>
          <p className="t-body mt-2 text-gray-600">
            Registrations are stored in Google Firebase (Firestore). Site
            analytics are collected in an aggregated, non-identifying form.
            Access is limited to the SynergyCare founder.
          </p>
        </section>

        <section>
          <h2 className="t-h3 text-ink">Your rights</h2>
          <p className="t-body mt-2 text-gray-600">
            Under the New Zealand Privacy Act 2020 you can ask us what we hold
            about you, ask us to correct it, and ask us to delete it. Email{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-teal-700 underline-offset-2 hover:underline"
            >
              {CONTACT_EMAIL}
            </a>{" "}
            and we will action it within 20 working days — usually much sooner.
          </p>
        </section>

        <section>
          <h2 className="t-h3 text-ink">Contact</h2>
          <p className="t-body mt-2 text-gray-600">
            SynergyCare, New Zealand.{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-teal-700 underline-offset-2 hover:underline"
            >
              {CONTACT_EMAIL}
            </a>
          </p>
        </section>
      </div>
    </main>
  );
}
