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
  const [healthRes, itemsRes, pageRes] = await Promise.all([
    fetch(`${baseUrl}/api/health`),
    fetch(`${baseUrl}/api/opportunities`),
    fetch(baseUrl)
  ]);
  const health = await healthRes.json();
  const items = await itemsRes.json();
  const html = await pageRes.text();

  if (!health.ok) throw new Error("health failed");
  if (!Array.isArray(items.items) || items.items.length < 5) throw new Error("opportunity rows missing");
  if (!html.includes("Revenue Intake Ledger")) throw new Error("landing dashboard missing title");
  if (!html.includes("小さなAIチーム")) throw new Error("Japanese guidance missing");
  if (!html.includes("DynamoDB")) throw new Error("database boundary missing");

  console.log(`revenue_intake_ledger_verify_ok rows=${items.items.length} source=${items.source}`);
} finally {
  server.kill("SIGTERM");
  setTimeout(() => server.kill("SIGKILL"), 1500).unref();
  if (process.env.VERIFY_DEBUG_LOGS === "1") console.log(logs);
}
