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

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "20");

  try {
    const tenant = await prisma.tenant.findFirst({
      where: { users: { some: { id: session.user.id } } },
    });
    if (!tenant) return errorResponse("Tenant não encontrado", 404);

    const [boloes, total] = await Promise.all([
      prisma.bolao.findMany({
        where: { tenantId: tenant.id },
        include: {
          _count: { select: { members: true } },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.bolao.count({ where: { tenantId: tenant.id } }),
    ]);

    // Fetch creators
    const creatorIds = [...new Set(boloes.map((b) => b.createdById))];
    const creators = await prisma.user.findMany({
      where: { id: { in: creatorIds } },
      select: { id: true, name: true },
    });
    const creatorMap = Object.fromEntries(creators.map((c) => [c.id, c]));

    const data = boloes.map((b) => ({
      ...b,
      owner: creatorMap[b.createdById] ?? null,
      membersCount: b._count.members,
      _count: undefined,
    }));

    return successResponse({
      boloes: data,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch {
    return errorResponse("Erro ao buscar bolões");
  }
}
