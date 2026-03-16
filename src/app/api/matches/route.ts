import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-helpers";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const competition = searchParams.get("competition");
    const date = searchParams.get("date");
    const tenantId = req.headers.get("x-tenant-id");

    const now = new Date();
    let dateFilter = {};

    if (date === "today") {
      const start = new Date(now);
      start.setHours(0, 0, 0, 0);
      const end = new Date(now);
      end.setHours(23, 59, 59, 999);
      dateFilter = { scheduledAt: { gte: start, lte: end } };
    } else if (date === "tomorrow") {
      const start = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setHours(23, 59, 59, 999);
      dateFilter = { scheduledAt: { gte: start, lte: end } };
    } else if (date === "week") {
      const end = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      dateFilter = { scheduledAt: { gte: now, lte: end } };
    }

    const where: Record<string, unknown> = {
      ...(status ? { status } : {}),
      ...(competition ? { competition: { slug: competition } } : {}),
      ...dateFilter,
      ...(tenantId ? {} : {}),
    };

    const matches = await prisma.match.findMany({
      where,
      include: {
        homeTeam: true,
        awayTeam: true,
        competition: true,
        bonusQuestions: true,
      },
      orderBy: { scheduledAt: "asc" },
    });

    let matchesWithPredictions = matches as Array<typeof matches[0] & { userPrediction?: unknown }>;

    if (session?.user?.id) {
      const predictions = await prisma.prediction.findMany({
        where: {
          userId: session.user.id,
          matchId: { in: matches.map((m) => m.id) },
        },
      });

      const predictionMap = new Map(predictions.map((p) => [p.matchId, p]));
      matchesWithPredictions = matches.map((m) => ({
        ...m,
        userPrediction: predictionMap.get(m.id) ?? null,
      }));
    }

    return successResponse(matchesWithPredictions);
  } catch (err) {
    console.error("[matches GET]", err);
    return errorResponse("Erro ao buscar partidas", 500);
  }
}
