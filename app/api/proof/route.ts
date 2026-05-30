import { NextResponse } from "next/server";
import {
  listEvidenceItems,
  listOpenActionQueue,
  listOpportunities,
  listPayoutTasks,
  listStatusEvents
} from "../../../lib/dynamodb";
import { getLedgerHealth, h0ProofRequirements, summarizeLedgerItems } from "../../../lib/revenue-data";

export async function GET() {
  const health = getLedgerHealth();
  const [opportunityResult, evidenceResult, payoutTaskResult, statusEventResult, actionQueueResult] = await Promise.all([
    listOpportunities(),
    listEvidenceItems(),
    listPayoutTasks(),
    listStatusEvents(),
    listOpenActionQueue()
  ]);

  return NextResponse.json({
    ok: true,
    h0Ready: health.database === "dynamodb" && h0ProofRequirements.every((item) => item.status === "done"),
    health,
    requirements: h0ProofRequirements,
    metrics: summarizeLedgerItems(
      opportunityResult.items,
      evidenceResult.items,
      payoutTaskResult.items,
      statusEventResult.items
    ),
    sources: {
      opportunities: opportunityResult.source,
      evidence: evidenceResult.source,
      payoutTasks: payoutTaskResult.source,
      statusEvents: statusEventResult.source,
      actionQueue: actionQueueResult.source
    },
    workQueueProof: {
      accessPath: actionQueueResult.accessPath,
      keyCondition: actionQueueResult.keyCondition,
      openActions: actionQueueResult.items.length
    }
  });
}
