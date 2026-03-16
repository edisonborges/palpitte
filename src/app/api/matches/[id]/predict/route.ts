import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  notFoundResponse,
} from "@/lib/api-helpers";
import { auth } from "@/lib/auth";
import { predictionSchema } from "@/lib/validations";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) return unauthorizedResponse();

    const { id: matchId } = await params;
    const body = await req.json();
    const parsed = predictionSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0].message);
    }

    const { homeScore, awayScore, bonusAnswers } = parsed.data;

    const match = await prisma.match.findUnique({ where: { id: matchId } });
    if (!match) return notFoundResponse("Partida");

    if (match.status !== "SCHEDULED") {
      return errorResponse("Partida não está disponível para palpites");
    }

    if (new Date() >= match.closedAt) {
      return errorResponse("Prazo para palpites encerrado");
    }

    const prediction = await prisma.prediction.upsert({
      where: { userId_matchId: { userId: session.user.id, matchId } },
      create: {
        userId: session.user.id,
        matchId,
        homeScore,
        awayScore,
        bonusAnswers: bonusAnswers ? (bonusAnswers as object) : undefined,
        tenantId: session.user.tenantId ?? undefined,
      },
      update: {
        homeScore,
        awayScore,
        bonusAnswers: bonusAnswers ? (bonusAnswers as object) : undefined,
        submittedAt: new Date(),
      },
    });

    return successResponse(prediction, 201);
  } catch (err) {
    console.error("[predict POST]", err);
    return errorResponse("Erro ao salvar palpite", 500);
  }
}
