"use client";

import { useEffect, useState } from "react";
import { HEADLINES, SUBHEADLINE, type HeadlineVariant } from "@/lib/content";
import { resolveVariant } from "@/lib/attribution";
import { CtaButton } from "./ui";

export default function Hero() {
  // Render A on the server and on first paint, then swap to the visitor's
  // persisted variant — avoids a hydration mismatch and a headline flash.
  const [variant, setVariant] = useState<HeadlineVariant>("A");
  const [hasPhoto, setHasPhoto] = useState(true);

  useEffect(() => setVariant(resolveVariant()), []);

  return (
    <header className="bg-sampaguita px-5 pb-16 pt-8 md:pb-24 md:pt-12">
      <div className="mx-auto w-full max-w-[1120px]">
        <p className="t-h3 mb-10 md:mb-14" style={{ color: "var(--color-teal-700)" }}>
          SynergyCare
        </p>

        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
          <div className="max-w-[720px]">
            <h1 className="t-display text-ink">{HEADLINES[variant]}</h1>

            <p className="t-body-lg mt-5 text-ink">{SUBHEADLINE}</p>

            <div className="mt-8">
              <CtaButton href="#eoi-form">Register your interest</CtaButton>
              <p className="t-small mt-3 text-gray-600">
                Free to register · Founding families get priority access and
                founding pricing
              </p>
            </div>
          </div>

          <div className="order-first md:order-last">
            {hasPhoto ? (
              /* Replace /public/hero.webp with the real photo: an adult child on
                 a video call with a parent — warm, natural light (§8). */
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src="/hero.webp"
                alt="A daughter in New Zealand on a video call with her mother in the Philippines, both smiling."
                width={1000}
                height={800}
                className="aspect-[5/4] w-full rounded-[16px] object-cover"
                style={{ boxShadow: "var(--shadow-soft)" }}
                onError={() => setHasPhoto(false)}
              />
            ) : (
              <PhotoPlaceholder />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

/** Shown until a real photo is dropped at /public/hero.webp. */
function PhotoPlaceholder() {
  return (
    <div
      aria-hidden="true"
      className="flex aspect-[5/4] w-full items-end rounded-[16px] p-6"
      style={{
        background:
          "linear-gradient(150deg, var(--color-teal-100) 0%, #F6E6D8 55%, #F9D9A8 100%)",
        boxShadow: "var(--shadow-soft)",
      }}
    >
      <p className="t-small max-w-[36ch] text-gray-600">
        Add <code>public/hero.webp</code> — an adult child on a video call with
        a parent. Warm, real, natural light.
      </p>
    </div>
  );
}
