import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
} from "@/lib/api-helpers";
import { bolaoSchema } from "@/lib/validations";
import { nanoid } from "nanoid";

export async function GET(req: NextRequest) {
  const session = await auth();
  const { searchParams } = new URL(req.url);
  const filter = searchParams.get("filter") ?? "all"; // all | mine | public

  try {
    const where: Record<string, unknown> = {};

    if (filter === "mine" && session?.user?.id) {
      where.OR = [
        { createdById: session.user.id },
        { members: { some: { userId: session.user.id } } },
      ];
    } else if (filter === "public") {
      where.isPublic = true;
    }

    const boloes = await prisma.bolao.findMany({
      where,
      include: {
        _count: { select: { members: true } },
        members: session?.user?.id
          ? { where: { userId: session.user.id }, select: { userId: true } }
          : false,
      },
      orderBy: { createdAt: "desc" },
    });

    // Fetch creators separately since Bolao doesn't have owner relation
    const creatorIds = [...new Set(boloes.map((b) => b.createdById))];
    const creators = await prisma.user.findMany({
      where: { id: { in: creatorIds } },
      select: { id: true, name: true, avatarUrl: true },
    });
    const creatorMap = Object.fromEntries(creators.map((c) => [c.id, c]));

    const data = boloes.map((b) => ({
      ...b,
      owner: creatorMap[b.createdById] ?? null,
      membersCount: b._count.members,
      isJoined: session?.user?.id
        ? b.members.some((m) => m.userId === session.user!.id)
        : false,
      _count: undefined,
      members: undefined,
    }));

    return successResponse(data);
  } catch {
    return errorResponse("Erro ao buscar bolões");
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return unauthorizedResponse();

  try {
    const body = await req.json();
    const parsed = bolaoSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0].message, 400);
    }

    const { name, description, isPublic, maxMembers } = parsed.data;
    const inviteCode = nanoid(6).toUpperCase();

    const bolao = await prisma.bolao.create({
      data: {
        name,
        description,
        isPublic: isPublic ?? false,
        maxMembers,
        inviteCode,
        createdById: session.user.id,
        tenantId: session.user.tenantId ?? null,
        members: {
          create: { userId: session.user.id },
        },
      },
      include: {
        _count: { select: { members: true } },
      },
    });

    return successResponse(bolao, 201);
  } catch {
    return errorResponse("Erro ao criar bolão");
  }
}
