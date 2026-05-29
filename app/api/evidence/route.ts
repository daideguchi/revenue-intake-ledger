import { NextResponse } from "next/server";
import { listEvidenceItems } from "../../../lib/dynamodb";
import { getLedgerHealth } from "../../../lib/revenue-data";

export async function GET() {
  const result = await listEvidenceItems();

  return NextResponse.json({
    ok: true,
    source: result.source,
    health: getLedgerHealth(),
    items: result.items
  });
}
