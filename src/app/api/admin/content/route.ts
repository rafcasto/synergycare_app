import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminApi } from "@/lib/admin-auth";
import { saveSiteContent } from "@/lib/site-content";
import { DEFAULT_CONTENT, type SiteContent } from "@/lib/content";

export const runtime = "nodejs";

/**
 * Coerce the submitted payload into exactly the shape of DEFAULT_CONTENT.
 * Unknown keys are dropped and missing keys fall back, so a stale or hand-
 * crafted request can never write a shape the landing page cannot render.
 */
function coerce(base: unknown, input: unknown): unknown {
  if (typeof base === "string") return typeof input === "string" ? input : base;

  if (Array.isArray(base)) {
    if (!Array.isArray(input)) return base;
    const template = base[0];
    if (typeof template === "string") {
      return input.filter((v): v is string => typeof v === "string");
    }
    return input.map((item) => coerce(template, item));
  }

  if (base && typeof base === "object") {
    const out: Record<string, unknown> = {};
    const src = (input ?? {}) as Record<string, unknown>;
    for (const [key, value] of Object.entries(base)) out[key] = coerce(value, src[key]);
    return out;
  }

  return base;
}

export async function PUT(request: Request) {
  const admin = await requireAdminApi();
  if (!admin) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const content = coerce(DEFAULT_CONTENT, body) as SiteContent;

  try {
    await saveSiteContent(content, admin.email);
    // Push the new copy live immediately rather than waiting for the ISR window.
    revalidatePath("/");
    revalidatePath("/admin/content");
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[admin/content] save failed:", error);
    return NextResponse.json({ error: "Could not save. Please try again." }, { status: 500 });
  }
}
