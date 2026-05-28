import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { getLedgerHealth, seedOpportunities, type RevenueOpportunity } from "./revenue-data";

let docClient: DynamoDBDocumentClient | null = null;

function getDocumentClient() {
  if (docClient) return docClient;
  const client = new DynamoDBClient({ region: process.env.AWS_REGION || "us-east-1" });
  docClient = DynamoDBDocumentClient.from(client);
  return docClient;
}

export async function listOpportunities(): Promise<{ items: RevenueOpportunity[]; source: string }> {
  const health = getLedgerHealth();

  if (health.database !== "dynamodb" || !health.tableName) {
    return { items: seedOpportunities, source: "preview-seed" };
  }

  const response = await getDocumentClient().send(
    new ScanCommand({
      TableName: health.tableName
    })
  );

  return {
    items: (response.Items || []) as RevenueOpportunity[],
    source: `dynamodb:${health.tableName}`
  };
}
