import {
  getOpportunityBundle,
  listEvidenceItems,
  listOpenActionQueue,
  listOpportunities,
  listPayoutTasks,
  listStatusEvents
} from "../lib/dynamodb";
import {
  dynamoAccessPatterns,
  getLedgerHealth,
  h0ProofRequirements,
  summarizeLedgerItems,
  type OpportunityStatus,
  type PayoutTask,
  type ProofRequirement,
  type RevenueOpportunity,
  type StatusEvent
} from "../lib/revenue-data";

type Lang = "en" | "ja";

const statusLabels: Record<Lang, Record<OpportunityStatus, string>> = {
  en: {
    submitted: "Done",
    watching: "Watch",
    registered: "Ready",
    blocked: "Blocked",
    proof_needed: "Need proof"
  },
  ja: {
    submitted: "完了",
    watching: "確認中",
    registered: "準備中",
    blocked: "停止中",
    proof_needed: "証拠待ち"
  }
};

const taskStatusLabels = {
  en: {
    done: "done",
    waiting: "waiting",
    blocked: "blocked"
  },
  ja: {
    done: "完了",
    waiting: "待機中",
    blocked: "停止中"
  }
};

const ownerLabels = {
  en: {
    builder: "builder",
    organizer: "organizer",
    sponsor: "sponsor"
  },
  ja: {
    builder: "作成者",
    organizer: "運営",
    sponsor: "スポンサー"
  }
};

