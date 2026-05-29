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

## H0 Proof Boundary

The current deployed app is allowed to show preview data, but the final submission must not rely on preview mode.

Final proof requires:

```text
/api/health -> database=dynamodb
/api/opportunities -> source=dynamodb:<table>
/api/evidence -> at least one live evidence row
/api/payout-tasks -> at least one live payout task
AWS Console screenshot -> Storage Configuration / DynamoDB table
```
