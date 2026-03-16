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

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== UserRole.RESELLER) {
    return unauthorizedResponse();
  }

  try {
    // Find the tenant owned by this reseller
    const tenant = await prisma.tenant.findFirst({
      where: { ownerId: session.user.id },
      include: { subscription: true },
    });

    if (!tenant) return notFoundResponse("Tenant não encontrado");
    if (!tenant.subscription) return notFoundResponse("Assinatura não encontrada");

    const subscription = tenant.subscription;
    const isActive = subscription.status === "ACTIVE";
    const daysLeft = Math.ceil(
      (subscription.currentPeriodEnd.getTime() - Date.now()) /
        (1000 * 60 * 60 * 24)
    );

    return successResponse({ ...subscription, isActive, daysLeft });
  } catch {
    return errorResponse("Erro ao buscar assinatura");
  }
}
