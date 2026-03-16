import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function PerfilPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      avatarUrl: true,
      favoriteTeam: true,
      status: true,
      totalPoints: true,
      weeklyPoints: true,
      monthlyPoints: true,
      globalRank: true,
      createdAt: true,
      _count: { select: { predictions: true } },
    },
  });

  if (!user) redirect("/login");

  const recentPredictions = await prisma.prediction.findMany({
    where: { userId: session.user.id },
    include: {
      match: {
        include: { homeTeam: true, awayTeam: true, competition: true },
      },
    },
    orderBy: { submittedAt: "desc" },
    take: 10,
  });

  const exactCount = recentPredictions.filter((p) => p.isExact).length;
  const correctCount = recentPredictions.filter((p) => p.isCorrectResult && !p.isExact).length;
  const accuracy =
    recentPredictions.length > 0
      ? Math.round(((exactCount + correctCount) / recentPredictions.length) * 100)
      : 0;

  const memberSince = new Date(user.createdAt).toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });

  function getInitials(name: string | null) {
    if (!name) return "?";
    return name
      .split(" ")
      .slice(0, 2)
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  }

  return (
    <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-[#0a0f1a] p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white dark:bg-[#161d2b] p-8 rounded-xl border border-slate-200 dark:border-[#252e41]">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-4 border-[#FF6B00] p-1 bg-slate-50 dark:bg-[#0a0f1a]">
                {user.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.avatarUrl}
                    alt={user.name ?? "Avatar"}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-[#FF6B00]/20 flex items-center justify-center">
                    <span className="text-3xl font-black text-[#FF6B00]">
                      {getInitials(user.name)}
                    </span>
                  </div>
                )}
              </div>
              <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-2 border-white dark:border-[#161d2b] rounded-full"></div>
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                {user.name}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 font-normal">
                Membro desde {memberSince} •{" "}
                <span className="text-[#FF6B00] font-semibold">
                  {user.status === "ACTIVE" ? "Nível Especialista" : "Nível Iniciante"}
                </span>
              </p>
              <div className="mt-3 flex gap-2 flex-wrap justify-center md:justify-start">
                {user.globalRank && user.globalRank <= 100 && (
                  <span className="px-2 py-1 bg-[#FF6B00]/10 text-[#FF6B00] text-xs font-bold rounded">
                    TOP 100
                  </span>
                )}
                {user.status === "ACTIVE" && (
                  <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-bold rounded">
                    ATIVO
                  </span>
                )}
                {user.favoriteTeam && (
                  <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-bold rounded">
                    ❤️ {user.favoriteTeam}
                  </span>
                )}
              </div>
            </div>
          </div>
          <button className="px-6 py-2 border-2 border-[#FF6B00] text-[#FF6B00] hover:bg-[#FF6B00] hover:text-white font-bold rounded-lg transition-all duration-300">
            Editar perfil
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-[#161d2b] p-6 rounded-xl border border-slate-200 dark:border-[#252e41] flex flex-col gap-1">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider">
              Pontos Totais
            </p>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-[#FF6B00]">
                {user.totalPoints.toLocaleString("pt-BR")}
              </span>
              <span className="text-green-500 text-sm font-bold pb-1">+12%</span>
            </div>
          </div>
          <div className="bg-white dark:bg-[#161d2b] p-6 rounded-xl border border-slate-200 dark:border-[#252e41] flex flex-col gap-1">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider">
              Palpites Ativos
            </p>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-[#FF6B00]">
                {user._count.predictions}
              </span>
            </div>
          </div>
          <div className="bg-white dark:bg-[#161d2b] p-6 rounded-xl border border-slate-200 dark:border-[#252e41] flex flex-col gap-1">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider">
              Ranking Global
            </p>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-yellow-500">
                {user.globalRank ? `${user.globalRank}º` : "—"}
              </span>
            </div>
          </div>
          <div className="bg-white dark:bg-[#161d2b] p-6 rounded-xl border border-slate-200 dark:border-[#252e41] flex flex-col gap-1">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider">
              Taxa de Acerto
            </p>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-green-500">{accuracy}%</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* History Table (Left 2/3) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Histórico de Partidas
              </h3>
              <button className="text-[#FF6B00] text-sm font-semibold hover:underline">
                Ver tudo
              </button>
            </div>

            {recentPredictions.length > 0 ? (
              <div className="bg-white dark:bg-[#161d2b] rounded-xl border border-slate-200 dark:border-[#252e41] overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-[#252e41]">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">
                        Partida
                      </th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">
                        Resultado
                      </th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-center">
                        Status
                      </th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">
                        Pontos
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-[#252e41]">
                    {recentPredictions.map((p) => (
                      <tr
                        key={p.id}
                        className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-sm text-slate-900 dark:text-white">
                              {p.match.homeTeam.shortName} vs {p.match.awayTeam.shortName}
                            </span>
                            <span className="text-xs text-slate-500">
                              {new Date(p.submittedAt).toLocaleDateString("pt-BR", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full text-xs font-bold text-slate-700 dark:text-slate-300">
                            {p.homeScore} - {p.awayScore}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {p.match.status === "FINISHED" ? (
                            <div className="flex items-center justify-center gap-2">
                              <span
                                className={`w-2 h-2 rounded-full ${
                                  p.pointsEarned > 0 ? "bg-green-500" : "bg-slate-400"
                                }`}
                              ></span>
                              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                                {p.pointsEarned > 0 ? "Ganhou" : "Perdeu"}
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                              <span className="text-xs font-medium text-slate-500">Pendente</span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {p.pointsEarned > 0 ? (
                            <span className="text-[#FF6B00] font-bold">+{p.pointsEarned} pts</span>
                          ) : (
                            <span className="text-slate-400 font-bold">0 pts</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-white dark:bg-[#161d2b] rounded-xl p-8 border border-slate-200 dark:border-[#252e41] text-center">
                <p className="text-slate-500 text-sm">
                  Nenhum palpite feito ainda.{" "}
                  <a href="/jogos" className="text-[#FF6B00] hover:underline">
                    Vá para Jogos
                  </a>{" "}
                  e comece!
                </p>
              </div>
            )}
          </div>

          {/* Achievements (Right 1/3) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Conquistas</h3>
              <span className="text-xs bg-[#FF6B00]/20 text-[#FF6B00] px-2 py-1 rounded-full font-bold">
                {exactCount + correctCount} / 48
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {/* Unlocked */}
              <div className="bg-white dark:bg-[#161d2b] p-4 rounded-xl border border-[#FF6B00]/30 flex flex-col items-center text-center gap-2 transition-transform hover:scale-105">
                <div className="w-16 h-16 rounded-full border-2 border-[#FF6B00] flex items-center justify-center bg-[#FF6B00]/5">
                  <span className="material-symbols-outlined text-[#FF6B00] text-3xl">
                    military_tech
                  </span>
                </div>
                <p className="text-xs font-bold leading-tight text-slate-900 dark:text-white">
                  Primeiro Passo
                </p>
                <p className="text-[10px] text-slate-500">Ganhou 1º palpite</p>
              </div>
              <div className="bg-white dark:bg-[#161d2b] p-4 rounded-xl border border-[#FF6B00]/30 flex flex-col items-center text-center gap-2 transition-transform hover:scale-105">
                <div className="w-16 h-16 rounded-full border-2 border-[#FF6B00] flex items-center justify-center bg-[#FF6B00]/5">
                  <span className="material-symbols-outlined text-[#FF6B00] text-3xl">
                    local_fire_department
                  </span>
                </div>
                <p className="text-xs font-bold leading-tight text-slate-900 dark:text-white">
                  Em Chamas
                </p>
                <p className="text-[10px] text-slate-500">5 acertos seguidos</p>
              </div>

              {/* Locked */}
              <div className="bg-white dark:bg-[#161d2b] p-4 rounded-xl border border-slate-200 dark:border-[#252e41] flex flex-col items-center text-center gap-2 opacity-40 grayscale">
                <div className="w-16 h-16 rounded-full border-2 border-slate-400 flex items-center justify-center">
                  <span className="material-symbols-outlined text-slate-400 text-3xl">
                    diamond
                  </span>
                </div>
                <p className="text-xs font-bold leading-tight text-slate-900 dark:text-white">
                  Lenda Viva
                </p>
                <p className="text-[10px] text-slate-500">Chegue ao Top 10</p>
              </div>
              <div className="bg-white dark:bg-[#161d2b] p-4 rounded-xl border border-slate-200 dark:border-[#252e41] flex flex-col items-center text-center gap-2 opacity-40 grayscale">
                <div className="w-16 h-16 rounded-full border-2 border-slate-400 flex items-center justify-center">
                  <span className="material-symbols-outlined text-slate-400 text-3xl">stars</span>
                </div>
                <p className="text-xs font-bold leading-tight text-slate-900 dark:text-white">
                  Oráculo
                </p>
                <p className="text-[10px] text-slate-500">100% de precisão</p>
              </div>
            </div>
            <button className="w-full py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-sm">
              Ver todas conquistas
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
