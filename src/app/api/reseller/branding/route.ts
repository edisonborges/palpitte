import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  notFoundResponse,
} from "@/lib/api-helpers";
import { brandingSchema } from "@/lib/validations";
import { UserRole } from "@prisma/client";

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== UserRole.RESELLER) {
    return unauthorizedResponse();
  }

  try {
    const body = await req.json();
    const parsed = brandingSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0].message, 400);
    }

    const tenant = await prisma.tenant.findFirst({
      where: { users: { some: { id: session.user.id } } },
    });

    if (!tenant) return notFoundResponse("Tenant não encontrado");

    const updated = await prisma.tenant.update({
      where: { id: tenant.id },
      data: {
        platformName: parsed.data.platformName ?? tenant.platformName,
        tagline: parsed.data.tagline ?? tenant.tagline,
        primaryColor: parsed.data.primaryColor ?? tenant.primaryColor,
        secondaryColor: parsed.data.secondaryColor ?? tenant.secondaryColor,
        bgColor: parsed.data.bgColor ?? tenant.bgColor,
        logoUrl: parsed.data.logoUrl ?? tenant.logoUrl,
        faviconUrl: parsed.data.faviconUrl ?? tenant.faviconUrl,
        customDomain: parsed.data.customDomain || null,
      },
    });

    return successResponse(updated);
  } catch {
    return errorResponse("Erro ao atualizar branding");
  }
}
