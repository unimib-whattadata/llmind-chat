// src/server/db/seed.ts
import { drizzle } from "drizzle-orm/node-postgres";
import { diagnosis, message } from "./schema";
import diagnosisJSON from "./diagnosis.json";
import pg from "pg";
import { env } from "~/env";
const { Pool } = pg;

export const seedDiagnosis = async (userId: number) => {
  const client = new Pool({
    connectionString: `postgresql://postgres:${env.POSTGRESQL_PASS}@${env.POSTGRES_HOST}:${env.POSTGRES_PORT}/${env.POSTGRES_DB}`,
  });
  const db = drizzle(client);
  console.log("seed start");
  diagnosisJSON.map(async (value) => {
    const diagnosisId = await db
      .insert(diagnosis)
      .values({
        title: value.title,
        section: value.section,
        clinicalCase: value.clinical_case,
        diagnosis: value.diagnosis,
        llmind_diagnosis: value.llmind_diagnosis,
        currentOperation: "SCORE",
        userId: userId,
      })
      .returning({ insertedId: diagnosis.id });
    const currentDiagnosis = diagnosisId[0];
    if (currentDiagnosis == undefined) return;
    // Clinical Case
    await db
      .insert(message)
      .values([{
        text: value.clinical_case,
        messageType: "CLINICAL",
        timestamp: new Date(),
        role: "AI",
        diagnosisBlock: currentDiagnosis.insertedId,
        orderNumber: 1,
        title: `Clinical Case`,
        hasSkip: false,
      },
      {
        messageType: "DEFAULT",
        role: "AI",
        text: '**To what extent does the model\'s response provide information relevant to the clinician in determining the correct diagnosis?**\n\nPlease rate on a scale of 0 to 1, where 0 indicates "not at all relevant" and 1 indicates "extremely relevant". You may use decimal values (e.g., 0.3, 0.8).',
        timestamp: new Date(),
        orderNumber: 4,
        diagnosisBlock: currentDiagnosis.insertedId,
        hasSkip: false,
      }])
  });
  console.log("seed end");
};
