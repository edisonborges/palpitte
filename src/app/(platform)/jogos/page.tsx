import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { JogosClient } from "./jogos-client";

export default async function JogosPage() {
  await auth();

  const matches = await prisma.match.findMany({
    where: { status: { in: ["SCHEDULED", "LIVE"] } },
    include: { homeTeam: true, awayTeam: true, competition: true },
    orderBy: { scheduledAt: "asc" },
    take: 20,
  });

  return <JogosClient matches={matches} />;
}
