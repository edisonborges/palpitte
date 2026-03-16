import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  notFoundResponse,
} from "@/lib/api-helpers";
import { UserRole, UserStatus } from "@prisma/client";
import { z } from "zod";

const updateUserSchema = z.object({
  status: z.nativeEnum(UserStatus).optional(),
  totalPoints: z.number().int().min(0).optional(),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== UserRole.RESELLER) {
    return unauthorizedResponse();
  }

  const { id } = await params;

  try {
    const body = await req.json();
    const parsed = updateUserSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0].message, 400);
    }

    const tenant = await prisma.tenant.findFirst({
      where: { users: { some: { id: session.user.id } } },
    });
    if (!tenant) return errorResponse("Tenant não encontrado", 404);

    const user = await prisma.user.findFirst({
      where: { id, tenantId: tenant.id },
    });
    if (!user) return notFoundResponse("Usuário não encontrado");

    const updated = await prisma.user.update({
      where: { id },
      data: parsed.data,
      select: {
        id: true,
        name: true,
        email: true,
        totalPoints: true,
        status: true,
        createdAt: true,
      },
    });

    return successResponse({ ...updated, points: updated.totalPoints });
  } catch {
    return errorResponse("Erro ao atualizar usuário");
  }
}
