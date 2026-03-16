import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  notFoundResponse,
} from "@/lib/api-helpers";
import { UserRole } from "@prisma/client";

async function requireReseller(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== UserRole.RESELLER) {
    return { session: null, error: unauthorizedResponse() };
  }
  return { session, error: null };
}

export async function GET(req: NextRequest) {
  const { session, error } = await requireReseller(req);
  if (error) return error;

  try {
    const tenant = await prisma.tenant.findFirst({
      where: { users: { some: { id: session!.user.id } } },
    });

    if (!tenant) return notFoundResponse("Tenant não encontrado");
    return successResponse(tenant);
  } catch {
    return errorResponse("Erro ao buscar dados do tenant");
  }
}
