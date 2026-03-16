import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  notFoundResponse,
} from "@/lib/api-helpers";
import { redeemSchema } from "@/lib/validations";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return unauthorizedResponse();

  try {
    const body = await req.json();
    const parsed = redeemSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0].message, 400);
    }

    const { prizeId, shippingAddress } = parsed.data;

    const [prize, user] = await Promise.all([
      prisma.prize.findUnique({ where: { id: prizeId } }),
      prisma.user.findUnique({
        where: { id: session.user.id },
        select: { totalPoints: true },
      }),
    ]);

    if (!prize || !prize.isActive) return notFoundResponse("Prêmio não encontrado");
    if (prize.stock !== null && prize.stock <= 0) {
      return errorResponse("Prêmio esgotado", 400);
    }
    if (!user || user.totalPoints < prize.pointsCost) {
      return errorResponse("Pontos insuficientes", 400);
    }

    const redemption = await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: session.user.id },
        data: { totalPoints: { decrement: prize.pointsCost } },
      });

      if (prize.stock !== null) {
        await tx.prize.update({
          where: { id: prizeId },
          data: { stock: { decrement: 1 } },
        });
      }

      return tx.prizeRedemption.create({
        data: {
          userId: session.user.id,
          prizeId,
          shippingAddress,
        },
        include: { prize: { select: { name: true, imageUrl: true } } },
      });
    });

    return successResponse(redemption, 201);
  } catch {
    return errorResponse("Erro ao resgatar prêmio");
  }
}
