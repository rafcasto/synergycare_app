import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { Buffer } from "node:buffer";
import { requireAdminApi } from "@/lib/admin-auth";
import { deleteMedia, isMediaSlug, saveMedia } from "@/lib/media-store";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const admin = await requireAdminApi();
  if (!admin) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid upload." }, { status: 400 });
  }

  const slug = String(form.get("slug") ?? "");
  const file = form.get("file");

  if (!isMediaSlug(slug)) {
    return NextResponse.json({ error: "Unknown image slot." }, { status: 400 });
  }
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Please choose an image file." }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "That file isn't an image." }, { status: 400 });
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const media = await saveMedia(slug, buffer, admin.email);
    revalidatePath("/");
    revalidatePath("/admin/media");
    return NextResponse.json({ ok: true, media });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Upload failed. Please try again.";
    console.error("[admin/media] upload failed:", error);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const admin = await requireAdminApi();
  if (!admin) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const slug = new URL(request.url).searchParams.get("slug") ?? "";
  if (!isMediaSlug(slug)) {
    return NextResponse.json({ error: "Unknown image slot." }, { status: 400 });
  }

  await deleteMedia(slug);
  revalidatePath("/");
  revalidatePath("/admin/media");
  return NextResponse.json({ ok: true });
}
