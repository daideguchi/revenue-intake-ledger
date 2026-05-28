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
AWS/v0 credit request: submitted
Product submission: not submitted yet
AWS DB proof: not connected yet
```

Do not call this H0-ready until DynamoDB is connected and the AWS storage configuration screenshot exists.

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

## Local Development

```bash
npm install
npm run dev
npm run verify
npm run build
```

## Cost Boundary

AWS CLI is not installed on this Mac as of 2026-05-29 JST.
The official H0 credits request has been submitted, but credits are not guaranteed yet.

Before connecting AWS:

- create or confirm the AWS account
- set a budget limit
- set a billing alert
- use the smallest DynamoDB setup that proves real storage
- capture screenshots only after the cost boundary is clear

## Submission Checklist

- Published Vercel URL
- Vercel Team ID
- DynamoDB table live proof
- AWS storage configuration screenshot
- Architecture diagram
- 3-5 minute demo video
- Devpost finalization page showing submitted state

Until all of this exists, this is a build lane, not a submitted project.
