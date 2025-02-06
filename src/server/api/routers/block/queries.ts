import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { eq, and, or, asc } from "drizzle-orm";
import { diagnosis } from "~/server/db/schema";

export const getFinishedDiagnosis = async (
  db: PostgresJsDatabase<typeof import("~/server/db/schema")>,
  userToken: number,
) => {
  return await db.query.diagnosis.findMany({
    where: and(
      eq(diagnosis.userId, userToken),
      eq(diagnosis.currentOperation, "FINISHED"),
    ),
    with: {
      blockMessages: {
        orderBy: (blockMessages, { asc }) => [asc(blockMessages.orderNumber)],
      },
    },
  });
};

export const getInProgressDiagnosis = async (
  db: PostgresJsDatabase<typeof import("~/server/db/schema")>,
  userToken: number,
) => {
  return await db.query.diagnosis.findFirst({
    where: and(
      eq(diagnosis.userId, userToken),
      or(eq(diagnosis.currentOperation, "NOTE")),
    ),
    with: {
      blockMessages: {
        orderBy: (blockMessages, { asc }) => [asc(blockMessages.orderNumber)],
      },
    },
  });
};

export const getNewDiagnosis = async (
  db: PostgresJsDatabase<typeof import("~/server/db/schema")>,
  userToken: number,
) => {
  const newDiagnosis = await db.query.diagnosis.findMany({
    where: and(
      eq(diagnosis.userId, userToken),
      eq(diagnosis.currentOperation, "SCORE"),
    ),
    with: {
      blockMessages: {
        orderBy: (blockMessages, { asc }) => [asc(blockMessages.orderNumber)],
      },
    },
  });
  const firstNewDiagnosis = newDiagnosis[0];
  return firstNewDiagnosis;
};
