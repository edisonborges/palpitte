import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
} from "@/lib/api-helpers";
import { joinBolaoSchema } from "@/lib/validations";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return unauthorizedResponse();

  try {
    const body = await req.json();
    const parsed = joinBolaoSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0].message, 400);
    }

    const { inviteCode } = parsed.data;

    const bolao = await prisma.bolao.findUnique({
      where: { inviteCode },
      include: { _count: { select: { members: true } } },
    });

    if (!bolao) return errorResponse("Bolão não encontrado", 404);
    if (bolao.status !== "ACTIVE") {
      return errorResponse("Este bolão não está aberto para novos membros", 400);
    }

    if (bolao.maxMembers && bolao._count.members >= bolao.maxMembers) {
      return errorResponse("Este bolão atingiu o limite de participantes", 400);
    }

    const existing = await prisma.bolaoMember.findUnique({
      where: { bolaoId_userId: { bolaoId: bolao.id, userId: session.user.id } },
    });

    if (existing) return errorResponse("Você já participa deste bolão", 400);

    await prisma.bolaoMember.create({
      data: { bolaoId: bolao.id, userId: session.user.id },
    });

    return successResponse({ message: "Entrou no bolão com sucesso", bolaoId: bolao.id });
  } catch {
    return errorResponse("Erro ao entrar no bolão");
  }
}
