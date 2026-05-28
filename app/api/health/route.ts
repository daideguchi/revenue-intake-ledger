import { NextResponse } from "next/server";
import { getLedgerHealth } from "../../../lib/revenue-data";

export function GET() {
  return NextResponse.json({
    ok: true,
    product: "Revenue Intake Ledger",
    health: getLedgerHealth()
  });
}
