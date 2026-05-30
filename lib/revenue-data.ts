export type OpportunityStatus =
  | "submitted"
  | "watching"
  | "registered"
  | "blocked"
  | "proof_needed";

export type RevenueOpportunity = {
  id: string;
  product: string;
  program: string;
  status: OpportunityStatus;
  plainStatus: string;
  audience: string;
  problem: string;
  nextAction: string;
  awardDate: string;
  payoutEstimate: string;
  prizeRange: string;
  evidenceUrl: string;
  evidenceCount: number;
  payoutTaskCount: number;
  risk: string;
  aiSuggestion: string;
};

export type EvidenceItem = {
  id: string;
  opportunityId: string;
  label: string;
  kind: "public_url" | "verification" | "screenshot" | "email" | "manual_note";
  status: "attached" | "missing" | "stale";
  url?: string;
  note: string;
};

export type PayoutTask = {
  id: string;
  opportunityId: string;
  label: string;
  status: "done" | "waiting" | "blocked";
  due: string;
  owner: "builder" | "organizer" | "sponsor";
};

export type StatusEvent = {
  id: string;
  opportunityId: string;
  at: string;
  actor: "builder" | "ai" | "organizer" | "sponsor";
  label: string;
  from: string;
  to: string;
  reason: string;
};

export type ProofRequirement = {
  label: string;
  status: "done" | "waiting" | "blocked";
  note: string;
};

export type LedgerHealth = {
  database: "dynamodb" | "preview-seed";
  tableName: string | null;
  writable: boolean;
  boundary: string;
};

export const seedOpportunities: RevenueOpportunity[] = [
  {
    id: "h0",
    product: "Revenue Intake Ledger",
    program: "H0: Hack the Zero Stack",
    status: "submitted",
    plainStatus: "Submitted to H0 Devpost",
    audience: "Small AI builders and SaaS teams",
    problem: "They track submissions, evidence, prize terms, and payout tasks across too many places.",
    nextAction: "Monitor the H0 result date, AWS usage, and any payout paperwork from organizers.",
    awardDate: "2026-07-31 14:00 PDT",
    payoutEstimate: "If selected, after required forms are verified; plan for up to 60 days.",
    prizeRange: "$2,000-$10,000 cash plus AWS credits",
    evidenceUrl: "https://devpost.com/software/revenue-intake-ledger",
    evidenceCount: 6,
    payoutTaskCount: 6,
    risk: "Submitted and backed by DynamoDB, but AWS promotional credits are still not a hard spending cap; keep usage tiny and monitored.",
    aiSuggestion: "The final Devpost submission is complete. Keep the AWS table minimal, monitor Cost Explorer, and prepare winner/payout follow-up."
  },
  {
    id: "coexistence",
    product: "Coexistence Console",
    program: "Reddit Mod Tools and Migrated Apps Hackathon",
    status: "submitted",
    plainStatus: "Submitted",
    audience: "Reddit moderators",
    problem: "AI-assisted participation needs clear policy, review, action logs, and analytics.",
    nextAction: "Monitor winner announcement and payment paperwork.",
    awardDate: "2026-06-20 15:00 PT",
    payoutEstimate: "If selected, safest estimate is late August 2026.",
    prizeRange: "$1,000-$10,000 cash",
    evidenceUrl: "https://mod-tools-migration.devpost.com/",
    evidenceCount: 6,
    payoutTaskCount: 3,
    risk: "Winner paperwork is future-dependent.",
    aiSuggestion: "Monitor announcement date and prepare tax/payment documents."
  },
  {
    id: "shipyard",
    product: "Shipyard Solver Lab",
    program: "Optimization Grand Challenge 2026",
    status: "submitted",
    plainStatus: "Devpost submitted, official platform follow-up pending",
    audience: "Optimization challenge teams",
    problem: "They need a reproducible solve-validate-package loop before official scoring opens.",
    nextAction: "Submit algorithm on the official platform when the window opens.",
    awardDate: "2026-09-04",
    payoutEstimate: "If selected, after organizer payment instructions.",
    prizeRange: "$7,000-$48,000 equivalent",
    evidenceUrl: "https://ogc2026.devpost.com/",
    evidenceCount: 7,
    payoutTaskCount: 4,
    risk: "Official platform submission remains separate from Devpost.",
    aiSuggestion: "Wait for the official algorithm submission window, then upload the verified package."
  },
  {
    id: "domain-roulette",
    product: "Domain Roulette Launch Lab",
    program: "DeveloperWeek NY name.com track",
    status: "blocked",
    plainStatus: "Devpost 4/5, waiting for official domains",
    audience: "Hackathon teams drawing random domains",
    problem: "They must turn random domain names into a coherent product plan fast.",
    nextAction: "Wait for official domain assignment, replace sample domains, final submit.",
    awardDate: "2026-06-10 16:00 EDT",
    payoutEstimate: "Gift/domain credits or cash depending on award.",
    prizeRange: "$1,000-$2,500 cash plus domain credits",
    evidenceUrl: "https://devpost.com/software/domain-roulette-launch-lab",
    evidenceCount: 5,
    payoutTaskCount: 2,
    risk: "Official random domain assignment is not visible yet.",
    aiSuggestion: "Do not final submit sample domains unless the rule risk is explicitly accepted."
  },
  {
    id: "ignite64",
    product: "Clinical AI Handoff Auditor",
    program: "Ignite64 Global AI Hackathon 2026",
    status: "registered",
    plainStatus: "Registered, product not started",
    audience: "Healthcare teams using AI handoffs",
    problem: "Clinical AI outputs need a clear handoff trail before humans rely on them.",
    nextAction: "Build only inside the official hacking window.",
    awardDate: "After official judging",
    payoutEstimate: "Organizer instructions after winner contact.",
    prizeRange: "$2,200 pool",
    evidenceUrl: "https://www.i64.in/register",
    evidenceCount: 2,
    payoutTaskCount: 2,
    risk: "Official hacking window has not started.",
    aiSuggestion: "Keep this as a registration record until the build window opens."
  }
];