const copy = {
  en: {
    eyebrow: "Revenue Intake Ledger · H0 Build Lane",
    title: "Don’t lose the work after you build with AI.",
    lead:
      "A small checklist board for solo builders. It keeps proof links, result dates, cloud-cost checks, and payment forms in one place.",
    facts: {
      submitted: "Submitted on Devpost",
      liveDb: "Live DynamoDB",
      previewDb: "Preview data",
      openTask: "Open task query"
    },
    dbLive: "Live DynamoDB proof",
    dbPreview: "Preview data",
    dbLiveBoundary: "This app is reading the live AWS database used for the H0 submission.",
    dbPreviewBoundary: "Preview mode is using bundled seed data. Do not submit until DynamoDB is proven.",
    judge: [
      ["Who", "Solo builders who use AI to launch many small products."],
      ["Problem", "After launch, important follow-up work gets scattered."],
      ["Solution", "One board keeps proof, deadlines, cost checks, and next steps together."]
    ],
    metrics: ["projects", "done", "proof", "payments", "changes"],
    nextCheck: "Next check",
    why: "Why it matters",
    whyText: "The board turns “I’ll check that later” into one clear next step.",
    checklist: "Tracked projects",
    whatNext: "Submitted projects and follow-ups",
    source: "source",
    fields: ["Problem", "Next step", "Result date", "Prize range"],
    evidence: "evidence",
    databaseProof: "Database proof",
    databaseTitle: "The board reads real saved records.",
    databaseText:
      "For H0, the project is stored in DynamoDB. One query loads the project, proof links, payment tasks, and status history with",
    counts: ["evidence", "payout tasks", "status events"],
    openApi: "Open",
    changeHistory: "Change history",
    changeTitle: "Every important change is saved.",
    changeText:
      "After submission, humans and AI agents both need a simple record of what changed, why it changed, and what to do next.",
    openTasks: "Open tasks",
    openTasksTitle: "The board can ask: what is still open?",
    openTasksText:
      "The app reads unfinished result, payment, and cloud-cost tasks through",
    openTasksText2: "That makes it a working checklist, not a static page.",
    access: "access",
    taskSource: "source",
    owner: "owner",
    opportunity: "opportunity",
    sharedMemory: "Shared memory",
    sharedTitle: "DynamoDB keeps the work in one place.",
    sharedText:
      "DynamoDB stores projects, proof items, prize terms, payment tasks, change history, and AI suggestions. In an AI-heavy workflow, this keeps humans and agents looking at the same truth.",
    architectureBullets: [
      "projects: product, program, target prize, current state",
      "proof items: files, public URLs, verification notes",
      "change history: who changed what and why",
      "payment tasks: forms, deadlines, expected receipt windows"
    ],
    proofBoard: "Submission proof",
    proofTitle: "This is not a mock dashboard.",
    proofText:
      "The app includes live DynamoDB readback, API proof routes, an architecture diagram, and a short demo video. The database is used as the actual product memory."
  },
  ja: {
    eyebrow: "Revenue Intake Ledger · H0 提出作品",
    title: "AIで作った後の作業を、見失わない。",
    lead:
      "一人でAIを使ってたくさん作る人のための、小さな確認ボードです。証拠リンク、結果発表日、クラウド費用、入金手続きを一か所にまとめます。",
    facts: {
      submitted: "Devpost提出済み",
      liveDb: "DynamoDB本番接続",
      previewDb: "プレビュー表示",
      openTask: "未完了タスク取得"
    },
    dbLive: "DynamoDB証拠あり",
    dbPreview: "プレビュー用データ",
    dbLiveBoundary: "H0提出用の本番AWSデータベースを読んでいます。",
    dbPreviewBoundary: "今は同梱データで表示しています。DynamoDB の証拠が確認できるまで提出判断には使いません。",
    judge: [
      ["誰のため", "AIで小さなプロダクトをたくさん作る、一人開発者のため。"],
      ["困りごと", "公開後に、証拠・締切・費用確認・入金手続きが散らばります。"],
      ["解決方法", "証拠、締切、費用確認、次の一手をひとつのボードにまとめます。"]
    ],
    metrics: ["作品", "完了", "証拠", "入金", "変更"],
    nextCheck: "次に確認",
    why: "なぜ大事か",
    whyText: "「あとで確認する」を、今見るべき一つの行動に変えます。",
    checklist: "追跡中の作品",
    whatNext: "提出済み作品と次の確認",
    source: "データ元",
    fields: ["困りごと", "次の一手", "発表日", "賞金範囲"],
    evidence: "証拠",
    databaseProof: "データベース証拠",
    databaseTitle: "実際に保存された記録を読んでいます。",
    databaseText:
      "H0 の作品データは DynamoDB に保存されています。ひとつの問い合わせで、作品、証拠リンク、入金タスク、変更履歴を読み込みます。",
    counts: ["証拠", "入金タスク", "履歴"],
    openApi: "開く",
    changeHistory: "変更履歴",
    changeTitle: "大事な変更はすべて残ります。",
    changeText:
      "提出後は、人間もAIエージェントも、何が変わったか、なぜ変えたか、次に何をするかを同じ記録で確認できます。",
    openTasks: "未完了タスク",
    openTasksTitle: "まだ残っている作業だけを取り出せます。",
    openTasksText:
      "結果確認、入金手続き、クラウド費用確認など、未完了の作業を",
    openTasksText2: "から読みます。これで、ただの一覧ではなく実際に使えるチェックリストになります。",
    access: "取得方法",
    taskSource: "データ元",
    owner: "担当",
    opportunity: "作品",
    sharedMemory: "共通の記憶",
    sharedTitle: "DynamoDB が作業を一か所にまとめます。",
    sharedText:
      "DynamoDB は、作品、証拠、賞金条件、入金タスク、変更履歴、AIの提案を保存します。AIを多く使う作業でも、人間とAIが同じ事実を見られます。",
    architectureBullets: [
      "作品: 名前、参加先、狙う賞金、現在の状態",
      "証拠: ファイル、公開URL、確認メモ",
      "変更履歴: 誰が、何を、なぜ変えたか",
      "入金タスク: 書類、締切、受け取り予定"
    ],
    proofBoard: "提出証拠",
    proofTitle: "見せかけのダッシュボードではありません。",
    proofText:
      "本番 DynamoDB の読み返し、API証拠、構成図、短いデモ動画を用意しています。データベースを実際の作品の記憶として使っています。"
  }
};

