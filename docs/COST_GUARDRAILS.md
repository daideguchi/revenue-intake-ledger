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
AWS CLI on this Mac: not installed as of 2026-05-29 JST
AWS credentials in this shell: not present
Public app database: preview-seed
Final H0 submission: not ready
```

## Before Any AWS Resource Is Created

- Confirm the AWS account to use.
- Confirm that H0/AWS promotional credits or a clearly free route are active for the account.
- Confirm that the selected DynamoDB proof path will not create out-of-pocket spend.
- Create or confirm a budget alert as an additional warning only.
- Keep the DynamoDB proof table small.
- Do not enable extra paid features.
- Take screenshots only after the budget boundary is clear.

If any of those checks are unclear, stop. Keep the product in preview mode and do not submit H0.

## DynamoDB Template Boundary

The CloudFormation template uses:

```text
BillingMode: PAY_PER_REQUEST
SSE: enabled
Point-in-time recovery: disabled by default
```

PITR can be enabled with `EnablePointInTimeRecovery=true`, but do not do that for the H0 proof run.

## Approved Proof Flow

Run only after the zero-cost checks above are proven:

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

Do not provision AWS. Do not submit H0 as a completed project.

The honest state is:

```text
Registered, credit request submitted, Vercel preview live, AWS proof blocked by zero-cost policy.
```
