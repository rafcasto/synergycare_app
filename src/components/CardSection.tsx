import type { SiteContent } from "@/lib/content";

/**
 * "Get your cross-border healthcare" section: headline, membership card,
 * tagline. The card artwork ships in /public/card.webp and can be replaced
 * from /admin/media without a deploy — the uploaded version wins when present.
 */
export default function CardSection({
  card,
  image,
}: {
  card: SiteContent["card"];
  image: { url: string; version: string } | null;
}) {
  const src = image?.url ?? "/card.webp";

  return (
    <div className="relative overflow-hidden">
      {/* Soft organic shapes echoing the campaign artwork — decorative only. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 hidden h-[320px] w-[260px] rounded-[48%_52%_40%_60%/55%_45%_55%_45%] md:block"
        style={{ background: "var(--color-teal-700)", opacity: 0.9 }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -left-24 h-[280px] w-[420px] rounded-[60%_40%_55%_45%/50%_60%_40%_50%]"
        style={{ background: "var(--color-teal-100)" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[14%] top-[48%] hidden h-24 w-24 rounded-full md:block"
        style={{ background: "var(--color-teal-100)" }}
      />

      <div className="relative">
        <h2
          className="t-h2 mx-auto max-w-[22ch] text-center"
          style={{ color: "var(--color-teal-700)" }}
        >
          {card.title}
        </h2>

        <div className="mx-auto mt-10 max-w-[720px] md:mt-12">
          {/* Plain <img>: the file is static, already WebP, and the upload path
              needs a cache-busting query string rather than next/image. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={card.imageAlt}
            width={892}
            height={527}
            loading="lazy"
            className="w-full rounded-[16px]"
            style={{ boxShadow: "0 24px 48px rgba(11, 93, 84, 0.22)" }}
          />
        </div>

        <p
          className="t-body-lg mx-auto mt-10 max-w-[34ch] text-center italic md:ml-auto md:mr-0 md:max-w-[40ch] md:text-right"
          style={{ color: "var(--color-teal-700)", fontFamily: "var(--font-head)", fontWeight: 500 }}
        >
          {card.tagline}
        </p>
      </div>
    </div>
  );
}