export const seedEvidenceItems: EvidenceItem[] = [
  {
    id: "h0-devpost-registered",
    opportunityId: "h0",
    label: "Devpost submitted state",
    kind: "verification",
    status: "attached",
    url: "https://devpost.com/software/revenue-intake-ledger",
    note: "Final Devpost page showed Project submitted after the H0 submission flow."
  },
  {
    id: "h0-credit-request",
    opportunityId: "h0",
    label: "AWS/v0 credits issued",
    kind: "manual_note",
    status: "attached",
    note: "Devpost email issued $100 AWS and $30 v0 credits. The AWS credit is applied and visible in Billing; raw codes are stored only in the ignored local secrets file."
  },
  {
    id: "h0-dynamodb-proof",
    opportunityId: "h0",
    label: "DynamoDB storage proof",
    kind: "screenshot",
    status: "attached",
    note: "AWS Console shows the RevenueIntakeLedger table, and the live API now reads 17 seeded DynamoDB items. Redacted screenshot captured in the AI organization evidence folder."
  },
  {
    id: "h0-vercel-team-id",
    opportunityId: "h0",
    label: "Vercel Team ID",
    kind: "manual_note",
    status: "attached",
    note: "Vercel scope detected as team_qU2jjQVZXVCwq9lXlmxu4aaM / daideguchis-projects."
  },
  {
    id: "h0-demo-video",
    opportunityId: "h0",
    label: "3-5 minute demo video",
    kind: "public_url",
    status: "attached",
    url: "https://youtu.be/tYj9V2s5bDY",
    note: "Updated Natural English narrated demo uploaded as an unlisted YouTube video."
  },
  {
    id: "h0-final-submit-proof",
    opportunityId: "h0",
    label: "Final H0 public Devpost page",
    kind: "public_url",
    status: "attached",
    url: "https://devpost.com/software/revenue-intake-ledger",
    note: "Public project page exists and the post-submit readback showed Project submitted."
  },
  {
    id: "shipyard-devpost",
    opportunityId: "shipyard",
    label: "Devpost submitted state",
    kind: "public_url",
    status: "attached",
    url: "https://devpost.com/software/shipyard-solver-lab",
    note: "Public Devpost page exists; official scoring follow-up is still separate."
  }
];

