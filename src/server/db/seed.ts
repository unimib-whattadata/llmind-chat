// src/server/db/seed.ts
import { drizzle } from "drizzle-orm/node-postgres";
import { diagnosis, message } from "./schema";
import diagnosisJSON from "./diagnosis.json";
import pg from "pg";
import { env } from "~/env";
const { Pool } = pg;

export const seedDiagnosis = async (userId: number) => {
  console.log("Seed start");
  const client = new Pool({
    connectionString: `postgresql://postgres:${env.POSTGRESQL_PASS}@${env.POSTGRES_HOST}:${env.POSTGRES_PORT}/${env.POSTGRES_DB}`,
  });
  const db = drizzle(client);
  diagnosisJSON.map(async (value, index) => {
    const diagnosisId = await db
      .insert(diagnosis)
      .values({
        clinicalCase: value.clinical_case,
        diagnosis: value.diagnosis,
        currentOperation: "VALIDATION",
        userId: userId,
      })
      .returning({ insertedId: diagnosis.id });
    const currentDiagnosis = diagnosisId[0];
    if (currentDiagnosis == undefined) return;
    await db.insert(message).values([
      {
        text: value.clinical_case,
        messageType: "CLINICAL",
        timestamp: new Date(),
        role: "AI",
        diagnosisBlock: currentDiagnosis.insertedId,
        orderNumber: 1,
        hasValidation: false,
        title: `Clinical Case ${currentDiagnosis.insertedId}`,
      },
      {
        text: value.diagnosis,
        messageType: "DIAGNOSIS",
        timestamp: new Date(),
        role: "AI",
        diagnosisBlock: currentDiagnosis.insertedId,
        orderNumber: 2,
        hasValidation: true,
        title: `Diagnosis ${currentDiagnosis.insertedId}`,
      },
    ]);
  });
  console.log("Seed done");
};
