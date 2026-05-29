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
    status: "registered",
    plainStatus: "Registered, AWS credit applied, product not submitted",
    audience: "Small AI builders and SaaS teams",
    problem: "They track submissions, evidence, prize terms, and payout tasks across too many places.",
    nextAction: "Create budget guardrails, connect the smallest DynamoDB proof, capture AWS storage proof.",
    awardDate: "2026-07-31 14:00 PDT",
    payoutEstimate: "If selected, after required forms are verified; plan for up to 60 days.",
    prizeRange: "$2,000-$10,000 cash plus AWS credits",
    evidenceUrl: "https://h01.devpost.com/",
    evidenceCount: 3,
    payoutTaskCount: 4,
    risk: "AWS credit is active, but AWS has no hard spending cap; usage must stay tiny and monitored.",
    aiSuggestion: "Do not submit yet. Set the cost guardrails, connect DynamoDB, and capture real storage proof before Devpost."
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
    label: "Devpost registration state",
    kind: "verification",
    status: "attached",
    url: "https://h01.devpost.com/",
    note: "H0 page shows Start project, which means registration is active."
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
    status: "missing",
    note: "Required before final H0 submission."
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
    status: "blocked",
    due: "Before DynamoDB provisioning",
    owner: "builder"
  },
  {
    id: "h0-dynamodb-live",
    opportunityId: "h0",
    label: "Provision and seed DynamoDB",
    status: "blocked",
    due: "Before demo video",
    owner: "builder"
  },
  {
    id: "h0-submit",
    opportunityId: "h0",
    label: "Final Devpost submit",
    status: "waiting",
    due: "2026-06-29 17:00 PDT",
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

export const h0ProofRequirements: ProofRequirement[] = [
  {
    label: "Devpost registration",
    status: "done",
    note: "Start project appears on the H0 page."
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
    status: "blocked",
    note: "AWS credit is visible. Next create budget guardrails, then provision the smallest DynamoDB proof table."
  },
  {
    label: "AWS storage screenshot",
    status: "blocked",
    note: "Capture after live table is provisioned and seeded."
  },
  {
    label: "3-5 minute demo video",
    status: "waiting",
    note: "Record after DynamoDB is live."
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