const opportunitiesJa: Record<string, Partial<RevenueOpportunity>> = {
  h0: {
    program: "H0: Hack the Zero Stack",
    problem:
      "AIで作る速度は上がりましたが、公開後の証拠、費用確認、締切、入金手続き、承認が散らばります。",
    nextAction: "H0の結果発表、AWS利用状況、運営からの入金書類を確認します。",
    awardDate: "2026-07-31 14:00 PDT",
    prizeRange: "2,000〜10,000ドル + AWSクレジット"
  },
  coexistence: {
    program: "Reddit Mod Tools and Migrated Apps Hackathon",
    problem:
      "AIが混ざる参加には、方針、レビュー、操作ログ、分析をまとめて見る場所が必要です。",
    nextAction: "受賞発表と入金手続きの連絡を確認します。",
    awardDate: "2026-06-20 15:00 PT",
    prizeRange: "1,000〜10,000ドル"
  },
  shipyard: {
    program: "Optimization Grand Challenge 2026",
    problem:
      "公式採点が始まる前に、解く、検証する、提出パッケージを作る流れを再現できる必要があります。",
    nextAction: "公式プラットフォームが開いたら、検証済みアルゴリズムを提出します。",
    awardDate: "2026-09-04",
    prizeRange: "7,000〜48,000ドル相当"
  },
  "domain-roulette": {
    program: "DeveloperWeek NY name.com track",
    problem: "ランダムなドメイン名を、短時間で筋の通った事業案に変える必要があります。",
    nextAction: "公式ドメインの割り当てを待ち、サンプル名を差し替えて最終提出します。",
    awardDate: "2026-06-10 16:00 EDT",
    prizeRange: "1,000〜2,500ドル + ドメインクレジット"
  },
  ignite64: {
    program: "Ignite64 Global AI Hackathon 2026",
    problem: "医療でAI出力を使う前に、人間へ渡すための確認履歴が必要です。",
    nextAction: "公式の開発期間内にだけ作ります。",
    awardDate: "公式審査後",
    prizeRange: "賞金総額 2,200ドル"
  }
};

const payoutTasksJa: Record<string, Partial<PayoutTask>> = {
  "h0-result-check": {
    label: "H0の受賞発表とメールを確認",
    due: "2026-08-01 06:00 JST"
  },
  "h0-aws-usage-check": {
    label: "RevenueIntakeLedger の AWS Cost Explorer を確認",
    due: "H0審査が終わるまで毎週"
  },
  "coexistence-results": {
    label: "受賞発表を確認",
    due: "2026-06-20 15:00 PT"
  }
};

const statusEventsJa: Record<string, Partial<StatusEvent>> = {
  "h0-final-submitted": {
    label: "H0 最終提出",
    from: "準備完了",
    to: "提出済み",
    reason: "H0 の最終ページで、Project submitted と 5/5 steps done が確認できました。"
  },
  "h0-dynamodb-live": {
    label: "DynamoDB が正本になった",
    from: "プレビュー用データ",
    to: "DynamoDB",
    reason: "Vercel 本番アプリが、作品、証拠、入金タスクを RevenueIntakeLedger テーブルから読みました。"
  },
  "h0-credit-applied": {
    label: "AWSクレジット適用",
    from: "クレジット待ち",
    to: "クレジット確認済み",
    reason: "データベース証拠を作る前に、AWS Billing でプロモーションクレジットを確認しました。"
  },
  "h0-registered": {
    label: "H0 参加登録",
    from: "未参加",
    to: "登録済み",
    reason: "Devpost の表示が Join hackathon から Start project に変わりました。"
  },
  "coexistence-submitted": {
    label: "Reddit モデレーションツール提出",
    from: "確認中",
    to: "提出済み",
    reason: "Devvitアプリ、多言語UI、AI方針作成、キュー、ログ、分析のストーリーを提出用に固定しました。"
  }
};

const accessPatternJa: Record<string, { label: string; why: string }> = {
  "/api/opportunities": {
    label: "ボード表示",
    why: "保存された収益レーンから、作業ボードを作ります。"
  },
  "/api/h0-bundle": {
    label: "1作品のまとめ",
    why: "ひとつの提出作品について、証拠、入金タスク、変更履歴をまとめて読みます。"
  },
  "/api/action-queue": {
    label: "行動リスト",
    why: "まだ終わっていない結果確認、入金、費用確認だけを読みます。"
  },
  "/api/proof": {
    label: "証拠ボード",
    why: "公開アプリが DynamoDB を使っているか、プレビューだけかを示します。"
  }
};

