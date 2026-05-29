import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT = path.join(ROOT, "media", "tmp", "h0-demo");
const LIVE_URL = "https://revenue-intake-ledger-public.vercel.app";
const DYNAMODB_SCREENSHOT =
  "/Users/dd/000_AI組織/__hackason/12_revenue_hackathon_batch/evidence/20260529T202031Z_dynamodb_table_redacted.png";

mkdirSync(OUT, { recursive: true });

function launchOptions() {
  const candidates = [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser",
    "/Applications/Chromium.app/Contents/MacOS/Chromium"
  ];
  const executablePath = candidates.find((candidate) => existsSync(candidate));
  return executablePath ? { headless: true, executablePath } : { headless: true };
}

const narration = `Revenue Intake Ledger is a revenue operations room for small AI builders and SaaS teams.

The problem is simple. Shipping a project is not the end of the work. After a hackathon or sales sprint, teams still need to track what was actually submitted, what proof exists, when winners are announced, which payout forms are missing, and when money or credits may arrive. That follow-up work is where revenue gets lost.

This product turns that scattered follow-up into one durable ledger. The first screen tells a judge the full story in thirty seconds: who it helps, what pain it solves, how it works, and why it fits H0. The key point is that the database is not decorative. The database is the product memory.

Here is the live public app on Vercel. The green status card shows that production is connected to DynamoDB. The operating table is reading from dynamodb colon Revenue Intake Ledger, not from a local preview file.

Each revenue lane stores the product, the program, the audience, the problem, the next action, the award date, prize range, AI suggestion, and risk. For example, the H0 lane says the AWS credit is applied, DynamoDB is live, and the next action is to record the three to five minute demo and finish Devpost. The app is intentionally honest: registered does not mean submitted.

The H0 proof board is the final gate. It shows Devpost registration, AWS credit applied, published Vercel URL, Vercel Team ID, live DynamoDB source, the AWS storage screenshot, and the demo video. The only remaining boundary is the final Devpost submitted state.

The API proof is public and machine-readable. The health endpoint reports database equals dynamodb. The opportunities, evidence, and payout task endpoints report source equals dynamodb colon Revenue Intake Ledger. The proof endpoint still returns h0Ready false because the final Devpost submit has not happened yet. That is the safety boundary.

On AWS, the table Revenue Intake Ledger exists in DynamoDB and contains the seeded operating records. The runtime access is scoped to a dedicated IAM user with a DynamoDB-only policy. A warning budget exists, and the setup stays deliberately small because the promotional credit is useful, but it is not a hard spending cap.

So the value is practical. Revenue Intake Ledger helps a small team keep proof, deadlines, payout tasks, and AI recommendations in one place. For H0, it demonstrates a real Vercel app backed by AWS DynamoDB. For builders, it turns the messy after-shipping work into a system that protects future revenue.

This is also the story behind the product. A small team can build many things, but revenue only becomes real when proof, follow-up, and payment work are handled carefully. Revenue Intake Ledger is designed to make that careful work visible, repeatable, and less dependent on memory.`;

writeFileSync(path.join(OUT, "narration.txt"), narration);

function run(command, args, options = {}) {
  execFileSync(command, args, { stdio: "inherit", ...options });
}

function imageDataUri(filePath) {
  const buf = readFileSync(filePath);
  const ext = path.extname(filePath).slice(1) || "png";
  return `data:image/${ext};base64,${buf.toString("base64")}`;
}

async function captureAppScreenshots() {
  const browser = await chromium.launch(launchOptions());
  const page = await browser.newPage({ viewport: { width: 1440, height: 960 }, deviceScaleFactor: 1 });

  await page.goto(LIVE_URL, { waitUntil: "networkidle" });
  await page.screenshot({ path: path.join(OUT, "capture-01-home.png") });

  await page.locator(".workbench").scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(OUT, "capture-02-workbench.png") });

  await page.locator(".proof-board").scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(OUT, "capture-03-proof-board.png") });

  await page.goto(`${LIVE_URL}/api/proof`, { waitUntil: "networkidle" });
  await page.screenshot({ path: path.join(OUT, "capture-04-api-proof.png") });

  await browser.close();
}

