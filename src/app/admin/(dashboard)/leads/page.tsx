import { listLeads } from "@/lib/leads";
import { Empty, PageHeading } from "@/components/admin/AdminUI";
import LeadsTable from "@/components/admin/LeadsTable";

export default async function LeadsPage() {
  const leads = await listLeads();

  return (
    <>
      <PageHeading
        title="Registrations"
        sub="Every answer, exactly as it was given. Filter, search, open a family to read their full questionnaire, or export the lot to CSV."
      />

      {leads.length === 0 ? (
        <Empty
          title="No registrations yet"
          body="When someone completes the form their answers appear here, graded A, B or C so you know who to call first."
        />
      ) : (
        <LeadsTable leads={leads} />
      )}
    </>
  );
}
