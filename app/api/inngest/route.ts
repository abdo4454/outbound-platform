import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest";
import { syncAllCampaigns, syncOrgManual } from "@/lib/inngest/sync-campaigns";
import { nurtureNewLead } from "@/lib/inngest/lead-nurture";
import { enrichLead } from "@/lib/inngest/enrich-lead";
import { syncAllContacts, syncContactsOnConnect } from "@/lib/inngest/sync-contacts";
import { generateWeeklyReports, generateOrgReportManual } from "@/lib/inngest/weekly-reports";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    // Campaign sync
    syncAllCampaigns,
    syncOrgManual,
    // Lead automation
    nurtureNewLead,
    enrichLead,
    // Contact sync
    syncAllContacts,
    syncContactsOnConnect,
    // Reports
    generateWeeklyReports,
    generateOrgReportManual,
  ],
});
