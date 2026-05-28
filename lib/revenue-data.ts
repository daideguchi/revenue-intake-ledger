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
    plainStatus: "Registered, credits requested, product not submitted",
    audience: "Small AI builders and SaaS teams",
    problem: "They track submissions, evidence, prize terms, and payout tasks across too many places.",
    nextAction: "Connect DynamoDB, publish Vercel build, capture AWS storage proof.",
    awardDate: "2026-07-31 14:00 PDT",
    payoutEstimate: "If selected, after required forms are verified; plan for up to 60 days.",
    prizeRange: "$2,000-$10,000 cash plus AWS credits",
    evidenceUrl: "https://h01.devpost.com/"
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
    evidenceUrl: "https://mod-tools-migration.devpost.com/"
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
    evidenceUrl: "https://ogc2026.devpost.com/"
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
    evidenceUrl: "https://devpost.com/software/domain-roulette-launch-lab"
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
    evidenceUrl: "https://www.i64.in/register"
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