export const seedPayoutTasks: PayoutTask[] = [
  {
    id: "h0-cost-guardrail",
    opportunityId: "h0",
    label: "Confirm AWS budget and billing alarm",
    status: "done",
    due: "Completed before DynamoDB proof",
    owner: "builder"
  },
  {
    id: "h0-dynamodb-live",
    opportunityId: "h0",
    label: "Provision and seed DynamoDB",
    status: "done",
    due: "Completed before demo video",
    owner: "builder"
  },
  {
    id: "h0-demo-video",
    opportunityId: "h0",
    label: "Upload 3-5 minute demo video",
    status: "done",
    due: "Completed before final submit",
    owner: "builder"
  },
  {
    id: "h0-submit",
    opportunityId: "h0",
    label: "Final Devpost submit",
    status: "done",
    due: "Completed 2026-05-30 JST",
    owner: "builder"
  },
  {
    id: "h0-result-check",
    opportunityId: "h0",
    label: "Check H0 winner announcement and email",
    status: "waiting",
    due: "2026-08-01 06:00 JST",
    owner: "organizer"
  },
  {
    id: "h0-aws-usage-check",
    opportunityId: "h0",
    label: "Check AWS Cost Explorer for RevenueIntakeLedger usage",
    status: "waiting",
    due: "Weekly until H0 judging ends",
    owner: "builder"
  },
  {
    id: "coexistence-results",
    opportunityId: "coexistence",
    label: "Check winner announcement",
    status: "waiting",
    due: "2026-06-20 15:00 PT",
    owner: "organizer"
  }
];

export const seedStatusEvents: StatusEvent[] = [
  {
    id: "h0-registered",
    opportunityId: "h0",
    at: "2026-05-29 07:57 JST",
    actor: "builder",
    label: "Registered for H0",
    from: "not joined",
    to: "registered",
    reason: "The Devpost registration state changed from Join hackathon to Start project."
  },
  {
    id: "h0-credit-applied",
    opportunityId: "h0",
    at: "2026-05-30 JST",
    actor: "builder",
    label: "AWS credit applied",
    from: "credit pending",
    to: "credit visible",
    reason: "AWS Billing showed the promotional credit before any database proof work continued."
  },
  {
    id: "h0-dynamodb-live",
    opportunityId: "h0",
    at: "2026-05-30 JST",
    actor: "builder",
    label: "DynamoDB became source of truth",
    from: "preview-seed",
    to: "dynamodb",
    reason: "The Vercel production app read opportunities, evidence, and payout tasks from the RevenueIntakeLedger table."
  },
  {
    id: "h0-final-submitted",
    opportunityId: "h0",
    at: "2026-05-30 05:55 JST",
    actor: "builder",
    label: "Final Devpost submission",
    from: "ready",
    to: "submitted",
    reason: "The final H0 Devpost page showed Project submitted and 5/5 steps done."
  },
  {
    id: "coexistence-submitted",
    opportunityId: "coexistence",
    at: "2026-05-20 JST",
    actor: "builder",
    label: "Reddit mod tool submitted",
    from: "review",
    to: "submitted",
    reason: "The Devvit app, multilingual UI, AI policy drafting, queue, log, and analytics story were locked for review."
  }
];

