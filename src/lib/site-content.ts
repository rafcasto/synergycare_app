import "server-only";
import { FieldValue } from "firebase-admin/firestore";
import { db } from "./firebase-admin";
import { DEFAULT_CONTENT, type SiteContent } from "./content";

const DOC = "site_content/landing";

/**
 * Deep-merge stored overrides over the defaults. Only plain objects merge —
 * arrays replace wholesale, because an edited FAQ list of four items must not
 * inherit a fifth from the defaults.
 */
function merge<T>(base: T, override: unknown): T {
  if (override === null || override === undefined) return base;
  if (Array.isArray(base)) return (Array.isArray(override) ? override : base) as T;
  if (typeof base !== "object") return (typeof override === typeof base ? override : base) as T;

  const out = { ...(base as Record<string, unknown>) };
  const src = override as Record<string, unknown>;
  for (const key of Object.keys(out)) {
    if (key in src) out[key] = merge(out[key], src[key]);
  }
  return out as T;
}

export type ResolvedContent = SiteContent & {
  heroImage: { url: string; version: string } | null;
};

/**
 * Never throws. If Firestore is unreachable the page still renders with the
 * launch copy — a broken CMS must not take the landing page down mid-campaign.
 */
export async function getSiteContent(): Promise<ResolvedContent> {
  try {
    const snap = await db().doc(DOC).get();
    const data = snap.exists ? snap.data() : null;
    const content = merge(DEFAULT_CONTENT, data?.content);

    const heroVersion = typeof data?.hero_image_version === "string" ? data.hero_image_version : null;

    return {
      ...content,
      heroImage: heroVersion ? { url: `/api/media/hero?v=${heroVersion}`, version: heroVersion } : null,
    };
  } catch (error) {
    console.error("[site-content] read failed, serving defaults:", error);
    return { ...DEFAULT_CONTENT, heroImage: null };
  }
}

export async function saveSiteContent(content: SiteContent, editorEmail: string) {
  await db().doc(DOC).set(
    {
      content,
      updated_at: FieldValue.serverTimestamp(),
      updated_by: editorEmail,
    },
    { merge: true }
  );
}

export async function getContentMeta() {
  try {
    const snap = await db().doc(DOC).get();
    const data = snap.data();
    return {
      updatedAt: data?.updated_at?.toDate?.()?.toISOString() ?? null,
      updatedBy: (data?.updated_by as string) ?? null,
    };
  } catch {
    return { updatedAt: null, updatedBy: null };
  }
}
