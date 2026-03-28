import type { Prisma} from "@prisma/client";

export type MatchWithRelations = Prisma.MatchGetPayload<{
  include: {
    homeTeam: true;
    awayTeam: true;
    competition: true;
  };
}>;