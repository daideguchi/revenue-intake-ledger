import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { seedEvidenceItems, seedOpportunities, seedPayoutTasks, seedStatusEvents } from "../lib/revenue-data.ts";

const tableName = process.env.DYNAMODB_TABLE;
const region = process.env.AWS_REGION || "us-east-1";

if (!tableName) {
  throw new Error("DYNAMODB_TABLE is required");
}

const doc = DynamoDBDocumentClient.from(new DynamoDBClient({ region }));

const items = [
  ...seedOpportunities.map((item) => ({
    pk: `OPPORTUNITY#${item.id}`,
    sk: "PROFILE",
    entity: "opportunity",
    ...item
  })),
  ...seedEvidenceItems.map((item) => ({
    pk: `OPPORTUNITY#${item.opportunityId}`,
    sk: `EVIDENCE#${item.id}`,
    entity: "evidence",
    ...item
  })),
  ...seedPayoutTasks.map((item) => ({
    pk: `OPPORTUNITY#${item.opportunityId}`,
    sk: `PAYOUT#${item.id}`,
    entity: "payout_task",
    ...item
  })),
  ...seedStatusEvents.map((item) => ({
    pk: `OPPORTUNITY#${item.opportunityId}`,
    sk: `STATUS#${item.at}#${item.id}`,
    entity: "status_event",
    ...item
  }))
];

for (const item of items) {
  await doc.send(
    new PutCommand({
      TableName: tableName,
      Item: item
    })
  );
}

console.log(`revenue_intake_ledger_seed_ok table=${tableName} items=${items.length}`);
