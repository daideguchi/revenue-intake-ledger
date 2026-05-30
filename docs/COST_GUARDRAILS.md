# Zero-Cost Guardrails

This project must not create paid AWS resources.

H0 needs real AWS database proof, but the proof should be small, controlled, and easy to delete.
DD's rule is stricter than normal approval:

```text
Out-of-pocket cost is not allowed.
Do not create AWS resources if real charges could land on DD.
```

## Current State

```text
AWS CLI on this Mac: not installed in the current shell check on 2026-05-31 JST
AWS credentials in this shell: do not assume present; verify through safe scripts before any AWS write
H0 AWS/v0 credit email: received on 2026-05-30 JST
Raw credit codes: stored only in ignored local secrets file
AWS credit redemption: applied and visible in AWS Billing
AWS billing credits view: active credit count 1, total balance $100.00, usage $0.00 as of 2026-05-30 JST
v0 credit redemption: pending
Public app database: dynamodb
Final H0 submission: submitted
Current extra AWS usage: DynamoDB work-queue records only, no new broad AWS service
```

## Before Any AWS Resource Is Created

- Confirm the AWS account to use.
- Confirm the H0 AWS promotional credit is still visible on the same account.
- Confirm that the selected DynamoDB proof path will not create out-of-pocket spend.
- Monitor AWS Cost Explorer.
- Create or confirm a budget alert as an additional warning only.
- Keep the DynamoDB proof table small.
- Do not enable extra paid features.
- Take screenshots only after the budget boundary is clear.

If any of those checks are unclear, stop. Keep the product in preview mode and do not submit H0.

## Issued Credit Boundary

The Devpost email says:

```text
AWS Promotional Credits: $100
v0 Credits: $30
Additional charges beyond the $100 AWS credit are the participant's responsibility.
Monitor usage in AWS Cost Explorer.
```

That means the credit email helps, but it is not enough by itself. The AWS credit is now visible in Billing, but the zero-cost path still requires continued usage monitoring and a deliberately tiny proof setup.

Do not commit raw credit codes. They belong only in:

```text
/Users/dd/000_AI組織/.個人フォルダ/機密/h0_aws_v0_credits.env
```

## DynamoDB Template Boundary

The CloudFormation template uses:

```text
BillingMode: PAY_PER_REQUEST
SSE: enabled
Point-in-time recovery: disabled by default
```

PITR can be enabled with `EnablePointInTimeRecovery=true`, but do not do that for the H0 proof run.

## Current AWS Credit Use

The safe way to use the `$100` credit is not to burn it. It is to show a real database-backed operating pattern.

Current additional proof:

```text
Extra records: open action queue items
Access pattern: PK = WORK_QUEUE#open
Public API: /api/action-queue
Cost shape: tiny DynamoDB on-demand reads/writes and storage
No extra server, no broad managed service, no PITR, no global table
```

The runtime IAM user was tested against a table-structure change and received `AccessDeniedException` for `dynamodb:UpdateTable`. Keep that boundary. The production app should not have admin-level database privileges.

## Approved Proof Flow

This proof flow has been run for the minimal H0 table:

```bash
aws cloudformation deploy \
  --stack-name revenue-intake-ledger \
  --template-file infra/dynamodb-table.cloudformation.yml \
  --parameter-overrides TableName=RevenueIntakeLedger EnablePointInTimeRecovery=false \
  --capabilities CAPABILITY_NAMED_IAM

AWS_REGION=us-east-1 DYNAMODB_TABLE=RevenueIntakeLedger npm run seed:dynamodb
AWS_REGION=us-east-1 DYNAMODB_TABLE=RevenueIntakeLedger npm run verify:dynamodb
```

## Cleanup Command

After the demo proof is captured, delete the stack if DD does not want to keep it running:

```bash
aws cloudformation delete-stack --stack-name revenue-intake-ledger
```

Do not mark cleanup as complete until AWS confirms the stack is gone.

## If Zero-Cost Proof Cannot Be Guaranteed

Do not provision more AWS services. Keep the current H0 submission on the existing DynamoDB proof path unless the new service clearly improves the judge story.

The honest state is:

```text
Submitted, AWS credit applied, Vercel production reads DynamoDB, work queue proof added, monitor usage and result date.
```
