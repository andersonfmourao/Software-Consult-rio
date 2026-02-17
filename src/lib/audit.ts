import "server-only";

import { prisma } from "@/lib/prisma";

type AuditInput = {
  userId?: string;
  action: string;
  entityType: string;
  entityId: string;
  diff: Record<string, unknown>;
};

export async function writeAuditLog(input: AuditInput) {
  await prisma.auditLog.create({
    data: {
      userId: input.userId,
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId,
      diff: input.diff
    }
  });
}
