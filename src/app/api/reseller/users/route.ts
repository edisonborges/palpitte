import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
} from "@/lib/api-helpers";
import { UserRole, UserStatus } from "@prisma/client";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== UserRole.RESELLER) {
    return unauthorizedResponse();
  }

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "20");
  const search = searchParams.get("search") ?? "";
  const status = searchParams.get("status") as UserStatus | null;

  try {
    const tenant = await prisma.tenant.findFirst({
      where: { users: { some: { id: session.user.id } } },
    });
    if (!tenant) return errorResponse("Tenant não encontrado", 404);

    const where: Record<string, unknown> = {
      tenantId: tenant.id,
      role: UserRole.USER,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }
    if (status) where.status = status;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          totalPoints: true,
          status: true,
          createdAt: true,
          _count: { select: { predictions: true } },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.count({ where }),
    ]);

    // Normalize field name for frontend
    const normalized = users.map((u) => ({
      ...u,
      points: u.totalPoints,
      totalPoints: undefined,
    }));

    return successResponse({
      users: normalized,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch {
    return errorResponse("Erro ao buscar usuários");
  }
}
