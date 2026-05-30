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

const jaStatusLabels = {
  submitted: "提出済み",
  watching: "確認中",
  registered: "登録済み",
  blocked: "停止中",
  proof_needed: "証拠待ち"
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
          <p className="eyebrow">H0 Build Lane · Vercel + AWS Databases</p>
          <h1>Revenue Intake Ledger</h1>
          <p className="lead">
            AI agents make it easy to launch more products, submissions, videos, stores, and experiments. The hard
            part becomes the cleanup after creation: proof, deadlines, cost checks, payout tasks, and human approvals.
          </p>
          <p className="lead ja">
            AIエージェントで事業や応募が増えるほど、作った後の整理、証拠、締切、入金確認、人間の承認が重くなります。
            この台帳は、その後工程を一つの画面で追える収益管理ツールです。
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
          <p>Builders using AI agents to launch many revenue experiments at once.</p>
        </div>
        <div>
          <span>2</span>
          <strong>Pain</strong>
          <p>Creation gets faster, but proof, cost checks, deadlines, and payout tasks scatter.</p>
        </div>
        <div>
          <span>3</span>
          <strong>How</strong>
          <p>A database-backed ledger stores every status, proof item, and next action.</p>
        </div>
        <div>
          <span>4</span>
          <strong>Why H0</strong>
          <p>The database is the product memory, not a decorative backend.</p>
        </div>
      </section>

      <section className="metrics" aria-label="Current operating metrics">
        <article>
          <span>{summary.opportunities}</span>
          <p>tracked opportunities</p>
        </article>
        <article>
          <span>{summary.submitted}</span>
          <p>submitted lanes</p>
        </article>
        <article>
          <span>{summary.evidenceItems}</span>
          <p>evidence records</p>
        </article>
        <article>
          <span>{summary.payoutTasks}</span>
          <p>payout tasks</p>
        </article>
        <article>
          <span>{summary.statusEvents}</span>
          <p>status events</p>
        </article>
      </section>

      <section className="workbench">
        <aside className="next-step" aria-label="Next action">
          <p className="eyebrow">Next best action</p>
          <h2>{nextItem.product}</h2>
          <p>{nextItem.nextAction}</p>
          <div className="hint">
            <strong>Post-submit boundary</strong>
            <span>H0 is submitted. Now the job is result monitoring, AWS usage monitoring, and payout paperwork readiness.</span>
          </div>
        </aside>

        <div className="table-wrap">
          <div className="table-head">
            <div>
              <p className="eyebrow">Operating ledger</p>
              <h2>Revenue lanes</h2>
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
                    <dt>誰のため</dt>
                    <dd>{item.audience}</dd>
                  </div>
                  <div>
                    <dt>困りごと</dt>
                    <dd>{item.problem}</dd>
                  </div>
                  <div>
                    <dt>次の一手</dt>
                    <dd>{item.nextAction}</dd>
                  </div>
                  <div>
                    <dt>発表</dt>
                    <dd>{item.awardDate}</dd>
                  </div>
                  <div>
                    <dt>賞金幅</dt>
                    <dd>{item.prizeRange}</dd>
                  </div>
                  <div>
                    <dt>AI提案</dt>
                    <dd>{item.aiSuggestion}</dd>
                  </div>
                  <div>
                    <dt>リスク</dt>
                    <dd>{item.risk}</dd>
                  </div>
                </dl>
                <footer>
                  <span>{jaStatusLabels[item.status]}</span>
                  <a href={item.evidenceUrl}>evidence</a>
                </footer>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="query-proof" aria-label="DynamoDB query proof">
        <div className="query-main">
          <p className="eyebrow">Single-table query proof</p>
          <h2>One key loads the whole H0 revenue packet.</h2>
          <p>
            The H0 lane is stored as one DynamoDB item collection. The app can load the submission profile, proof
            records, payout tasks, and status history with the access pattern <code>PK = OPPORTUNITY#h0</code>.
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
          <p className="eyebrow">Status history</p>
          <h2>Every money-relevant change leaves a trace.</h2>
          <p>
            This is the practical point of the product: after a project is submitted, humans and AI both need a clean
            record of what changed, why it changed, and what should happen next.
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
          <p className="eyebrow">AWS credit use · DynamoDB work queue</p>
          <h2>Open follow-up tasks are stored as a queryable queue.</h2>
          <p>
            The extra AWS value is a real access pattern: the app reads only unfinished payout, result, and cost-monitoring
            tasks through <code>PK = WORK_QUEUE#open</code>. This is the part that turns the ledger into an operating system after submit.
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
          <h2>The database is the product memory.</h2>
          <p>
            DynamoDB stores opportunities, evidence items, prize terms, payout tasks, status history, and AI suggestions.
            In an agent-heavy workflow, this shared memory keeps humans and AI aligned after the first launch.
          </p>
        </div>
        <ul>
          <li>opportunities: product, program, target prize, current state</li>
          <li>evidence_items: proof files, public URLs, verification notes</li>
          <li>status_history: who changed what and why</li>
          <li>payout_tasks: forms, deadlines, expected receipt windows</li>
        </ul>
      </section>

      <section className="proof-board" aria-label="H0 proof checklist">
        <div>
          <p className="eyebrow">H0 proof board</p>
          <h2>Ready means the database is real.</h2>
          <p>
            This board keeps the current preview honest. A public URL alone is not enough for H0. The final package
            needs live DynamoDB proof, storage screenshots, a diagram, and a short demo.
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
