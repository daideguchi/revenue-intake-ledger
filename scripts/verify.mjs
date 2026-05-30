import { spawn } from "node:child_process";

const port = Number(process.env.PORT || 4137);
const baseUrl = `http://127.0.0.1:${port}`;

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForServer() {
  for (let i = 0; i < 40; i += 1) {
    try {
      const res = await fetch(`${baseUrl}/api/health`);
      if (res.ok) return;
    } catch {
      await wait(500);
    }
  }
  throw new Error("server did not become ready");
}

const server = spawn("npm", ["run", "dev", "--", "-p", String(port), "-H", "127.0.0.1"], {
  stdio: ["ignore", "pipe", "pipe"],
  env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" }
});

let logs = "";
server.stdout.on("data", (chunk) => {
  logs += chunk.toString();
});
server.stderr.on("data", (chunk) => {
  logs += chunk.toString();
});

try {
  await waitForServer();
  const [healthRes, itemsRes, bundleRes, actionQueueRes, proofRes, pageRes] = await Promise.all([
    fetch(`${baseUrl}/api/health`),
    fetch(`${baseUrl}/api/opportunities`),
    fetch(`${baseUrl}/api/h0-bundle`),
    fetch(`${baseUrl}/api/action-queue`),
    fetch(`${baseUrl}/api/proof`),
    fetch(baseUrl)
  ]);
  const health = await healthRes.json();
  const items = await itemsRes.json();
  const bundle = await bundleRes.json();
  const actionQueue = await actionQueueRes.json();
  const proof = await proofRes.json();
  const html = await pageRes.text();

  if (!health.ok) throw new Error("health failed");
  if (!Array.isArray(items.items) || items.items.length < 5) throw new Error("opportunity rows missing");
  if (!bundle.ok || bundle.query.keyCondition !== "PK = OPPORTUNITY#h0") throw new Error("h0 bundle query proof missing");
  if ((bundle.counts.evidence || 0) < 3) throw new Error("h0 evidence bundle too thin");
  if (!actionQueue.ok || actionQueue.query.keyCondition !== "PK = WORK_QUEUE#open") {
    throw new Error("action queue access proof missing");
  }
  if ((actionQueue.counts.openActions || 0) < 2) throw new Error("action queue is too thin");
  if (!proof.ok || !proof.metrics || proof.metrics.statusEvents < 1) throw new Error("proof metrics missing status history");
  if (!proof.workQueueProof || proof.workQueueProof.keyCondition !== "PK = WORK_QUEUE#open") {
    throw new Error("proof work queue access pattern missing");
  }
  if (!html.includes("Revenue Intake Ledger")) throw new Error("landing dashboard missing title");
  if (!html.includes("小さなAIチーム")) throw new Error("Japanese guidance missing");
  if (!html.includes("DynamoDB")) throw new Error("database boundary missing");
  if (!html.includes("Single-table query proof")) throw new Error("single-table query proof missing");
  if (!html.includes("OPPORTUNITY#h0")) throw new Error("DynamoDB key proof missing");
  if (!html.includes("AWS credit use")) throw new Error("AWS credit use section missing");
  if (!html.includes("PK = WORK_QUEUE#open")) throw new Error("work queue proof missing");

  console.log(`revenue_intake_ledger_verify_ok rows=${items.items.length} source=${items.source}`);
} finally {
  server.kill("SIGTERM");
  setTimeout(() => server.kill("SIGKILL"), 1500).unref();
  if (process.env.VERIFY_DEBUG_LOGS === "1") console.log(logs);
}
