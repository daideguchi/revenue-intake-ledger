import { listOpportunities } from "../lib/dynamodb";
import { getLedgerHealth } from "../lib/revenue-data";

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
  const [{ items, source }, health] = await Promise.all([listOpportunities(), Promise.resolve(getLedgerHealth())]);
  const submitted = items.filter((item) => item.status === "submitted").length;
  const open = items.length - submitted;
  const nextItem = items.find((item) => item.status !== "submitted") || items[0];

  return (
    <main className="shell">
      <section className="topbar" aria-label="Product status">
        <div>
          <p className="eyebrow">H0 Build Lane · Vercel + AWS Databases</p>
          <h1>Revenue Intake Ledger</h1>
          <p className="lead">
            Small AI teams win or lose money in the follow-up work after shipping. This ledger turns submissions,
            evidence, prize terms, and payout tasks into one durable revenue room.
          </p>
          <p className="lead ja">
            小さなAIチームが、応募・証拠・賞金条件・入金予定を一つの画面で追える収益管理ツールです。
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
          <p>AI builders chasing many revenue opportunities at once.</p>
        </div>
        <div>
          <span>2</span>
          <strong>Pain</strong>
          <p>Submitted, blocked, winner dates, and payout tasks become scattered.</p>
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
          <span>{items.length}</span>
          <p>tracked opportunities</p>
        </article>
        <article>
          <span>{submitted}</span>
          <p>submitted lanes</p>
        </article>
        <article>
          <span>{open}</span>
          <p>open follow-ups</p>
        </article>
        <article>
          <span>{health.database === "dynamodb" ? "AWS" : "Seed"}</span>
          <p>current data source</p>
        </article>
      </section>

      <section className="workbench">
        <aside className="next-step" aria-label="Next action">
          <p className="eyebrow">Next best action</p>
          <h2>{nextItem.product}</h2>
          <p>{nextItem.nextAction}</p>
          <div className="hint">
            <strong>Submission boundary</strong>
            <span>H0 is not ready for Devpost final submit until AWS DB proof is captured.</span>
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

      <section className="architecture" aria-label="Database architecture">
        <div>
          <p className="eyebrow">Database-first design</p>
          <h2>The database is the product memory.</h2>
          <p>
            DynamoDB stores opportunities, evidence items, prize terms, payout tasks, status history, and AI suggestions.
            The current public preview shows the full workflow shape while AWS credentials and cost controls are being
            prepared.
          </p>
        </div>
        <ul>
          <li>opportunities: product, program, target prize, current state</li>
          <li>evidence_items: proof files, public URLs, verification notes</li>
          <li>status_history: who changed what and why</li>
          <li>payout_tasks: forms, deadlines, expected receipt windows</li>
        </ul>
      </section>
    </main>
  );
}
