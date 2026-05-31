import {
  getOpportunityBundle,
  listEvidenceItems,
  listOpenActionQueue,
  listOpportunities,
  listPayoutTasks,
  listStatusEvents
} from "../lib/dynamodb";
import { dynamoAccessPatterns, getLedgerHealth, h0ProofRequirements, summarizeLedgerItems } from "../lib/revenue-data";

const statusLabels = {
  submitted: "Submitted",
  watching: "Watching",
  registered: "Registered",
  blocked: "Blocked",
  proof_needed: "Proof needed"
};

export default async function Page() {
  const [opportunityResult, evidenceResult, payoutTaskResult, statusEventResult, actionQueue, h0Bundle, health] = await Promise.all([
    listOpportunities(),
    listEvidenceItems(),
    listPayoutTasks(),
    listStatusEvents(),
    listOpenActionQueue(),
    getOpportunityBundle("h0"),
    Promise.resolve(getLedgerHealth())
  ]);
  const { items, source } = opportunityResult;
  const summary = summarizeLedgerItems(
    items,
    evidenceResult.items,
    payoutTaskResult.items,
    statusEventResult.items
  );
  const nextItem = items.find((item) => item.status !== "submitted") || items[0];
  const recentStatusEvents = statusEventResult.items.slice(0, 4);

  return (
    <main className="shell">
      <section className="topbar" aria-label="Product status">
        <div>
          <p className="eyebrow">Revenue Intake Ledger · H0 Build Lane</p>
          <h1>A simple board for the work after AI helps you ship.</h1>
          <p className="lead">
            For solo AI builders who launch many projects at once. It tracks proof links, result dates, cloud-cost
            checks, and payment forms so the follow-up work does not get lost.
          </p>
          <p className="lead ja">
            AIで作った後の「証拠・締切・費用・入金確認」を忘れないための管理ボードです。
          </p>
        </div>
        <div className={`db-card ${health.database === "dynamodb" ? "live" : "preview"}`}>
          <span className="pulse" />
          <strong>{health.database === "dynamodb" ? "DynamoDB connected" : "Preview data"}</strong>
          <p>{health.boundary}</p>
        </div>
      </section>

      <section className="judge-path" aria-label="30 second judge path">
        <div>
          <span>1</span>
          <strong>Who</strong>
          <p>Solo AI builders submitting many apps, tools, videos, or experiments.</p>
        </div>
        <div>
          <span>2</span>
          <strong>Problem</strong>
          <p>After launch, proof, result dates, cloud costs, and payment forms scatter.</p>
        </div>
        <div>
          <span>3</span>
          <strong>Solution</strong>
          <p>One DynamoDB-backed board keeps each project, proof item, deadline, and next step together.</p>
        </div>
      </section>

      <section className="metrics" aria-label="Current operating metrics">
        <article>
          <span>{summary.opportunities}</span>
          <p>projects tracked</p>
        </article>
        <article>
          <span>{summary.submitted}</span>
          <p>submitted projects</p>
        </article>
        <article>
          <span>{summary.evidenceItems}</span>
          <p>proof items</p>
        </article>
        <article>
          <span>{summary.payoutTasks}</span>
          <p>payment tasks</p>
        </article>
        <article>
          <span>{summary.statusEvents}</span>
          <p>change log entries</p>
        </article>
      </section>

      <section className="workbench">
        <aside className="next-step" aria-label="Next action">
          <p className="eyebrow">What needs attention now</p>
          <h2>{nextItem.product}</h2>
          <p>{nextItem.nextAction}</p>
          <div className="hint">
            <strong>Plain English</strong>
            <span>The project is submitted. Now the board reminds the builder what must be checked next.</span>
          </div>
        </aside>

        <div className="table-wrap">
          <div className="table-head">
            <div>
              <p className="eyebrow">Follow-up board</p>
              <h2>Projects that still need attention</h2>
            </div>
            <span>source: {source}</span>
          </div>
          <div className="cards">
            {items.map((item) => (
              <article key={item.id} className={`lane ${item.status}`}>
                <div className="lane-title">
                  <div>
                    <h3>{item.product}</h3>
                    <p>{item.program}</p>
                  </div>
                  <span>{statusLabels[item.status]}</span>
                </div>
                <dl>
                  <div>
                    <dt>Who it helps</dt>
                    <dd>{item.audience}</dd>
                  </div>
                  <div>
                    <dt>Problem</dt>
                    <dd>{item.problem}</dd>
                  </div>
                  <div>
                    <dt>Next step</dt>
                    <dd>{item.nextAction}</dd>
                  </div>
                  <div>
                    <dt>Result date</dt>
                    <dd>{item.awardDate}</dd>
                  </div>
                  <div>
                    <dt>Prize range</dt>
                    <dd>{item.prizeRange}</dd>
                  </div>
                  <div>
                    <dt>AI note</dt>
                    <dd>{item.aiSuggestion}</dd>
                  </div>
                  <div>
                    <dt>Risk</dt>
                    <dd>{item.risk}</dd>
                  </div>
                </dl>
                <footer>
                  <span>{statusLabels[item.status]}</span>
                  <a href={item.evidenceUrl}>evidence</a>
                </footer>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="query-proof" aria-label="DynamoDB query proof">
        <div className="query-main">
          <p className="eyebrow">DynamoDB proof</p>
          <h2>One key loads everything needed for one project.</h2>
          <p>
            The H0 project is stored as one DynamoDB item collection. The app loads the project profile, proof links,
            payment tasks, and status history with <code>PK = OPPORTUNITY#h0</code>.
          </p>
          <div className="query-counts">
            <span>{h0Bundle.evidence.length} evidence</span>
            <span>{h0Bundle.payoutTasks.length} payout tasks</span>
            <span>{h0Bundle.statusEvents.length} status events</span>
          </div>
          <a className="api-link" href="/api/h0-bundle">Open /api/h0-bundle</a>
        </div>
        <div className="query-side">
          {dynamoAccessPatterns.map((item) => (
            <article key={item.route}>
              <strong>{item.label}</strong>
              <code>{item.keyShape}</code>
              <p>{item.why}</p>
              <a href={item.route}>{item.route}</a>
            </article>
          ))}
        </div>
      </section>

      <section className="history-board" aria-label="Status history">
        <div>
          <p className="eyebrow">Change history</p>
          <h2>Every important change leaves a trace.</h2>
          <p>
            After a project is submitted, humans and AI agents both need a clean record of what changed, why it changed,
            and what should happen next.
          </p>
        </div>
        <div className="history-list">
          {recentStatusEvents.map((item) => (
            <article key={item.id}>
              <span>{item.at}</span>
              <strong>{item.label}</strong>
              <p>
                {item.from} → {item.to}
              </p>
              <small>{item.reason}</small>
            </article>
          ))}
        </div>
      </section>

      <section className="action-index" aria-label="DynamoDB action queue">
        <div>
          <p className="eyebrow">Unfinished work queue</p>
          <h2>The app can ask DynamoDB: what is still open?</h2>
          <p>
            The app reads unfinished result, payment, and cloud-cost tasks through <code>PK = WORK_QUEUE#open</code>.
            This is what turns the board into a working checklist instead of a static dashboard.
          </p>
          <div className="index-proof">
            <span>access: {actionQueue.accessPath}</span>
            <span>{actionQueue.keyCondition}</span>
            <span>source: {actionQueue.source}</span>
          </div>
          <a className="api-link" href="/api/action-queue">Open /api/action-queue</a>
        </div>
        <div className="queue-list">
          {actionQueue.items.map((item) => (
            <article key={item.id}>
              <span>{item.status}</span>
              <strong>{item.label}</strong>
              <p>{item.due}</p>
              <small>
                owner: {item.owner} · opportunity: {item.opportunityId}
              </small>
            </article>
          ))}
        </div>
      </section>

      <section className="architecture" aria-label="Database architecture">
        <div>
          <p className="eyebrow">Database-first design</p>
          <h2>DynamoDB is the memory for the work.</h2>
          <p>
            DynamoDB stores projects, proof items, prize terms, payment tasks, change history, and AI suggestions.
            In an agent-heavy workflow, this shared memory keeps humans and AI aligned after launch.
          </p>
        </div>
        <ul>
          <li>projects: product, program, target prize, current state</li>
          <li>proof items: files, public URLs, verification notes</li>
          <li>change history: who changed what and why</li>
          <li>payment tasks: forms, deadlines, expected receipt windows</li>
        </ul>
      </section>

      <section className="proof-board" aria-label="H0 proof checklist">
        <div>
          <p className="eyebrow">Submission proof</p>
          <h2>This is not a mock dashboard.</h2>
          <p>
            The app includes live DynamoDB readback, API proof routes, an architecture diagram, and a short demo video.
            The database is used as the actual product memory.
          </p>
        </div>
        <div className="proof-grid">
          {h0ProofRequirements.map((item) => (
            <article key={item.label} className={`proof ${item.status}`}>
              <span>{item.status}</span>
              <strong>{item.label}</strong>
              <p>{item.note}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
