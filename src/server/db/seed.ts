// src/server/db/seed.ts
import { drizzle } from "drizzle-orm/node-postgres";
import { diagnosis, message, clinicalMessage } from "./schema";
import diagnosisJSON from "./diagnosis.json";
import pg from "pg";
import { env } from "~/env";
const { Pool } = pg;

export const seedDiagnosis = async (userId: number) => {
  const client = new Pool({
    connectionString: `postgresql://postgres:${env.POSTGRESQL_PASS}@${env.POSTGRES_HOST}:${env.POSTGRES_PORT}/${env.POSTGRES_DB}`,
  });
  const db = drizzle(client);
  diagnosisJSON.map(async (value) => {
    const diagnosisId = await db
      .insert(diagnosis)
      .values({
        title: value.title,
        section: value.section,
        clinicalCase: value.clinical_case,
        diagnosis: value.diagnosis,
        currentOperation: "SCORE",
        userId: userId,
      })
      .returning({ insertedId: diagnosis.id });
    const currentDiagnosis = diagnosisId[0];
    if (currentDiagnosis == undefined) return;
    // Clinical Case
    const newClinicaslCase = await db
      .insert(message)
      .values({
        text: value.clinical_case,
        messageType: "CLINICAL",
        timestamp: new Date(),
        role: "AI",
        diagnosisBlock: currentDiagnosis.insertedId,
        orderNumber: 1,
        title: `Clinical Case`,
        hasSkip: false,
      })
      .returning({ insertedId: message.id });
    const newClinicaslCaseId = newClinicaslCase[0];
    if (newClinicaslCaseId == undefined) return;

    // Diagnosis
    const newDiagnosis = await db
      .insert(message)
      .values({
        text: value.diagnosis,
        messageType: "DIAGNOSIS",
        timestamp: new Date(),
        role: "AI",
        diagnosisBlock: currentDiagnosis.insertedId,
        orderNumber: 2,
        title: `Diagnosis`,
        hasSkip: false,
      })
      .returning({ insertedId: message.id });
    const newDiagnosisId = newDiagnosis[0];
    if (newDiagnosisId == undefined) return;

    // LLMind Diagnosis
    const newLLMindDiagnosis = await db
      .insert(message)
      .values({
        text: value.llmind_diagnosis,
        messageType: "MODEL-DIAGNOSIS",
        timestamp: new Date(),
        role: "AI",
        diagnosisBlock: currentDiagnosis.insertedId,
        orderNumber: 3,
        title: `LLMind Diagnosis`,
        hasSkip: false,
      })
      .returning({ insertedId: message.id });
    const newLLMindDiagnosisId = newLLMindDiagnosis[0];
    if (newLLMindDiagnosisId == undefined) return;

    await db.insert(clinicalMessage).values({
      diagnosisId: currentDiagnosis.insertedId,
      clinicalMessage: newClinicaslCaseId.insertedId,
      diagnosisMessage: newDiagnosisId.insertedId,
      diagnosisLLMindMessage: newLLMindDiagnosisId.insertedId,
    });

    await db.insert(message).values([
      {
        messageType: "DEFAULT",
        role: "AI",
        text: '**To what extent does the model\'s response provide information relevant to the clinician in determining the correct diagnosis?**\n\nPlease rate on a scale of 0 to 1, where 0 indicates "not at all relevant" and 1 indicates "extremely relevant". You may use decimal values (e.g., 0.3, 0.8).',
        timestamp: new Date(),
        orderNumber: 4,
        diagnosisBlock: currentDiagnosis.insertedId,
        hasSkip: false,
      },
    ]);
  });
};
