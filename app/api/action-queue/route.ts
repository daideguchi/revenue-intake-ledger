import { NextResponse } from "next/server";
import { listOpenActionQueue } from "../../../lib/dynamodb";
import { getLedgerHealth } from "../../../lib/revenue-data";

export async function GET() {
  const result = await listOpenActionQueue();

  return NextResponse.json({
    ok: true,
    health: getLedgerHealth(),
    query: {
      accessPattern: "Open result, payout, and AWS usage follow-up tasks",
      accessPath: result.accessPath,
      keyCondition: result.keyCondition,
      source: result.source
    },
    items: result.items,
    counts: {
      openActions: result.items.length
    }
  });
}
