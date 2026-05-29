# Revenue Intake Ledger

H0 build lane for **Hack the Zero Stack with Vercel v0 and AWS Databases**.

## What It Does

Revenue Intake Ledger helps small AI builders and SaaS teams manage revenue opportunities after the exciting part of shipping is over.

It tracks:

- what has actually been submitted
- what is blocked
- what proof exists
- when winners are announced
- what payment paperwork is needed
- when money or credits may arrive

Japanese:

```text
小さなAIチームが、応募・証拠・賞金条件・入金予定を一つの画面で追える収益管理ツールです。
```

## H0 Status

```text
Devpost registration: done
AWS/v0 credit request: approved
AWS credit redemption: applied and visible in AWS Billing
v0 credit redemption: pending
Vercel preview: https://revenue-intake-ledger-public.vercel.app/
GitHub: https://github.com/daideguchi/revenue-intake-ledger
Vercel Team ID: team_qU2jjQVZXVCwq9lXlmxu4aaM
Devpost submission: https://devpost.com/software/revenue-intake-ledger
Product submission: submitted
AWS DB proof: connected and verified
Demo video: https://youtu.be/ElNmYpwx5x4
Cost policy: no out-of-pocket spend allowed
```

H0 is now submitted. Keep the AWS proof setup tiny and monitored because promotional credits are not a hard spending cap.
The issued credit codes are stored only in the local ignored secrets file and must never be committed or pasted into public surfaces.

## H0 Fit

H0 asks for a real full-stack app using Vercel or v0.app with one of the approved AWS databases.

This project uses the database as the product memory:

- opportunities
- evidence items
- prize terms
- payout tasks
- status history
- AI suggestions

Current preview mode uses bundled seed data. Production mode switches to DynamoDB when these environment variables are set:

```text
AWS_REGION
DYNAMODB_TABLE
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
```

API routes:

- `/api/health`
- `/api/opportunities`
- `/api/evidence`
- `/api/payout-tasks`
- `/api/proof`

Architecture: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
Final gate: [docs/SUBMISSION_CHECKLIST.md](docs/SUBMISSION_CHECKLIST.md)
Cost guardrails: [docs/COST_GUARDRAILS.md](docs/COST_GUARDRAILS.md)
Demo video workflow: [docs/DEMO_VIDEO.md](docs/DEMO_VIDEO.md)

## Local Development

```bash
npm install
npm run dev
npm run verify
npm run build
npm audit
```

AWS proof commands used after the no-out-of-pocket route was confirmed:

```bash
aws cloudformation deploy \
  --stack-name revenue-intake-ledger \
  --template-file infra/dynamodb-table.cloudformation.yml \
  --parameter-overrides TableName=RevenueIntakeLedger EnablePointInTimeRecovery=false \
  --capabilities CAPABILITY_NAMED_IAM

AWS_REGION=us-east-1 DYNAMODB_TABLE=RevenueIntakeLedger npm run seed:dynamodb
AWS_REGION=us-east-1 DYNAMODB_TABLE=RevenueIntakeLedger npm run verify:dynamodb
```

## Cost Boundary

AWS CLI is not installed on this Mac as of 2026-05-29 JST.
The official H0 credits email arrived on 2026-05-30 JST with `$100` AWS Promotional Credits and `$30` v0 credits. The raw codes are intentionally not in this repository.

Important expiration dates:

- AWS code redeem by `2026-07-31`; AWS credits expire `2026-12-31`.
- v0 code redeem by `2026-07-13`; v0 credits expire 6 weeks after redemption.

Before connecting AWS:

- create or confirm the AWS account
- confirm the AWS promotional credit is still active on the account that will run DynamoDB
- confirm that the proof path will not create out-of-pocket spend
- monitor AWS Cost Explorer
- set a billing alert as an extra warning
- use the smallest DynamoDB setup that proves real storage
- keep point-in-time recovery off for the proof table unless explicitly approved
- capture screenshots only after the cost boundary is clear

This boundary has now been cleared for the minimal DynamoDB proof table. Keep monitoring usage and do not add broader AWS services unless explicitly needed.

## Submission Checklist

- Published Vercel URL
- Vercel Team ID
- DynamoDB table live proof: done
- AWS storage configuration screenshot: captured
- Architecture diagram
- 3-5 minute demo video: https://youtu.be/ElNmYpwx5x4
- Devpost finalization page showing submitted state: done

Submitted project:

```text
https://devpost.com/software/revenue-intake-ledger
```

The active post-submit job is monitoring: award date, AWS usage, organizer messages, and any payout paperwork.
