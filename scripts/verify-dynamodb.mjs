import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

const tableName = process.env.DYNAMODB_TABLE;
const region = process.env.AWS_REGION || "us-east-1";

if (!tableName) {
  throw new Error("DYNAMODB_TABLE is required");
}

const doc = DynamoDBDocumentClient.from(new DynamoDBClient({ region }));

const response = await doc.send(
  new ScanCommand({
    TableName: tableName,
    Select: "ALL_ATTRIBUTES"
  })
);

const items = response.Items || [];
const byEntity = items.reduce((acc, item) => {
  const key = item.entity || "unknown";
  acc[key] = (acc[key] || 0) + 1;
  return acc;
}, {});

if (!byEntity.opportunity || !byEntity.evidence || !byEntity.payout_task) {
  throw new Error(`DynamoDB proof incomplete: ${JSON.stringify(byEntity)}`);
}

console.log(
  `revenue_intake_ledger_dynamodb_verify_ok table=${tableName} rows=${items.length} entities=${JSON.stringify(byEntity)}`
);
