import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
} from "@/lib/api-helpers";
import { UserRole } from "@prisma/client";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== UserRole.RESELLER) {
    return unauthorizedResponse();
  }

  try {
    const tenant = await prisma.tenant.findFirst({
      where: { users: { some: { id: session.user.id } } },
    });
    if (!tenant) return errorResponse("Tenant não encontrado", 404);

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      activeUsers7d,
      newUsers30d,
      totalBoloes,
      totalPredictions,
      totalRedemptions,
    ] = await Promise.all([
      prisma.user.count({ where: { tenantId: tenant.id, role: UserRole.USER } }),
      prisma.user.count({
        where: {
          tenantId: tenant.id,
          role: UserRole.USER,
          predictions: { some: { submittedAt: { gte: sevenDaysAgo } } },
        },
      }),
      prisma.user.count({
        where: {
          tenantId: tenant.id,
          role: UserRole.USER,
          createdAt: { gte: thirtyDaysAgo },
        },
      }),
      prisma.bolao.count({ where: { tenantId: tenant.id } }),
      prisma.prediction.count({
        where: {
          user: { tenantId: tenant.id },
          submittedAt: { gte: thirtyDaysAgo },
        },
      }),
      prisma.prizeRedemption.count({
        where: {
          user: { tenantId: tenant.id },
          redeemedAt: { gte: thirtyDaysAgo },
        },
      }),
    ]);

    // Novos usuários por dia (últimos 30 dias)
    const dailySignups = await prisma.user.groupBy({
      by: ["createdAt"],
      where: {
        tenantId: tenant.id,
        role: UserRole.USER,
        createdAt: { gte: thirtyDaysAgo },
      },
      _count: true,
    });

    return successResponse({
      overview: {
        totalUsers,
        activeUsers7d,
        newUsers30d,
        totalBoloes,
        totalPredictions,
        totalRedemptions,
        engagementRate:
          totalUsers > 0
            ? Math.round((activeUsers7d / totalUsers) * 100)
            : 0,
      },
      dailySignups: dailySignups.map((d) => ({
        date: d.createdAt,
        count: d._count,
      })),
    });
  } catch {
    return errorResponse("Erro ao buscar analytics");
  }
}
