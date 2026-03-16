import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
} from "@/lib/api-helpers";
import { auth } from "@/lib/auth";

export async function GET(_req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return unauthorizedResponse();

    const predictions = await prisma.prediction.findMany({
      where: { userId: session.user.id },
      include: {
        match: {
          include: {
            homeTeam: true,
            awayTeam: true,
            competition: true,
          },
        },
      },
      orderBy: { submittedAt: "desc" },
    });

    return successResponse(predictions);
  } catch (err) {
    console.error("[predictions GET]", err);
    return errorResponse("Erro ao buscar palpites", 500);
  }
}
