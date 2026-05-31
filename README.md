# Revenue Intake Ledger

H0 build lane for **Hack the Zero Stack with Vercel v0 and AWS Databases**.

## What It Does

Revenue Intake Ledger is a simple checklist board for the work after you build with AI.

It is for solo builders who use AI to launch many projects at once.

Their problem: after launch, proof links, result dates, cloud-cost checks, and payment forms get scattered.

The solution: one board keeps each project, proof link, deadline, and next step together.

Plain explanation:

```text
Who: solo builders using AI to launch many small products.
Problem: after launch, important follow-up work gets scattered.
Solution: one board keeps proof, deadlines, cost checks, and next steps together.
```

It tracks:

- what has actually been submitted
- what is blocked
- what proof exists
- when winners are announced
- what payment paperwork is needed
- when money or credits may arrive

Japanese:

```text
AIで作った後の「証拠・締切・費用・入金確認」を忘れないための管理ボードです。
```

## H0 Status

```text
Devpost registration: done
AWS/v0 credit request: approved
AWS credit redemption: applied and visible in AWS Billing
v0 credit redemption: optional / not used for this final submission
Vercel preview: https://revenue-intake-ledger-public.vercel.app/
GitHub: https://github.com/daideguchi/revenue-intake-ledger
Vercel Team ID: team_qU2jjQVZXVCwq9lXlmxu4aaM
Devpost submission: https://devpost.com/software/revenue-intake-ledger
Product submission: submitted
AWS DB proof: connected and verified
Demo video: https://youtu.be/tYj9V2s5bDY
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

In the agent era, the database is the memory that keeps humans and agents aligned after the first launch.

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
- `/api/h0-bundle`
- `/api/action-queue`
- `/api/evidence`
- `/api/payout-tasks`
- `/api/proof`

Strongest H0 proof route:

```text
/api/h0-bundle
```

This route loads one complete DynamoDB item collection for `PK = OPPORTUNITY#h0`: the opportunity profile, evidence records, payout tasks, and status history.

Additional AWS-credit proof route:

```text
/api/action-queue
```

This route loads open winner, payout, and AWS-usage follow-up tasks from the materialized item collection `PK = WORK_QUEUE#open`. It proves a second DynamoDB access pattern without adding broad AWS services or expanding runtime IAM privileges.

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

This boundary has now been cleared for the minimal DynamoDB proof table. Keep monitoring usage and do not add broader AWS services unless they clearly improve the submission.

The current credit-backed improvement is intentionally small: extra DynamoDB records and the `WORK_QUEUE#open` access pattern. A direct attempt to add a new table index with the runtime IAM user was denied, which confirms the deployed app is using least-privilege credentials. The implementation therefore uses the existing table key design instead of expanding runtime permissions.

## Submission Checklist

- Published Vercel URL
- Vercel Team ID
- DynamoDB table live proof: done
- DynamoDB action queue proof: done
- AWS storage configuration screenshot: captured
- Architecture diagram
- 3-5 minute demo video: https://youtu.be/tYj9V2s5bDY
- Devpost finalization page showing submitted state: done

Submitted project:

```text
https://devpost.com/software/revenue-intake-ledger
```

The active post-submit job is monitoring: award date, AWS usage, organizer messages, and any payout paperwork.
