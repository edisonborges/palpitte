import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { PalpiteForm } from "@/components/palpite-form";
import { StatusPill } from "@/components/status-pill";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DarPalpitePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { id } = await params;

  const match = await prisma.match.findUnique({
    where: { id },
    include: {
      homeTeam: true,
      awayTeam: true,
      competition: true,
      bonusQuestions: true,
      predictions: {
        where: { userId: session.user.id },
        take: 1,
      },
    },
  });

  if (!match) notFound();

  const matchFormatted = {
    ...match,
    matchDate: match.scheduledAt,
    userPrediction: match.predictions[0] ?? null,
    predictions: undefined,
    isChampions: match.pointsMultiplier > 1,
  };

  const matchDate = new Date(match.scheduledAt);
  const now = new Date();
  const diffMs = matchDate.getTime() - now.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const timeLeft =
    diffMs > 0
      ? diffHours > 0
        ? `Fecha em ${diffHours}h ${diffMins}min`
        : `Fecha em ${diffMins}min`
      : "Encerrado";

  return (
    <div className="flex-1 flex flex-col items-center">
      <div className="w-full max-w-[720px] px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-8 text-slate-500 dark:text-slate-400">
          <Link href="/dashboard" className="hover:text-[#FF6B00] transition-colors">
            Início
          </Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <Link href="/jogos" className="hover:text-[#FF6B00] transition-colors">
            Jogos
          </Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-slate-900 dark:text-white font-medium">
            {match.homeTeam.shortName} vs {match.awayTeam.shortName}
          </span>
        </nav>

        {/* Match Hero Card */}
        <div className="relative overflow-hidden rounded-3xl bg-slate-900 mb-8 aspect-[21/9] flex flex-col items-center justify-center p-8 text-center border border-white/5 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent z-0"></div>
          <div
            className="absolute inset-0 opacity-40 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1508098682722-e99c643e7f0b?w=1200&q=80')",
            }}
          ></div>
          <div className="relative z-10 flex flex-col items-center w-full">
            <div className="flex items-center gap-2 mb-6">
              <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold text-white tracking-widest border border-white/20 uppercase">
                {match.competition.name}
              </span>
              <StatusPill status={match.status} />
            </div>

            <div className="flex items-center justify-between w-full max-w-md">
              <div className="flex flex-col items-center gap-2">
                {match.homeTeam.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={match.homeTeam.logoUrl}
                    alt={match.homeTeam.name}
                    className="w-16 h-16 object-contain rounded-full bg-white/5 p-2 backdrop-blur-sm"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                    <span className="text-white font-black text-lg">
                      {match.homeTeam.shortName.slice(0, 3)}
                    </span>
                  </div>
                )}
                <span className="text-white font-bold text-sm">{match.homeTeam.shortName}</span>
              </div>

              <div className="flex flex-col items-center">
                {match.status === "FINISHED" || match.status === "LIVE" ? (
                  <span
                    className="text-5xl text-white leading-none"
                    style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900 }}
                  >
                    {match.homeScore ?? 0} x {match.awayScore ?? 0}
                  </span>
                ) : (
                  <span
                    className="text-5xl text-white/20 leading-none"
                    style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900 }}
                  >
                    VS
                  </span>
                )}
              </div>

              <div className="flex flex-col items-center gap-2">
                {match.awayTeam.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={match.awayTeam.logoUrl}
                    alt={match.awayTeam.name}
                    className="w-16 h-16 object-contain rounded-full bg-white/5 p-2 backdrop-blur-sm"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                    <span className="text-white font-black text-lg">
                      {match.awayTeam.shortName.slice(0, 3)}
                    </span>
                  </div>
                )}
                <span className="text-white font-bold text-sm">{match.awayTeam.shortName}</span>
              </div>
            </div>

            {diffMs > 0 && (
              <div className="mt-8 px-4 py-2 bg-[#FF6B00]/90 rounded-full flex items-center gap-2 shadow-[0_0_20px_rgba(255,107,0,0.4)]">
                <span className="material-symbols-outlined text-white text-sm">timer</span>
                <span className="text-white text-sm font-bold">{timeLeft}</span>
              </div>
            )}

            {match.pointsMultiplier > 1 && (
              <div className="mt-3 bg-yellow-400/20 border border-yellow-400/30 rounded-full px-4 py-1">
                <span className="text-yellow-400 text-xs font-bold">
                  ⭐ Fase final — multiplicador ×{match.pointsMultiplier}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Palpite Form (score stepper + bonus questions + submit) */}
        {/* @ts-expect-error MatchWithDetails shape approximation */}
        <PalpiteForm match={matchFormatted} />

        <p className="text-center text-xs text-slate-500 dark:text-slate-500 mt-6 px-10">
          Ao confirmar, seu palpite será registrado e você poderá editá-lo até o fechamento da
          rodada. Boa sorte!
        </p>
      </div>
    </div>
  );
}
