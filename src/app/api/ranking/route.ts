import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-helpers";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") ?? "global";
    const limit = parseInt(searchParams.get("limit") ?? "50");
    const page = parseInt(searchParams.get("page") ?? "1");

    const orderBy =
      type === "weekly"
        ? { weeklyPoints: "desc" as const }
        : type === "monthly"
        ? { monthlyPoints: "desc" as const }
        : { totalPoints: "desc" as const };

    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: { role: "USER", status: "ACTIVE" },
        select: {
          id: true,
          name: true,
          avatarUrl: true,
          favoriteTeam: true,
          totalPoints: true,
          weeklyPoints: true,
          monthlyPoints: true,
          globalRank: true,
          _count: { select: { predictions: true } },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.user.count({ where: { role: "USER", status: "ACTIVE" } }),
    ]);

    const ranked = users.map((u, idx) => ({
      ...u,
      position: skip + idx + 1,
    }));

    let userPosition = null;
    if (session?.user?.id) {
      const userIndex = ranked.findIndex((u) => u.id === session.user?.id);
      if (userIndex >= 0) {
        userPosition = ranked[userIndex];
      } else {
        const dbUser = await prisma.user.findUnique({
          where: { id: session.user.id },
          select: {
            id: true,
            name: true,
            totalPoints: true,
            weeklyPoints: true,
            monthlyPoints: true,
            globalRank: true,
          },
        });
        userPosition = dbUser;
      }
    }

    return successResponse({ users: ranked, total, page, userPosition });
  } catch (err) {
    console.error("[ranking GET]", err);
    return errorResponse("Erro ao buscar ranking", 500);
  }
}
