# Architecture

Revenue Intake Ledger is intentionally database-first.

```text
Judge / builder
  |
  v
Vercel / Next.js app
  |
  +-- /api/health
  +-- /api/opportunities
  +-- /api/h0-bundle
  +-- /api/action-queue
  +-- /api/evidence
  +-- /api/payout-tasks
  +-- /api/proof
  |
  v
AWS DynamoDB
  |
  +-- OPPORTUNITY#<id> / PROFILE
  +-- OPPORTUNITY#<id> / EVIDENCE#<id>
  +-- OPPORTUNITY#<id> / PAYOUT#<id>
  +-- OPPORTUNITY#<id> / STATUS#<timestamp>#<id>
  +-- WORK_QUEUE#open / DUE#<date>#OPPORTUNITY#<id>#PAYOUT#<id>
```

## Why DynamoDB

The product is a live operations ledger. Items are created over time and belong to a revenue opportunity:

- status changes
- evidence attachments
- payment tasks
- sponsor follow-ups
- AI suggestions

DynamoDB fits this because the app needs durable, small, event-like records rather than heavy relational reporting.

## Single Table Shape

| pk | sk | entity | Purpose |
|---|---|---|---|
| `OPPORTUNITY#h0` | `PROFILE` | `opportunity` | One revenue lane |
| `OPPORTUNITY#h0` | `EVIDENCE#h0-dynamodb-proof` | `evidence` | A proof item |
| `OPPORTUNITY#h0` | `PAYOUT#h0-submit` | `payout_task` | A follow-up task |
| `OPPORTUNITY#h0` | `STATUS#2026-05-30...` | `status_event` | A money-relevant state change |
| `WORK_QUEUE#open` | `DUE#2026-08-01...#OPPORTUNITY#h0...` | `work_queue` | A materialized open-action queue |

## Query Patterns

| Route | DynamoDB access pattern | Why it matters |
|---|---|---|
| `/api/opportunities` | Filter by `entity = opportunity` for the board view | Shows every revenue lane in one operating screen |
| `/api/h0-bundle` | `Query` where `PK = OPPORTUNITY#h0` | Loads one complete submission packet: profile, proof, payout tasks, and status history |
| `/api/action-queue` | `Query` where `PK = WORK_QUEUE#open` | Loads only unfinished result, payout, and AWS-usage follow-up tasks |
| `/api/proof` | Health plus live record counts | Proves whether the deployed app is reading DynamoDB or preview data |

## H0 Proof Boundary

The current deployed app is allowed to show preview data, but the final submission must not rely on preview mode.

Final proof requires:

```text
/api/health -> database=dynamodb
/api/opportunities -> source=dynamodb:<table>
/api/evidence -> at least one live evidence row
/api/payout-tasks -> at least one live payout task
/api/h0-bundle -> one keyed item collection for the H0 lane
/api/action-queue -> one keyed item collection for open follow-up tasks
AWS Console screenshot -> Storage Configuration / DynamoDB table
```

## AWS Credit Use Without Waste

The current extra AWS proof uses more DynamoDB reads and writes, not broad new services. It adds a second production access pattern through `WORK_QUEUE#open`, while keeping the same on-demand table, server-side encryption, and least-privilege runtime credentials.

A direct `UpdateTable` attempt with the runtime IAM user was denied. That is the desired boundary: the deployed app can read and write its operating data, but it cannot mutate table structure.