function slideHtml({ eyebrow, title, body, bullets = [], image, code, accent = "teal" }) {
  const imageMarkup = image
    ? `<div class="visual"><img src="${imageDataUri(image)}" /></div>`
    : code
      ? `<pre class="code">${code}</pre>`
      : "";
  const bulletMarkup = bullets.map((item) => `<li>${item}</li>`).join("");

  return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<style>
  * { box-sizing: border-box; }
  body {
    width: 1920px;
    height: 1080px;
    margin: 0;
    background: #f4f8f9;
    color: #172126;
    font-family: Arial, Helvetica, sans-serif;
  }
  .slide {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: 610px 1fr;
    gap: 36px;
    padding: 70px;
  }
  .copy {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .eyebrow {
    color: ${accent === "green" ? "#1d7b4f" : "#0d6b78"};
    font-size: 26px;
    font-weight: 800;
    letter-spacing: 0;
    text-transform: uppercase;
    margin-bottom: 22px;
  }
  h1 {
    margin: 0 0 26px;
    font-size: 76px;
    line-height: 0.98;
    letter-spacing: 0;
  }
  p {
    margin: 0 0 24px;
    color: #485760;
    font-size: 32px;
    line-height: 1.42;
  }
  ul {
    margin: 8px 0 0;
    padding: 0;
    list-style: none;
  }
  li {
    margin: 0 0 16px;
    padding: 18px 20px;
    border: 1px solid #d6e1e5;
    border-radius: 8px;
    background: white;
    color: #27343a;
    font-size: 28px;
    line-height: 1.25;
  }
  .visual, .code {
    align-self: center;
    width: 100%;
    height: 900px;
    border: 1px solid #d6e1e5;
    border-radius: 12px;
    background: white;
    box-shadow: 0 18px 42px rgba(23, 33, 38, 0.12);
    overflow: hidden;
  }
  .visual img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top left;
  }
  .code {
    margin: 0;
    padding: 42px;
    color: #17333a;
    font-size: 34px;
    line-height: 1.36;
    white-space: pre-wrap;
  }
  .brand {
    position: absolute;
    left: 70px;
    bottom: 44px;
    color: #78909a;
    font-size: 24px;
  }
</style>
</head>
<body>
  <section class="slide">
    <div class="copy">
      <div class="eyebrow">${eyebrow}</div>
      <h1>${title}</h1>
      <p>${body}</p>
      <ul>${bulletMarkup}</ul>
    </div>
    ${imageMarkup}
  </section>
  <div class="brand">Revenue Intake Ledger · H0: Hack the Zero Stack</div>
</body>
</html>`;
}

async function renderSlides() {
  const browser = await chromium.launch(launchOptions());
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  const slides = [
    {
      eyebrow: "Problem",
      title: "Revenue gets lost after shipping.",
      body: "Small AI teams submit fast, then lose track of proof, deadlines, paperwork, and payout follow-up.",
      bullets: ["Submitted is not the same as paid.", "Proof is scattered across apps.", "Winner dates and payout tasks need one durable home."],
      image: path.join(OUT, "capture-01-home.png")
    },
    {
      eyebrow: "Live App",
      title: "One ledger for revenue follow-up.",
      body: "The first screen explains who it helps, what hurts, and why the database is the product memory.",
      bullets: ["Vercel public app", "DynamoDB connected", "Japanese-friendly product framing"],
      image: path.join(OUT, "capture-01-home.png"),
      accent: "green"
    },
    {
      eyebrow: "Workflow",
      title: "Every lane has a next action.",
      body: "Each record stores product context, prize timing, risk, evidence, and an AI suggestion.",
      bullets: ["Opportunities", "Evidence items", "Payout tasks", "Status boundary"],
      image: path.join(OUT, "capture-02-workbench.png")
    },
    {
      eyebrow: "H0 Proof",
      title: "Ready means the database is real.",
      body: "The proof board keeps the submission honest and blocks final submit until the required evidence exists.",
      bullets: ["AWS credit applied", "Live DynamoDB source", "Storage screenshot captured", "Final Devpost submit is the last gate"],
      image: path.join(OUT, "capture-03-proof-board.png"),
      accent: "green"
    },
    {
      eyebrow: "Public API",
      title: "Machine-readable proof.",
      body: "The deployed API reports DynamoDB as the source of truth, while h0Ready stays false until Devpost is actually submitted.",
      code: `/api/health -> database=dynamodb
/api/opportunities -> source=dynamodb:RevenueIntakeLedger
/api/evidence -> source=dynamodb:RevenueIntakeLedger
/api/payout-tasks -> source=dynamodb:RevenueIntakeLedger
/api/proof -> h0Ready=false until final Devpost submit`
    },
    {
      eyebrow: "AWS Storage",
      title: "Real DynamoDB, small cost footprint.",
      body: "The table stores the operating records. Access is scoped to a dedicated DynamoDB-only runtime user.",
      bullets: ["RevenueIntakeLedger table", "14 seeded records", "On-demand billing", "Budget warning guardrail"],
      image: DYNAMODB_SCREENSHOT
    },
    {
      eyebrow: "Architecture",
      title: "The database is the product memory.",
      body: "Vercel renders the app and API. DynamoDB stores opportunities, evidence records, payout tasks, and status proof.",
      code: `Vercel / Next.js app
  -> /api/health
  -> /api/opportunities
  -> /api/evidence
  -> /api/payout-tasks
  -> /api/proof

AWS DynamoDB
  -> OPPORTUNITY#<id> / PROFILE
  -> OPPORTUNITY#<id> / EVIDENCE#<id>
  -> OPPORTUNITY#<id> / PAYOUT#<id>`
    },
    {
      eyebrow: "Outcome",
      title: "A practical tool for teams that want to get paid.",
      body: "Revenue Intake Ledger turns messy after-shipping work into a durable operating system for proof, deadlines, and payout follow-up.",
      bullets: ["Who: small AI builders and SaaS teams", "Pain: proof and payout work is scattered", "How: Vercel app backed by DynamoDB", "Value: fewer missed deadlines and cleaner revenue follow-up"],
      image: path.join(OUT, "capture-01-home.png"),
      accent: "green"
    }
  ];

  for (const [index, slide] of slides.entries()) {
    await page.setContent(slideHtml(slide), { waitUntil: "networkidle" });
    await page.screenshot({ path: path.join(OUT, `slide-${String(index + 1).padStart(2, "0")}.png`) });
  }
  await browser.close();
  return slides.length;
}

