# H0 Submission Checklist

This is the final gate. Do not submit before every required proof item is real.

## Public Links

```text
GitHub: https://github.com/daideguchi/revenue-intake-ledger
Vercel preview: https://revenue-intake-ledger-public.vercel.app/
Vercel Team ID: team_qU2jjQVZXVCwq9lXlmxu4aaM
Vercel Team: daideguchis-projects
```

## Current Boundary

```text
Current public API says database=preview-seed.
This is not final-submission-ready.
```

## Must Be True Before Final Submit

- [ ] AWS budget limit checked
- [ ] AWS billing alert checked
- [ ] DynamoDB table created
- [ ] `npm run seed:dynamodb` passed
- [ ] `npm run verify:dynamodb` passed
- [ ] Vercel env vars set for AWS/DynamoDB
- [ ] Vercel production `/api/health` says `database=dynamodb`
- [ ] Vercel production `/api/opportunities` says `source=dynamodb:<table>`
- [ ] AWS storage configuration screenshot captured
- [ ] Architecture diagram attached
- [ ] 3-5 minute demo video recorded
- [ ] Devpost final page shows `Project submitted!`

## AWS Commands After Human Approval

```bash
aws cloudformation deploy \
  --stack-name revenue-intake-ledger \
  --template-file infra/dynamodb-table.cloudformation.yml \
  --parameter-overrides TableName=RevenueIntakeLedger \
  --capabilities CAPABILITY_NAMED_IAM

AWS_REGION=us-east-1 DYNAMODB_TABLE=RevenueIntakeLedger npm run seed:dynamodb
AWS_REGION=us-east-1 DYNAMODB_TABLE=RevenueIntakeLedger npm run verify:dynamodb
```

## Vercel Environment Variables

```text
AWS_REGION
DYNAMODB_TABLE
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
```

Use Vercel project settings or CLI. Never commit real values.
