import { NextResponse } from "next/server";
import { getLedgerHealth, h0ProofRequirements, summarizeLedger } from "../../../lib/revenue-data";

export function GET() {
  const health = getLedgerHealth();

  return NextResponse.json({
    ok: true,
    h0Ready: health.database === "dynamodb" && h0ProofRequirements.every((item) => item.status === "done"),
    health,
    requirements: h0ProofRequirements,
    metrics: summarizeLedger()
  });
}
