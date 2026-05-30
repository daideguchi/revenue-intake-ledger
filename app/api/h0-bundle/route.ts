import { NextResponse } from "next/server";
import { getOpportunityBundle } from "../../../lib/dynamodb";
import { getLedgerHealth } from "../../../lib/revenue-data";

export async function GET() {
  const bundle = await getOpportunityBundle("h0");

  return NextResponse.json({
    ok: true,
    health: getLedgerHealth(),
    query: {
      accessPattern: "Load one revenue lane with its profile, evidence, payout tasks, and status history",
      keyCondition: "PK = OPPORTUNITY#h0",
      source: bundle.source
    },
    bundle,
    counts: {
      evidence: bundle.evidence.length,
      payoutTasks: bundle.payoutTasks.length,
      statusEvents: bundle.statusEvents.length
    }
  });
}
