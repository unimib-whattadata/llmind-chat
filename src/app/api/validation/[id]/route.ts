import { NextRequest, NextResponse } from "next/server";
import { db } from "~/server/db";
import { user } from "~/server/db/schema";
import { getFinishedDiagnosis } from "~/server/api/routers/block/queries";
import { eq } from "drizzle-orm";

type JSONData = {
  section: string;
  introduction: string;
  score: string;
};

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop(); // Extracts the `[id]` parameter

  if (!id) {
    return NextResponse.json(
      { error: "Missing ID parameter" },
      { status: 400 },
    );
  }
  const emailID = await db.query.user.findFirst({
    where: eq(user.email, id),
  });
  if (emailID == undefined) throw Error();
  const finishedDiagnosis = await getFinishedDiagnosis(db, emailID.id);
  const allDiagnosisScores: JSONData[] = [];
  finishedDiagnosis.map((current) => {
    const section = current.section;
    const introduction = current.clinicalCase;
    var score = "";
    current.blockMessages.map((message) => {
      if (message.orderNumber == 5) {
        score = message.text;
      }
    });
    allDiagnosisScores.push({
      introduction: introduction,
      score: score,
      section: section,
    });
  });
  return NextResponse.json(allDiagnosisScores);
}
