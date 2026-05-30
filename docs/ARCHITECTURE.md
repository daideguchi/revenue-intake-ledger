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

## Query Patterns

| Route | DynamoDB access pattern | Why it matters |
|---|---|---|
| `/api/opportunities` | Filter by `entity = opportunity` for the board view | Shows every revenue lane in one operating screen |
| `/api/h0-bundle` | `Query` where `PK = OPPORTUNITY#h0` | Loads one complete submission packet: profile, proof, payout tasks, and status history |
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
AWS Console screenshot -> Storage Configuration / DynamoDB table
```