const proofJa: Record<string, Pick<ProofRequirement, "label" | "note">> = {
  "Devpost registration": {
    label: "Devpost登録",
    note: "参加登録が完了し、最終Devpostプロジェクトも提出済みです。"
  },
  "AWS credit applied": {
    label: "AWSクレジット適用",
    note: "AWS Billing でプロモーションクレジットが有効です。v0クレジットは必要になった時だけ使います。"
  },
  "Published Vercel URL": {
    label: "公開Vercel URL",
    note: "revenue-intake-ledger-public.vercel.app で公開されています。"
  },
  "Vercel Team ID": {
    label: "Vercel Team ID",
    note: "team_qU2jjQVZXVCwq9lXlmxu4aaM / daideguchis-projects。"
  },
  "Live DynamoDB source": {
    label: "本番DynamoDB",
    note: "本番APIは dynamodb:RevenueIntakeLedger から読み込んでいます。"
  },
  "AWS storage screenshot": {
    label: "AWS保存証拠",
    note: "RevenueIntakeLedger テーブルのAWS Consoleスクリーンショットを、機密を隠して保存済みです。"
  },
  "3-5 minute demo video": {
    label: "3〜5分デモ動画",
    note: "更新済みの英語ナレーションデモをYouTubeに限定公開しています: https://youtu.be/tYj9V2s5bDY"
  },
  "Devpost final submitted state": {
    label: "Devpost最終提出",
    note: "H0最終ページで Project submitted を確認済みです。公開ページは https://devpost.com/software/revenue-intake-ledger です。"
  }
};

function localizeOpportunity(item: RevenueOpportunity, lang: Lang) {
  return lang === "ja" ? { ...item, ...opportunitiesJa[item.id] } : item;
}

function localizePayoutTask(item: PayoutTask, lang: Lang) {
  return lang === "ja" ? { ...item, ...payoutTasksJa[item.id] } : item;
}

function localizeStatusEvent(item: StatusEvent, lang: Lang) {
  return lang === "ja" ? { ...item, ...statusEventsJa[item.id] } : item;
}

function localizeProof(item: ProofRequirement, lang: Lang) {
  return lang === "ja" ? { ...item, ...proofJa[item.label] } : item;
}

function sortOpportunities(items: RevenueOpportunity[]) {
  const statusRank: Record<OpportunityStatus, number> = {
    submitted: 2,
    watching: 1,
    registered: 1,
    proof_needed: 1,
    blocked: 3
  };

  return [...items].sort((a, b) => {
    if (a.id === "h0") return -1;
    if (b.id === "h0") return 1;
    return statusRank[a.status] - statusRank[b.status] || a.awardDate.localeCompare(b.awardDate);
  });
}

type ViewProps = {
  lang: Lang;
  items: RevenueOpportunity[];
  source: string;
  summary: ReturnType<typeof summarizeLedgerItems>;
  nextTask: PayoutTask | null;
  health: ReturnType<typeof getLedgerHealth>;
  h0Bundle: Awaited<ReturnType<typeof getOpportunityBundle>>;
  actionQueue: Awaited<ReturnType<typeof listOpenActionQueue>>;
  recentStatusEvents: StatusEvent[];
};

