import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  successResponse,
  errorResponse,
  notFoundResponse,
} from "@/lib/api-helpers";
import { auth } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();

    const match = await prisma.match.findUnique({
      where: { id },
      include: {
        homeTeam: true,
        awayTeam: true,
        competition: true,
        bonusQuestions: true,
      },
    });

    if (!match) return notFoundResponse("Partida");

    let userPrediction = null;
    if (session?.user?.id) {
      userPrediction = await prisma.prediction.findUnique({
        where: { userId_matchId: { userId: session.user.id, matchId: id } },
      });
    }

    return successResponse({ ...match, userPrediction });
  } catch (err) {
    console.error("[match GET]", err);
    return errorResponse("Erro ao buscar partida", 500);
  }
}
