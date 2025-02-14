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

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = await params;
  const emailID = await db.query.user.findFirst({
    where: eq(user.email, id),
  });
  if (emailID == undefined) throw Error();
  const finishedDiagnosis = await getFinishedDiagnosis(db, 1);
  const allDiagnosisScores: JSONData[] = [];
  finishedDiagnosis.map((current, index) => {
    const section = current.section;
    const introduction = current.clinicalCase;
    var score = "";
    current.blockMessages.map((message, index) => {
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
