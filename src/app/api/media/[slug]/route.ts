import { NextResponse } from "next/server";
import { readMedia } from "@/lib/media-store";

export const runtime = "nodejs";

/**
 * Public image endpoint. URLs carry a ?v= content hash, so responses are
 * immutable and can be cached hard — a new upload produces a new URL.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const media = await readMedia(slug);
    if (!media) return new NextResponse("Not found", { status: 404 });

    return new NextResponse(new Uint8Array(media.buffer), {
      headers: {
        "Content-Type": media.contentType,
        "Content-Length": String(media.buffer.length),
        "Cache-Control": "public, max-age=31536000, immutable",
        ETag: `"${media.version}"`,
      },
    });
  } catch (error) {
    console.error("[media] read failed:", error);
    return new NextResponse("Not found", { status: 404 });
  }
}
