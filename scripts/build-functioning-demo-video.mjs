import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import http from "node:http";
import { chromium } from "playwright";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT = path.join(ROOT, "media", "tmp", "h0-functioning-demo");
const LIVE_URL = "https://revenue-intake-ledger-public.vercel.app";

mkdirSync(OUT, { recursive: true });

const narration = `Revenue Intake Ledger is a working H zero app for small AI builders and SaaS teams.

The problem is the work after shipping. Teams need to track what was submitted, what proof exists, what result date matters, what payout paperwork is missing, and whether cloud usage is still safe.

This is the live Vercel app, not a mockup. The top proof card shows production connected to DynamoDB, and the first screen explains the target user, the problem, the AI use, and the business value.

Now the operating table is visible. Each lane has a product, program, audience, problem, next action, award date, prize range, risk, and an AI suggestion. The H zero lane is tracked alongside other revenue opportunities so follow-up work does not get lost.

The proof board shows the H zero submission evidence. It records the Vercel URL, the Vercel team ID, live DynamoDB source, AWS storage proof, the demo video, and final Devpost submission state.

The DynamoDB query proof is the core of the build. One key, opportunity H zero, loads the opportunity profile, evidence records, payout tasks, and status history. The database is the product memory.

Here is the public health endpoint. It reports database equals dynamodb and table name Revenue Intake Ledger.

Here is the H zero bundle endpoint. It returns the DynamoDB source, key condition, opportunity record, evidence count, payout tasks, and status history.

Here is the open action queue endpoint. It shows the follow-up work that still needs monitoring, including result checks, payout steps, and AWS usage watch items.

So the project is functioning: a Vercel app, backed by AWS DynamoDB, with public proof routes and a practical follow-up workflow. It helps a small team protect future revenue after the build is submitted.`;

writeFileSync(path.join(OUT, "narration.txt"), narration);

function launchOptions() {
  const candidates = [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser",
    "/Applications/Chromium.app/Contents/MacOS/Chromium"
  ];
  const executablePath = candidates.find((candidate) => existsSync(candidate));
  return executablePath ? { headless: true, executablePath } : { headless: true };
}

function run(command, args) {
  execFileSync(command, args, { stdio: "inherit" });
}

async function serveCaptionPage() {
  const server = http.createServer((req, res) => {
    const url = new URL(req.url || "/", "http://localhost");
    const copy = {
      "/intro": ["Live H0 Demo", "Revenue Intake Ledger on Vercel, backed by AWS DynamoDB"],
      "/table": ["Operating Table", "Every submitted opportunity keeps proof, next action, risk, and AI suggestion visible"],
      "/proof": ["H0 Proof Board", "Vercel URL, Team ID, DynamoDB source, AWS proof, demo video, and final Devpost state"],
      "/query": ["DynamoDB Query Proof", "PK = OPPORTUNITY#h0 loads the profile, evidence, payout tasks, and status history"],
      "/api": ["Public API Proof", "Health, H0 bundle, and action queue return live DynamoDB-backed data"],
      "/done": ["Functioning Product", "A practical revenue follow-up room for small AI builders and SaaS teams"]
    }[url.pathname] || ["Revenue Intake Ledger", "Live H0 functioning demo"];
    res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    res.end(`<!doctype html>
<html><head><meta charset="utf-8"><style>
body{margin:0;width:1440px;height:1080px;background:#f4f8f9;color:#162329;font-family:Arial,Helvetica,sans-serif}
main{height:100%;display:grid;place-items:center;padding:80px}
section{width:1120px;border:1px solid #d4e2e5;border-radius:12px;background:white;padding:70px;box-shadow:0 20px 55px rgba(22,35,41,.12)}
p.eyebrow{margin:0 0 22px;color:#0d6b78;font-weight:800;font-size:34px;text-transform:uppercase}
h1{margin:0 0 28px;font-size:88px;line-height:1;letter-spacing:0}
p.body{margin:0;color:#52646c;font-size:42px;line-height:1.35}
</style></head><body><main><section><p class="eyebrow">${copy[0]}</p><h1>${copy[0]}</h1><p class="body">${copy[1]}</p></section></main></body></html>`);
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  return { server, base: `http://127.0.0.1:${server.address().port}` };
}

async function recordVideo() {
  const videoDir = path.join(OUT, "raw");
  rmSync(videoDir, { recursive: true, force: true });
  mkdirSync(videoDir, { recursive: true });
  const { server, base } = await serveCaptionPage();
  const browser = await chromium.launch(launchOptions());
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1080 },
    recordVideo: { dir: videoDir, size: { width: 1440, height: 1080 } }
  });
  const page = await context.newPage();

  await page.goto(`${base}/intro`, { waitUntil: "networkidle" });
  await page.waitForTimeout(6500);
  await page.goto(LIVE_URL, { waitUntil: "networkidle" });
  await page.waitForTimeout(12000);
  await page.locator(".workbench").first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(13500);
  await page.goto(`${base}/table`, { waitUntil: "networkidle" });
  await page.waitForTimeout(4500);
  await page.goto(LIVE_URL, { waitUntil: "networkidle" });
  await page.locator(".proof-board").first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(13000);
  await page.goto(`${base}/proof`, { waitUntil: "networkidle" });
  await page.waitForTimeout(4500);
  await page.goto(LIVE_URL, { waitUntil: "networkidle" });
  await page.locator(".query-proof").first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(13000);
  await page.goto(`${base}/query`, { waitUntil: "networkidle" });
  await page.waitForTimeout(4500);
  await page.goto(`${LIVE_URL}/api/health`, { waitUntil: "networkidle" });
  await page.waitForTimeout(7000);
  await page.goto(`${LIVE_URL}/api/h0-bundle`, { waitUntil: "networkidle" });
  await page.waitForTimeout(10000);
  await page.goto(`${LIVE_URL}/api/action-queue`, { waitUntil: "networkidle" });
  await page.waitForTimeout(8000);
  await page.goto(`${base}/done`, { waitUntil: "networkidle" });
  await page.waitForTimeout(6500);

  const video = page.video();
  await context.close();
  await browser.close();
  server.close();
  const rawPath = await video.path();
  return rawPath;
}

async function main() {
  const raw = await recordVideo();
  const aiff = path.join(OUT, "narration.aiff");
  const audio = path.join(OUT, "narration.m4a");
  const video = path.join(OUT, "revenue-intake-ledger-h0-functioning-demo.mp4");
  const thumbnail = path.join(OUT, "revenue-intake-ledger-h0-functioning-thumb.png");

  run("say", ["-v", "Samantha", "-r", "150", "-o", aiff, "-f", path.join(OUT, "narration.txt")]);
  run("ffmpeg", ["-y", "-i", aiff, "-c:a", "aac", "-b:a", "160k", audio]);
  run("ffmpeg", [
    "-y",
    "-i", raw,
    "-i", audio,
    "-filter:v", "tpad=stop_mode=clone:stop_duration=6",
    "-map", "0:v:0",
    "-map", "1:a:0",
    "-c:v", "libx264",
    "-pix_fmt", "yuv420p",
    "-preset", "veryfast",
    "-crf", "23",
    "-c:a", "aac",
    "-b:a", "160k",
    "-shortest",
    "-movflags", "+faststart",
    video
  ]);
  run("ffmpeg", ["-y", "-ss", "00:00:20", "-i", video, "-frames:v", "1", "-q:v", "3", thumbnail]);

  console.log("h0_functioning_demo_video_ok");
  console.log(`video=${video}`);
  console.log(`thumbnail=${thumbnail}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
