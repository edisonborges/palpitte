import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  successResponse,
  errorResponse,
  notFoundResponse,
} from "@/lib/api-helpers";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const { id } = await params;

  try {
    const bolao = await prisma.bolao.findUnique({
      where: { id },
      include: {
        members: {
          include: {
            user: { select: { id: true, name: true, avatarUrl: true, totalPoints: true } },
          },
          orderBy: { joinedAt: "asc" },
        },
        _count: { select: { members: true } },
      },
    });

    if (!bolao) return notFoundResponse("Bolão não encontrado");

    // Fetch creator
    const creator = await prisma.user.findUnique({
      where: { id: bolao.createdById },
      select: { id: true, name: true, avatarUrl: true },
    });

    const isJoined = session?.user?.id
      ? bolao.members.some((m) => m.userId === session.user!.id)
      : false;

    const isOwner = session?.user?.id === bolao.createdById;

    return successResponse({
      ...bolao,
      owner: creator,
      membersCount: bolao._count.members,
      isJoined,
      isOwner,
      inviteCode: isOwner ? bolao.inviteCode : undefined,
      _count: undefined,
    });
  } catch {
    return errorResponse("Erro ao buscar bolão");
  }
}
