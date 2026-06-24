import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How Revenue Intake Ledger Uses AWS Databases After AI Shipping",
  description:
    "A H0 build note for Revenue Intake Ledger: who it helps, what it solves, how AI is used, and why DynamoDB is the product memory."
};

const proofLinks = [
  ["Live app", "/"],
  ["Devpost submission", "https://devpost.com/software/revenue-intake-ledger"],
  ["Demo video", "https://youtu.be/sGeT3OtkBks"],
  ["DynamoDB bundle", "/api/h0-bundle"],
  ["Proof route", "/api/proof"]
];

export default function H0BuildNotePage() {
  return (
    <main className="article-shell">
      <nav className="article-nav" aria-label="Article navigation">
        <Link href="/">Revenue Intake Ledger</Link>
        <a href="https://devpost.com/software/revenue-intake-ledger" target="_blank" rel="noreferrer">
          Devpost
        </a>
      </nav>

      <article className="build-note">
        <p className="eyebrow">#H0Hackathon build note</p>
        <h1>Revenue Intake Ledger: the database memory after an AI-built launch</h1>
        <p className="article-lead">
          AI can help a solo builder ship many small products quickly. The hard part starts after launch:
          proof links, result dates, cloud-cost checks, organizer messages, and payout paperwork scatter
          across tabs and inboxes. Revenue Intake Ledger turns that follow-up work into one saved operating
          board backed by DynamoDB.
        </p>

        <div className="article-links" aria-label="Proof links">
          {proofLinks.map(([label, href]) => {
            const external = href.startsWith("http");
            return (
              <a key={label} href={href} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined}>
                {label}
                <span aria-hidden="true">{external ? " ->" : " /"}</span>
              </a>
            );
          })}
        </div>

        <section>
          <h2>Who it is for</h2>
          <p>
            The target user is a solo builder or tiny team using AI agents to launch multiple hackathon,
            grant, or revenue experiments at once. They do not need another inspirational dashboard. They
            need a reliable record of what was submitted, what proof exists, when results arrive, and what
            financial follow-up remains open.
          </p>
        </section>

        <section>
          <h2>The problem</h2>
          <p>
            AI compresses the build cycle, but it does not automatically manage the business cycle. A
            shipped project can still lose value if the builder misses a result announcement, forgets a tax
            form, leaves a cloud resource running, or cannot prove what was actually submitted. Those are
            small operational misses, but they decide whether a project turns into real revenue.
          </p>
        </section>

        <section>
          <h2>How AI is used</h2>
          <p>
            AI agents help generate, verify, and summarize follow-up evidence. The important boundary is
            that AI does not become the source of truth. The database does. The app stores projects, proof
            items, payout tasks, status events, and AI suggestions so that a human reviewer can inspect the
            same saved facts the agents used.
          </p>
        </section>

        <section>
          <h2>Why DynamoDB matters</h2>
          <p>
            DynamoDB is not a decorative backend in this submission. It is the memory layer. One query for
            <code>PK = OPPORTUNITY#h0</code> returns the H0 project profile, proof items, payout tasks, and
            status history. A second access pattern, <code>PK = WORK_QUEUE#open</code>, returns the work that
            still needs attention. That makes the app a working checklist, not a static portfolio page.
          </p>
        </section>

        <section>
          <h2>What the demo proves</h2>
          <ul>
            <li>The public app is deployed on Vercel.</li>
            <li>The production API can read the live DynamoDB-backed H0 bundle.</li>
            <li>The UI separates submitted work, waiting work, proof records, and payout follow-up.</li>
            <li>The claim boundary stays honest: no fake revenue, no synthetic charts, no hidden paid services.</li>
          </ul>
        </section>

        <section className="article-callout">
          <h2>Why this can matter beyond one hackathon</h2>
          <p>
            As builders use more AI agents, the bottleneck moves from creation to accountability. The next
            useful product is often not another generator. It is the shared memory that keeps humans and
            agents aligned after the first version ships.
          </p>
        </section>
      </article>
    </main>
  );
}
