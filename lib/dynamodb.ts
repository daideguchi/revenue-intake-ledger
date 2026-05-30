import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import {
  getLedgerHealth,
  seedEvidenceItems,
  seedOpportunities,
  seedPayoutTasks,
  seedStatusEvents,
  type EvidenceItem,
  type PayoutTask,
  type RevenueOpportunity,
  type StatusEvent
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

export async function listStatusEvents(): Promise<{ items: StatusEvent[]; source: string }> {
  const health = getLedgerHealth();

  if (health.database !== "dynamodb" || !health.tableName) {
    return { items: seedStatusEvents, source: "preview-seed" };
  }

  const response = await getDocumentClient().send(
    new ScanCommand({
      TableName: health.tableName,
      FilterExpression: "#entity = :entity",
      ExpressionAttributeNames: {
        "#entity": "entity"
      },
      ExpressionAttributeValues: {
        ":entity": "status_event"
      }
    })
  );

  return {
    items: ((response.Items || []) as StatusEvent[]).sort((a, b) => b.at.localeCompare(a.at)),
    source: `dynamodb:${health.tableName}`
  };
}

export async function getOpportunityBundle(opportunityId: string) {
  const health = getLedgerHealth();
  const pk = `OPPORTUNITY#${opportunityId}`;

  if (health.database !== "dynamodb" || !health.tableName) {
    return {
      source: "preview-seed",
      pk,
      opportunity: seedOpportunities.find((item) => item.id === opportunityId) || null,
      evidence: seedEvidenceItems.filter((item) => item.opportunityId === opportunityId),
      payoutTasks: seedPayoutTasks.filter((item) => item.opportunityId === opportunityId),
      statusEvents: seedStatusEvents.filter((item) => item.opportunityId === opportunityId)
    };
  }

  const response = await getDocumentClient().send(
    new QueryCommand({
      TableName: health.tableName,
      KeyConditionExpression: "#pk = :pk",
      ExpressionAttributeNames: {
        "#pk": "pk"
      },
      ExpressionAttributeValues: {
        ":pk": pk
      }
    })
  );

  const rows = response.Items || [];

  return {
    source: `dynamodb:${health.tableName}`,
    pk,
    opportunity: (rows.find((item) => item.entity === "opportunity") as RevenueOpportunity | undefined) || null,
    evidence: rows.filter((item) => item.entity === "evidence") as EvidenceItem[],
    payoutTasks: rows.filter((item) => item.entity === "payout_task") as PayoutTask[],
    statusEvents: (rows.filter((item) => item.entity === "status_event") as StatusEvent[]).sort((a, b) =>
      b.at.localeCompare(a.at)
    )
  };
}