export const h0ProofRequirements: ProofRequirement[] = [
  {
    label: "Devpost registration",
    status: "done",
    note: "Registration was completed and the final Devpost project was submitted."
  },
  {
    label: "AWS credit applied",
    status: "done",
    note: "AWS Billing shows the promotional credit active. v0 credit remains optional unless used for the final demo."
  },
  {
    label: "Published Vercel URL",
    status: "done",
    note: "Preview is live at revenue-intake-ledger-public.vercel.app."
  },
  {
    label: "Vercel Team ID",
    status: "done",
    note: "team_qU2jjQVZXVCwq9lXlmxu4aaM / daideguchis-projects."
  },
  {
    label: "Live DynamoDB source",
    status: "done",
    note: "Production API reads from dynamodb:RevenueIntakeLedger."
  },
  {
    label: "AWS storage screenshot",
    status: "done",
    note: "Redacted AWS Console screenshot captured for the RevenueIntakeLedger table."
  },
  {
    label: "3-5 minute demo video",
    status: "done",
    note: "Updated Natural English final demo uploaded to YouTube: https://youtu.be/tYj9V2s5bDY"
  },
  {
    label: "Devpost final submitted state",
    status: "done",
    note: "Final H0 page showed Project submitted and public project page is https://devpost.com/software/revenue-intake-ledger."
  }
];

export function getLedgerHealth(): LedgerHealth {
  const tableName = process.env.DYNAMODB_TABLE || null;
  const hasAwsCredentials = Boolean(process.env.AWS_REGION && process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY);

  if (tableName && hasAwsCredentials) {
    return {
      database: "dynamodb",
      tableName,
      writable: true,
      boundary: "Live DynamoDB environment variables are configured. API routes will use AWS as the source of truth."
    };
  }

  return {
    database: "preview-seed",
    tableName,
    writable: false,
    boundary: "Preview mode is using bundled seed data. Do not submit to H0 until DynamoDB is connected and proven."
  };
}

export function summarizeLedger() {
  const submitted = seedOpportunities.filter((item) => item.status === "submitted").length;
  const open = seedOpportunities.length - submitted;
  const missingEvidence = seedEvidenceItems.filter((item) => item.status !== "attached").length;
  const blockedTasks = seedPayoutTasks.filter((item) => item.status === "blocked").length;

  return {
    opportunities: seedOpportunities.length,
    submitted,
    open,
    evidenceItems: seedEvidenceItems.length,
    missingEvidence,
    payoutTasks: seedPayoutTasks.length,
    blockedTasks
  };
}

export function summarizeLedgerItems(
  opportunities: RevenueOpportunity[],
  evidenceItems: EvidenceItem[],
  payoutTasks: PayoutTask[],
  statusEvents: StatusEvent[]
) {
  const submitted = opportunities.filter((item) => item.status === "submitted").length;
  const open = opportunities.length - submitted;
  const missingEvidence = evidenceItems.filter((item) => item.status !== "attached").length;
  const blockedTasks = payoutTasks.filter((item) => item.status === "blocked").length;

  return {
    opportunities: opportunities.length,
    submitted,
    open,
    evidenceItems: evidenceItems.length,
    missingEvidence,
    payoutTasks: payoutTasks.length,
    blockedTasks,
    statusEvents: statusEvents.length
  };
}

export const dynamoAccessPatterns = [
  {
    label: "Board view",
    route: "/api/opportunities",
    keyShape: "entity = opportunity",
    why: "Builds the operating board from durable revenue lanes."
  },
  {
    label: "One lane packet",
    route: "/api/h0-bundle",
    keyShape: "PK = OPPORTUNITY#h0",
    why: "Loads one submission with its proof, payout tasks, and status history."
  },
  {
    label: "Action queue",
    route: "/api/action-queue",
    keyShape: "PK = WORK_QUEUE#open",
    why: "Reads only open result, payout, and cost-monitoring tasks through a materialized DynamoDB item collection."
  },
  {
    label: "Proof board",
    route: "/api/proof",
    keyShape: "health + live counts",
    why: "Shows whether the deployed app is using DynamoDB or only preview data."
  }
];
