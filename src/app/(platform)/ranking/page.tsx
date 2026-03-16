import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import type { RankingEntry } from "@/types";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function RankingPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; page?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const params = await searchParams;
  const type = params.type ?? "global";
  const page = parseInt(params.page ?? "1");
  const limit = 20;

  const orderBy =
    type === "weekly"
      ? { weeklyPoints: "desc" as const }
      : type === "monthly"
      ? { monthlyPoints: "desc" as const }
      : { totalPoints: "desc" as const };

  const pointsField =
    type === "weekly"
      ? "weeklyPoints"
      : type === "monthly"
      ? "monthlyPoints"
      : "totalPoints";

  const [users, total, currentUser] = await Promise.all([
    prisma.user.findMany({
      where: { role: "USER" },
      select: {
        id: true,
        name: true,
        avatarUrl: true,
        totalPoints: true,
        weeklyPoints: true,
        monthlyPoints: true,
        _count: { select: { predictions: true } },
      },
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.user.count({ where: { role: "USER" } }),
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        totalPoints: true,
        weeklyPoints: true,
        monthlyPoints: true,
        globalRank: true,
        _count: { select: { predictions: true } },
      },
    }),
  ]);

  const entries: RankingEntry[] = users.map((u, i) => ({
    userId: u.id,
    name: u.name,
    avatarUrl: u.avatarUrl,
    points: u[pointsField as keyof typeof u] as number,
    position: (page - 1) * limit + i + 1,
    totalPredictions: u._count.predictions,
  }));

  const totalPages = Math.ceil(total / limit);

  const tabs = [
    { key: "global", label: "Geral" },
    { key: "weekly", label: "Semanal" },
    { key: "monthly", label: "Mensal" },
  ];

  const top3 = entries.slice(0, 3);
  const rest = entries.slice(3);
  const currentUserPoints = currentUser
    ? (currentUser[pointsField as keyof typeof currentUser] as number)
    : 0;

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
    <div className="p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header and Tabs */}
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Ranking 🏆
          </h2>
          <div className="flex items-center gap-2 bg-slate-200 dark:bg-slate-800 p-1 rounded-xl">
            {tabs.map((tab) => (
              <Link
                key={tab.key}
                href={`/ranking?type=${tab.key}`}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  type === tab.key
                    ? "bg-[#FF6B00] text-white shadow-lg"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-700"
                }`}
              >
                {tab.label}
              </Link>
            ))}
            <button className="px-4 py-2 text-sm font-medium rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-700">
              Meu Bolão
            </button>
          </div>
        </div>

        {/* My Position Banner */}
        {currentUser && (
          <div className="bg-[#FF6B00]/5 border-2 border-[#FF6B00]/40 rounded-2xl p-6 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-[#FF6B00] flex items-center justify-center text-white text-2xl font-bold shadow-xl shadow-[#FF6B00]/20">
                #{currentUser.globalRank ?? "—"}
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {currentUser.name}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium">
                  {currentUserPoints.toLocaleString("pt-BR")} pontos acumulados
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="flex items-center justify-end text-emerald-500 font-bold">
                  <span className="material-symbols-outlined">arrow_drop_up</span>
                  subindo
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                  Posição atual
                </p>
              </div>
              <button className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-6 py-2 rounded-xl text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-slate-900 dark:text-white">
                Ver Detalhes
              </button>
            </div>
          </div>
        )}

        {/* Podium */}
        {top3.length === 3 && (
          <div className="grid grid-cols-3 gap-6 items-end max-w-4xl mx-auto pt-10 pb-4">
            {/* 2nd Place */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-slate-300 flex items-center justify-center bg-slate-200 dark:bg-slate-700">
                  <span className="text-xl font-black text-slate-600 dark:text-slate-300">
                    {getInitials(top3[1].name)}
                  </span>
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-slate-300 text-slate-800 text-xs font-black px-3 py-1 rounded-full shadow-lg">
                  2º
                </div>
              </div>
              <div className="text-center">
                <p className="font-bold text-slate-900 dark:text-white">
                  {top3[1].name?.split(" ")[0]} {top3[1].name?.split(" ").slice(-1)[0]?.charAt(0)}.
                </p>
                <p className="text-xs text-[#FF6B00] font-medium">
                  {top3[1].points.toLocaleString("pt-BR")} pts
                </p>
              </div>
              <div className="w-full h-24 bg-gradient-to-t from-slate-400/20 to-slate-400/40 rounded-t-2xl border-t border-slate-300"></div>
            </div>

            {/* 1st Place */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <span
                  className="material-symbols-outlined absolute -top-10 left-1/2 -translate-x-1/2 text-yellow-400 text-4xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  workspace_premium
                </span>
                <div className="w-24 h-24 rounded-full border-4 border-yellow-400 ring-4 ring-yellow-400/20 flex items-center justify-center bg-yellow-100 dark:bg-yellow-900/30">
                  <span className="text-3xl font-black text-yellow-700 dark:text-yellow-400">
                    {getInitials(top3[0].name)}
                  </span>
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-950 text-xs font-black px-4 py-1 rounded-full shadow-lg">
                  1º
                </div>
              </div>
              <div className="text-center">
                <p className="text-lg font-black text-yellow-500">{top3[0].name}</p>
                <p className="text-sm text-[#FF6B00] font-bold">
                  {top3[0].points.toLocaleString("pt-BR")} pts
                </p>
              </div>
              <div className="w-full h-36 bg-gradient-to-t from-yellow-500/20 to-yellow-500/40 rounded-t-2xl border-t border-yellow-400"></div>
            </div>

            {/* 3rd Place */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-orange-700/50 flex items-center justify-center bg-orange-100 dark:bg-orange-900/20">
                  <span className="text-xl font-black text-orange-700 dark:text-orange-400">
                    {getInitials(top3[2].name)}
                  </span>
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#cd7f32] text-white text-xs font-black px-3 py-1 rounded-full shadow-lg">
                  3º
                </div>
              </div>
              <div className="text-center">
                <p className="font-bold text-slate-900 dark:text-white">
                  {top3[2].name?.split(" ")[0]} {top3[2].name?.split(" ").slice(-1)[0]?.charAt(0)}.
                </p>
                <p className="text-xs text-[#FF6B00] font-medium">
                  {top3[2].points.toLocaleString("pt-BR")} pts
                </p>
              </div>
              <div className="w-full h-16 bg-gradient-to-t from-orange-800/20 to-orange-800/40 rounded-t-2xl border-t border-orange-700/50"></div>
            </div>
          </div>
        )}

        {/* Leaderboard Table */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                  Pos
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                  Jogador
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 text-center">
                  Palpites
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 text-right">
                  Pontos
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {/* Show rest (positions 4+) first, then current user highlighted */}
              {rest.map((entry) => {
                const isMe = entry.userId === session.user?.id;
                return (
                  <tr
                    key={entry.userId}
                    className={
                      isMe
                        ? "bg-[#FF6B00]/10 border-l-4 border-l-[#FF6B00]"
                        : "hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                    }
                  >
                    <td
                      className={`px-6 py-4 font-bold ${
                        isMe ? "text-[#FF6B00]" : "text-slate-400"
                      }`}
                    >
                      {entry.position}º
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            isMe
                              ? "bg-[#FF6B00] text-white"
                              : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                          }`}
                        >
                          {getInitials(entry.name)}
                        </div>
                        <span
                          className={`font-semibold ${
                            isMe
                              ? "font-bold text-[#FF6B00]"
                              : "text-slate-900 dark:text-white"
                          }`}
                        >
                          {entry.name}
                          {isMe && " (Você)"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-slate-700 dark:text-slate-300">
                      {entry.totalPredictions}
                    </td>
                    <td className="px-6 py-4 text-right font-black text-[#FF6B00]">
                      {entry.points.toLocaleString("pt-BR")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
            <span className="text-sm text-slate-500 dark:text-slate-400">
              Mostrando {(page - 1) * limit + 1}–{Math.min(page * limit, total)} de{" "}
              {total.toLocaleString("pt-BR")} participantes
            </span>
            {totalPages > 1 && (
              <div className="flex gap-2">
                {page > 1 && (
                  <Link
                    href={`/ranking?type=${type}&page=${page - 1}`}
                    className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:bg-white dark:hover:bg-slate-700"
                  >
                    <span className="material-symbols-outlined">chevron_left</span>
                  </Link>
                )}
                {page < totalPages && (
                  <Link
                    href={`/ranking?type=${type}&page=${page + 1}`}
                    className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:bg-white dark:hover:bg-slate-700"
                  >
                    <span className="material-symbols-outlined">chevron_right</span>
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
