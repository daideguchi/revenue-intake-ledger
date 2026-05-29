# Cost Guardrails

This project must not create paid AWS resources automatically.

H0 needs real AWS database proof, but the proof should be small, controlled, and easy to delete.

## Current State

```text
AWS CLI on this Mac: not installed as of 2026-05-29 JST
AWS credentials in this shell: not present
Public app database: preview-seed
Final H0 submission: not ready
```

## Before Any AWS Resource Is Created

- Confirm the AWS account to use.
- Confirm billing is healthy.
- Create or confirm a budget alert.
- Keep the DynamoDB proof table small.
- Do not enable extra paid features unless DD explicitly approves them.
- Take screenshots only after the budget boundary is clear.

## DynamoDB Template Boundary

The CloudFormation template uses:

```text
BillingMode: PAY_PER_REQUEST
SSE: enabled
Point-in-time recovery: disabled by default
```

PITR can be enabled with `EnablePointInTimeRecovery=true`, but do not do that for the H0 proof run unless DD approves it.

## Approved Proof Flow

Run only after human approval:

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
