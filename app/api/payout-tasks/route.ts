import { NextResponse } from "next/server";
import { listPayoutTasks } from "../../../lib/dynamodb";
import { getLedgerHealth } from "../../../lib/revenue-data";

export async function GET() {
  const result = await listPayoutTasks();

  return NextResponse.json({
    ok: true,
    source: result.source,
    health: getLedgerHealth(),
    items: result.items
  });
}
