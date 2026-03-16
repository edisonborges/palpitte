import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();
  const firstName = session?.user?.name?.split(" ")[0] ?? "Usuário";

  const [upcomingMatches, topRanking, userBoloes] = await Promise.all([
    prisma.match.findMany({
      where: { status: "SCHEDULED" },
      include: { homeTeam: true, awayTeam: true, competition: true },
      orderBy: { scheduledAt: "asc" },
      take: 3,
    }),
    prisma.user.findMany({
      where: { status: "ACTIVE" },
      orderBy: { totalPoints: "desc" },
      take: 3,
      select: { id: true, name: true, totalPoints: true },
    }),
    session?.user?.id
      ? prisma.bolaoMember.findMany({
          where: { userId: session.user.id },
          include: { bolao: true },
          take: 3,
        })
      : Promise.resolve([]),
  ]);

  const currentUser = session?.user?.id
    ? await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { totalPoints: true, globalRank: true, weeklyPoints: true },
      })
    : null;

  return (
    <div className="max-w-[1280px] mx-auto p-8">
      {/* Header */}
      <header className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Olá, {firstName}! 👋</h1>
          <div className="flex items-center gap-2 text-slate-400">
            <span className="material-symbols-outlined text-sm">event</span>
            <span className="text-sm font-medium">Brasileirão · Rodada atual</span>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="p-2 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <Link
            href="/boloes"
            className="bg-[#FF6B00] text-white px-5 py-2.5 rounded-lg font-bold text-sm shadow-lg shadow-[#FF6B00]/20 hover:scale-105 transition-transform"
          >
            Criar Bolão
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-8">
        {/* Left Column */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          {/* Points Banner */}
          <section className="bg-gradient-to-r from-[#161e2d] to-[#1f293a] p-8 rounded-2xl border border-slate-800 relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <p className="text-slate-400 text-sm font-medium mb-1 uppercase tracking-widest">Sua Pontuação Total</p>
                <div className="flex items-baseline gap-2">
                  <h2 className="text-5xl font-extrabold text-[#FF6B00] leading-none">
                    {(currentUser?.totalPoints ?? 0).toLocaleString("pt-BR")}
                  </h2>
                  <span className="text-xl font-bold text-[#FF6B00]/80">pts</span>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="bg-black/40 backdrop-blur-sm border border-white/5 p-4 rounded-xl flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-500">
                    <span className="material-symbols-outlined text-3xl">workspace_premium</span>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Liga Atual</p>
                    <p className="text-lg font-bold text-yellow-500">
                      Ouro #{currentUser?.globalRank ?? "–"}
                    </p>
                  </div>
                </div>
                <div className="bg-black/40 backdrop-blur-sm border border-white/5 p-4 rounded-xl flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#FF6B00]/20 flex items-center justify-center text-[#FF6B00]">
                    <span className="material-symbols-outlined text-3xl">trending_up</span>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Semana</p>
                    <p className="text-lg font-bold text-green-500">
                      +{currentUser?.weeklyPoints ?? 0} pts
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-[#FF6B00]/5 rounded-full blur-3xl" />
          </section>

          {/* Today's Matches */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Partidas de Hoje</h3>
              <Link href="/jogos" className="text-[#FF6B00] text-sm font-bold hover:underline">
                Ver todas as partidas
              </Link>
            </div>

            {upcomingMatches.length === 0 ? (
              <div className="bg-[#161e2d] rounded-xl p-8 text-center border border-slate-800">
                <span className="material-symbols-outlined text-4xl text-slate-600 mb-3 block">sports_soccer</span>
                <p className="text-slate-400">Nenhuma partida agendada no momento.</p>
                <p className="text-slate-500 text-sm mt-1">Volte em breve para fazer seus palpites!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingMatches.map((match) => {
                  const time = new Date(match.scheduledAt).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                  return (
                    <div
                      key={match.id}
                      className="bg-[#161e2d] border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-[#FF6B00]/30 transition-colors"
                    >
                      <div className="flex items-center gap-8 flex-1 justify-center md:justify-start">
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-14 h-14 bg-slate-800 rounded-full flex items-center justify-center">
                            <span className="material-symbols-outlined text-2xl text-slate-400">sports_soccer</span>
                          </div>
                          <span className="text-sm font-bold">{match.homeTeam.shortName}</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="text-2xl font-black text-slate-700 italic">VS</span>
                          <span className="text-xs font-medium text-slate-500">{time}</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-14 h-14 bg-slate-800 rounded-full flex items-center justify-center">
                            <span className="material-symbols-outlined text-2xl text-slate-400">sports_soccer</span>
                          </div>
                          <span className="text-sm font-bold">{match.awayTeam.shortName}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-center md:items-end gap-2 flex-1">
                        <p className="text-xs text-slate-400 font-medium">{match.competition.name}</p>
                        <Link
                          href={`/jogos/${match.id}`}
                          className="border-2 border-[#FF6B00] text-[#FF6B00] px-6 py-2 rounded-lg font-bold text-sm hover:bg-[#FF6B00]/10 transition-colors"
                        >
                          Dar palpite
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        {/* Right Column – Widgets */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          {/* Meus Bolões */}
          <section className="bg-[#161e2d] border border-slate-800 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
              <h3 className="font-bold text-white">Meus Bolões</h3>
              <span className="material-symbols-outlined text-slate-400">more_vert</span>
            </div>
            <div className="p-4 space-y-3">
              {userBoloes.length === 0 ? (
                <p className="text-slate-500 text-sm text-center py-4">Nenhum bolão ainda.</p>
              ) : (
                userBoloes.map((bm, i) => {
                  const colors = ["bg-[#FF6B00]/20 text-[#FF6B00]", "bg-green-500/20 text-green-500", "bg-purple-500/20 text-purple-500"];
                  return (
                    <Link
                      key={bm.id}
                      href="/boloes"
                      className="p-3 rounded-lg bg-slate-800/40 border border-slate-800 flex items-center gap-4 hover:border-[#FF6B00]/30 transition-colors"
                    >
                      <div className={`w-10 h-10 ${colors[i % 3]} rounded flex items-center justify-center font-bold`}>
                        {bm.bolao.name[0]}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-bold truncate text-white">{bm.bolao.name}</p>
                        <p className="text-[10px] text-slate-500 uppercase font-bold">
                          {bm.rank ? `${bm.rank}º lugar` : "—"} · {bm.totalPoints} pts
                        </p>
                      </div>
                      <span className="material-symbols-outlined text-slate-400 text-sm">chevron_right</span>
                    </Link>
                  );
                })
              )}
            </div>
            <Link
              href="/boloes"
              className="block w-full p-4 text-xs font-bold text-slate-500 hover:text-[#FF6B00] transition-colors border-t border-slate-800 text-center"
            >
              VER TODOS OS BOLÕES
            </Link>
          </section>

          {/* Ranking da Semana */}
          <section className="bg-[#161e2d] border border-slate-800 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-800">
              <h3 className="font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-[#FF6B00]">military_tech</span>
                Ranking da Semana
              </h3>
            </div>
            <div className="p-4 space-y-4">
              {topRanking.map((user, i) => {
                const rankColors = ["text-yellow-500", "text-slate-400", "text-orange-700"];
                return (
                  <div key={user.id} className="flex items-center gap-3">
                    <span className={`w-6 text-center font-black italic ${rankColors[i]}`}>{i + 1}º</span>
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex-shrink-0 flex items-center justify-center text-xs font-bold text-white">
                      {user.name?.[0] ?? "?"}
                    </div>
                    <span className="text-sm font-medium flex-1 truncate text-slate-200">{user.name}</span>
                    <span className="text-sm font-bold text-[#FF6B00]">{user.totalPoints} pts</span>
                  </div>
                );
              })}
              {session?.user && (
                <div className="border-t border-dashed border-slate-700 pt-4 flex items-center gap-3 bg-[#FF6B00]/5 -mx-4 px-4 py-2">
                  <span className="w-6 text-center font-black italic text-[#FF6B00]">
                    {currentUser?.globalRank ?? "–"}º
                  </span>
                  <div className="w-8 h-8 rounded-full bg-[#FF6B00]/20 flex-shrink-0 flex items-center justify-center text-[#FF6B00] font-bold text-xs border border-[#FF6B00]/40">
                    {firstName[0]}
                  </div>
                  <span className="text-sm font-bold flex-1 truncate text-[#FF6B00]">Você</span>
                  <span className="text-sm font-black text-[#FF6B00]">{currentUser?.weeklyPoints ?? 0} pts</span>
                </div>
              )}
            </div>
          </section>

          {/* Banner Premium */}
          <div className="rounded-2xl bg-gradient-to-br from-[#FF6B00] to-orange-600 p-6 text-white text-center">
            <h4 className="font-black text-lg mb-2">SEJA PREMIUM</h4>
            <p className="text-xs mb-4 opacity-90">Participe de bolões ilimitados e concorra a prêmios todos os meses.</p>
            <button className="bg-white text-[#FF6B00] px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest shadow-lg">
              Saiba Mais
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
