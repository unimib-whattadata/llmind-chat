// src/server/db/seed.ts
import { drizzle } from "drizzle-orm/node-postgres";
import { diagnosis, message } from "./schema";
import diagnosisJSON from "./diagnosis.json";
import pg from "pg";
import { env } from "~/env";
const { Pool } = pg;

const main = async () => {
  const client = new Pool({
    connectionString: `postgresql://postgres:${env.POSTGRESQL_PASS}@${env.POSTGRES_HOST}:${env.POSTGRES_PORT}/${env.POSTGRES_DB}`,
  });
  const db = drizzle(client);
  const data: (typeof diagnosis.$inferInsert)[] = [];
  const messages: (typeof message.$inferInsert)[] = [];
  diagnosisJSON.map((value, index) => {
    data.push({
      id: index,
      clinicalCase: value.clinical_case,
      diagnosis: value.diagnosis,
      currentOperation: "VALIDATION",
    });
    messages.push({
      text: value.clinical_case,
      messageType: "CLINICAL",
      timestamp: new Date(),
      role: "AI",
      diagnosisBlock: index,
      orderNumber: 1,
      hasValidation: false,
      title: `Clinical Case ${index + 1}`,
    });
    messages.push({
      text: value.diagnosis,
      messageType: "DIAGNOSIS",
      timestamp: new Date(),
      role: "AI",
      diagnosisBlock: index,
      orderNumber: 2,
      hasValidation: true,
      title: `Diagnosis ${index + 1}`,
    });
  });

  console.log("Seed start");
  await db.insert(diagnosis).values(data);
  await db.insert(message).values(messages);
  console.log("Seed done");
};

await main();
