import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { listLeads, toCsv } from "@/lib/leads";

export const runtime = "nodejs";

/** CSV export of every registration, for interview prep and outreach. */
export async function GET() {
  const admin = await requireAdminApi();
  if (!admin) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const leads = await listLeads();
  const stamp = new Date().toISOString().slice(0, 10);

  return new NextResponse(toCsv(leads), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="synergycare-leads-${stamp}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
