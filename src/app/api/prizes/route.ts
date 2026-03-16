import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-helpers";

export async function GET(_req: NextRequest) {
  const session = await auth();

  try {
    const prizes = await prisma.prize.findMany({
      where: { isActive: true },
      orderBy: { pointsCost: "asc" },
    });

    const userPoints = session?.user?.id
      ? (
          await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { totalPoints: true },
          })
        )?.totalPoints ?? 0
      : 0;

    const data = prizes.map((p) => ({
      ...p,
      canRedeem: userPoints >= p.pointsCost && (p.stock === null || p.stock > 0),
    }));

    return successResponse({ prizes: data, userPoints });
  } catch {
    return errorResponse("Erro ao buscar prêmios");
  }
}