function LocalizedView({ lang, items, source, summary, nextTask, health, h0Bundle, actionQueue, recentStatusEvents }: ViewProps) {
  const t = copy[lang];
  const localizedItems = sortOpportunities(items).map((item) => localizeOpportunity(item, lang));
  const localizedNextTask = nextTask ? localizePayoutTask(nextTask, lang) : null;
  const proofFacts = [
    t.facts.submitted,
    health.database === "dynamodb" ? t.facts.liveDb : t.facts.previewDb,
    t.facts.openTask
  ];

  return (
    <div className={`lang-panel ${lang}-panel`} lang={lang}>
      <section className="topbar" aria-label={lang === "ja" ? "作品の状態" : "Product status"}>
        <div>
          <p className="eyebrow">{t.eyebrow}</p>
          <h1>{t.title}</h1>
          <p className="lead">{t.lead}</p>
          <div className="proof-strip" aria-label={lang === "ja" ? "提出証拠の要点" : "Submission proof highlights"}>
            {proofFacts.map((fact) => (
              <span key={fact}>{fact}</span>
            ))}
          </div>
        </div>
        <div className={`db-card ${health.database === "dynamodb" ? "live" : "preview"}`}>
          <span className="pulse" />
          <strong>{health.database === "dynamodb" ? t.dbLive : t.dbPreview}</strong>
          <p>{health.database === "dynamodb" ? t.dbLiveBoundary : t.dbPreviewBoundary}</p>
        </div>
      </section>

      <section className="judge-path" aria-label={lang === "ja" ? "30秒でわかる説明" : "30 second judge path"}>
        {t.judge.map(([title, body], index) => (
          <div key={title}>
            <span>{index + 1}</span>
            <strong>{title}</strong>
            <p>{body}</p>
          </div>
        ))}
      </section>

      <section className="metrics" aria-label={lang === "ja" ? "現在の数字" : "Current operating metrics"}>
        {[summary.opportunities, summary.submitted, summary.evidenceItems, summary.payoutTasks, summary.statusEvents].map((value, index) => (
          <article key={t.metrics[index]}>
            <span>{value}</span>
            <p>{t.metrics[index]}</p>
          </article>
        ))}
      </section>

      <section className="workbench">
        <aside className="next-step" aria-label={lang === "ja" ? "次の行動" : "Next action"}>
          <p className="eyebrow">{t.nextCheck}</p>
          <h2>{localizedNextTask?.label || t.whatNext}</h2>
          {localizedNextTask ? (
            <p>
              {localizedNextTask.due} · {t.owner}: {ownerLabels[lang][localizedNextTask.owner]}
            </p>
          ) : (
            <p>{t.whyText}</p>
          )}
          <div className="hint">
            <strong>{t.why}</strong>
            <span>{t.whyText}</span>
          </div>
        </aside>

        <div className="table-wrap">
          <div className="table-head">
            <div>
              <p className="eyebrow">{t.checklist}</p>
              <h2>{t.whatNext}</h2>
            </div>
            <span>{t.source}: {source}</span>
          </div>
          <div className="cards">
            {localizedItems.map((item) => (
              <article key={item.id} className={`lane ${item.status}`}>
                <div className="lane-title">
                  <div>
                    <h3>{item.product}</h3>
                    <p>{item.program}</p>
                  </div>
                  <span>{statusLabels[lang][item.status]}</span>
                </div>
                <dl>
                  <div>
                    <dt>{t.fields[0]}</dt>
                    <dd>{item.problem}</dd>
                  </div>
                  <div>
                    <dt>{t.fields[1]}</dt>
                    <dd>{item.nextAction}</dd>
                  </div>
                  <div>
                    <dt>{t.fields[2]}</dt>
                    <dd>{item.awardDate}</dd>
                  </div>
                  <div>
                    <dt>{t.fields[3]}</dt>
                    <dd>{item.prizeRange}</dd>
                  </div>
                </dl>
                <footer>
                  <span>{statusLabels[lang][item.status]}</span>
                  <a href={item.evidenceUrl}>{t.evidence}</a>
                </footer>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="query-proof" aria-label={lang === "ja" ? "DynamoDB証拠" : "DynamoDB query proof"}>
        <div className="query-main">
          <p className="eyebrow">{t.databaseProof}</p>
          <h2>{t.databaseTitle}</h2>
          <p>
            {t.databaseText} <code>PK = OPPORTUNITY#h0</code>.
          </p>
          <div className="query-counts">
            <span>{h0Bundle.evidence.length} {t.counts[0]}</span>
            <span>{h0Bundle.payoutTasks.length} {t.counts[1]}</span>
            <span>{h0Bundle.statusEvents.length} {t.counts[2]}</span>
          </div>
          <a className="api-link" href="/api/h0-bundle">{t.openApi} /api/h0-bundle</a>
        </div>
        <div className="query-side">
          {dynamoAccessPatterns.map((item) => {
            const pattern = lang === "ja" ? accessPatternJa[item.route] : item;
            return (
              <article key={item.route}>
                <strong>{pattern.label}</strong>
                <code>{item.keyShape}</code>
                <p>{pattern.why}</p>
                <a href={item.route}>{item.route}</a>
              </article>
            );
          })}
        </div>
      </section>

      <section className="history-board" aria-label={lang === "ja" ? "変更履歴" : "Status history"}>
        <div>
          <p className="eyebrow">{t.changeHistory}</p>
          <h2>{t.changeTitle}</h2>
          <p>{t.changeText}</p>
        </div>
        <div className="history-list">
          {recentStatusEvents.map((event) => {
            const item = localizeStatusEvent(event, lang);
            return (
              <article key={item.id}>
                <span>{item.at}</span>
                <strong>{item.label}</strong>
                <p>
                  {item.from} → {item.to}
                </p>
                <small>{item.reason}</small>
              </article>
            );
          })}
        </div>
      </section>

      <section className="action-index" aria-label={lang === "ja" ? "未完了タスク" : "DynamoDB action queue"}>
        <div>
          <p className="eyebrow">{t.openTasks}</p>
          <h2>{t.openTasksTitle}</h2>
          <p>
            {t.openTasksText} <code>PK = WORK_QUEUE#open</code>. {t.openTasksText2}
          </p>
          <div className="index-proof">
            <span>{t.access}: {actionQueue.accessPath}</span>
            <span>{actionQueue.keyCondition}</span>
            <span>{t.taskSource}: {actionQueue.source}</span>
          </div>
          <a className="api-link" href="/api/action-queue">{t.openApi} /api/action-queue</a>
        </div>
        <div className="queue-list">
          {actionQueue.items.map((task) => {
            const item = localizePayoutTask(task, lang);
            return (
              <article key={item.id}>
                <span>{taskStatusLabels[lang][item.status]}</span>
                <strong>{item.label}</strong>
                <p>{item.due}</p>
                <small>
                  {t.owner}: {ownerLabels[lang][item.owner]} · {t.opportunity}: {item.opportunityId}
                </small>
              </article>
            );
          })}
        </div>
      </section>

      <section className="architecture" aria-label={lang === "ja" ? "データベース構成" : "Database architecture"}>
        <div>
          <p className="eyebrow">{t.sharedMemory}</p>
          <h2>{t.sharedTitle}</h2>
          <p>{t.sharedText}</p>
        </div>
        <ul>
          {t.architectureBullets.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="proof-board" aria-label={lang === "ja" ? "H0提出証拠" : "H0 proof checklist"}>
        <div>
          <p className="eyebrow">{t.proofBoard}</p>
          <h2>{t.proofTitle}</h2>
          <p>{t.proofText}</p>
        </div>
        <div className="proof-grid">
          {h0ProofRequirements.map((proof) => {
            const item = localizeProof(proof, lang);
            return (
              <article key={proof.label} className={`proof ${proof.status}`}>
                <span>{taskStatusLabels[lang][proof.status]}</span>
                <strong>{item.label}</strong>
                <p>{item.note}</p>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}

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
  const nextTask = actionQueue.items[0] || null;
  const recentStatusEvents = statusEventResult.items.slice(0, 4);

  return (
    <main className="shell">
      <input className="language-radio" type="radio" name="language" id="lang-en" defaultChecked />
      <input className="language-radio" type="radio" name="language" id="lang-ja" />
      <nav className="language-bar" aria-label="Language switch">
        <label htmlFor="lang-en" lang="en">English</label>
        <label htmlFor="lang-ja" lang="ja">日本語</label>
      </nav>
      <LocalizedView
        lang="en"
        items={items}
        source={source}
        summary={summary}
        nextTask={nextTask}
        health={health}
        h0Bundle={h0Bundle}
        actionQueue={actionQueue}
        recentStatusEvents={recentStatusEvents}
      />
      <LocalizedView
        lang="ja"
        items={items}
        source={source}
        summary={summary}
        nextTask={nextTask}
        health={health}
        h0Bundle={h0Bundle}
        actionQueue={actionQueue}
        recentStatusEvents={recentStatusEvents}
      />
    </main>
  );
}