function secondsOf(filePath) {
  const value = execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "default=nw=1:nk=1", filePath], {
    encoding: "utf8"
  });
  return Number.parseFloat(value.trim());
}

async function main() {
  await captureAppScreenshots();
  const slideCount = await renderSlides();

  const aiff = path.join(OUT, "narration.aiff");
  const audio = path.join(OUT, "narration.m4a");
  run("say", ["-v", "Samantha", "-r", "136", "-o", aiff, "-f", path.join(OUT, "narration.txt")]);
  run("ffmpeg", ["-y", "-i", aiff, "-c:a", "aac", "-b:a", "160k", audio]);

  const duration = secondsOf(audio);
  const perSlide = Math.max(10, duration / slideCount);
  const concat = [];
  for (let i = 1; i <= slideCount; i += 1) {
    concat.push(`file '${path.join(OUT, `slide-${String(i).padStart(2, "0")}.png`).replaceAll("'", "'\\''")}'`);
    concat.push(`duration ${perSlide.toFixed(3)}`);
  }
  concat.push(`file '${path.join(OUT, `slide-${String(slideCount).padStart(2, "0")}.png`).replaceAll("'", "'\\''")}'`);
  writeFileSync(path.join(OUT, "slides.concat.txt"), `${concat.join("\n")}\n`);

  const video = path.join(OUT, "revenue-intake-ledger-h0-demo.mp4");
  run("ffmpeg", [
    "-y",
    "-f",
    "concat",
    "-safe",
    "0",
    "-i",
    path.join(OUT, "slides.concat.txt"),
    "-i",
    audio,
    "-c:v",
    "libx264",
    "-pix_fmt",
    "yuv420p",
    "-r",
    "30",
    "-c:a",
    "aac",
    "-shortest",
    "-movflags",
    "+faststart",
    video
  ]);

  console.log(`h0_demo_video=${video}`);
  console.log(`audio_seconds=${duration.toFixed(2)}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
