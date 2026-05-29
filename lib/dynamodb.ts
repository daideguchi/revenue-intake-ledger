import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import {
  getLedgerHealth,
  seedEvidenceItems,
  seedOpportunities,
  seedPayoutTasks,
  type EvidenceItem,
  type PayoutTask,
  type RevenueOpportunity
} from "./revenue-data";

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
      TableName: health.tableName,
      FilterExpression: "#entity = :entity",
      ExpressionAttributeNames: {
        "#entity": "entity"
      },
      ExpressionAttributeValues: {
        ":entity": "opportunity"
      }
    })
  );

  return {
    items: (response.Items || []) as RevenueOpportunity[],
    source: `dynamodb:${health.tableName}`
  };
}

export async function listEvidenceItems(): Promise<{ items: EvidenceItem[]; source: string }> {
  const health = getLedgerHealth();

  if (health.database !== "dynamodb" || !health.tableName) {
    return { items: seedEvidenceItems, source: "preview-seed" };
  }

  const response = await getDocumentClient().send(
    new ScanCommand({
      TableName: health.tableName,
      FilterExpression: "#entity = :entity",
      ExpressionAttributeNames: {
        "#entity": "entity"
      },
      ExpressionAttributeValues: {
        ":entity": "evidence"
      }
    })
  );

  return {
    items: (response.Items || []) as EvidenceItem[],
    source: `dynamodb:${health.tableName}`
  };
}

export async function listPayoutTasks(): Promise<{ items: PayoutTask[]; source: string }> {
  const health = getLedgerHealth();

  if (health.database !== "dynamodb" || !health.tableName) {
    return { items: seedPayoutTasks, source: "preview-seed" };
  }

  const response = await getDocumentClient().send(
    new ScanCommand({
      TableName: health.tableName,
      FilterExpression: "#entity = :entity",
      ExpressionAttributeNames: {
        "#entity": "entity"
      },
      ExpressionAttributeValues: {
        ":entity": "payout_task"
      }
    })
  );

  return {
    items: (response.Items || []) as PayoutTask[],
    source: `dynamodb:${health.tableName}`
  };
}
