import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ResellerDashboardPage() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "RESELLER") {
    redirect("/login");
  }

  const tenant = await prisma.tenant.findFirst({
    where: { users: { some: { id: session.user.id } } },
    include: { subscription: true },
  });

  if (!tenant) redirect("/login");

  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [totalUsers, activeUsers, totalBoloes, totalPredictions] =
    await Promise.all([
      prisma.user.count({ where: { tenantId: tenant.id, role: "USER" } }),
      prisma.user.count({
        where: {
          tenantId: tenant.id,
          role: "USER",
          predictions: { some: { submittedAt: { gte: sevenDaysAgo } } },
        },
      }),
      prisma.bolao.count({ where: { tenantId: tenant.id } }),
      prisma.prediction.count({
        where: { user: { tenantId: tenant.id } },
      }),
    ]);

  const recentUsers = await prisma.user.findMany({
    where: { tenantId: tenant.id, role: "USER" },
    select: { id: true, name: true, email: true, totalPoints: true, createdAt: true },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const activeBoloes = await prisma.bolao.findMany({
    where: { tenantId: tenant.id, status: "ACTIVE" },
    select: { id: true, name: true, _count: { select: { members: true } } },
    take: 3,
  });

  const planExpiresIn = tenant.planExpiresAt
    ? Math.ceil(
        (tenant.planExpiresAt.getTime() - now.getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : null;

  const userName = session.user.name?.split(" ")[0] ?? "Admin";

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto w-full space-y-8">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white">Olá, {userName} 👋</h2>
          <p className="text-slate-400 mt-1">
            Aqui está o resumo da sua plataforma{" "}
            <span className="text-[#FF6B00] font-medium">{tenant.platformName}</span>.
          </p>
        </div>
        <div className="flex gap-3">
          <div className="bg-[#1A2233] border border-white/10 px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">diamond</span>
            <span className="text-[#FF6B00]">{tenant.plan}</span>
            {planExpiresIn !== null && (
              <span className="text-slate-400 text-xs ml-1">
                · {planExpiresIn > 0 ? `${planExpiresIn}d restantes` : "Expirado"}
              </span>
            )}
          </div>
          <Link
            href="/reseller/boloes"
            className="bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors"
          >
            <span className="material-symbols-outlined text-lg">add_circle</span>
            Novo Bolão
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link href="/reseller/usuarios">
          <div className="bg-[#1A2233] p-6 rounded-xl border border-white/5 shadow-sm hover:border-[#FF6B00]/20 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg">
                <span className="material-symbols-outlined">person_add</span>
              </div>
            </div>
            <p className="text-slate-400 text-sm font-medium">Usuários Registrados</p>
            <h3 className="text-2xl font-bold mt-1 text-white">{totalUsers.toLocaleString("pt-BR")}</h3>
          </div>
        </Link>

        <Link href="/reseller/relatorios">
          <div className="bg-[#1A2233] p-6 rounded-xl border border-white/5 shadow-sm hover:border-[#FF6B00]/20 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-[#FF6B00]/10 text-[#FF6B00] rounded-lg">
                <span className="material-symbols-outlined">bolt</span>
              </div>
            </div>
            <p className="text-slate-400 text-sm font-medium">Ativos (7 dias)</p>
            <h3 className="text-2xl font-bold mt-1 text-white">{activeUsers.toLocaleString("pt-BR")}</h3>
          </div>
        </Link>

        <Link href="/reseller/relatorios">
          <div className="bg-[#1A2233] p-6 rounded-xl border border-white/5 shadow-sm hover:border-[#FF6B00]/20 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg">
                <span className="material-symbols-outlined">query_stats</span>
              </div>
            </div>
            <p className="text-slate-400 text-sm font-medium">Palpites Totais</p>
            <h3 className="text-2xl font-bold mt-1 text-white">{totalPredictions.toLocaleString("pt-BR")}</h3>
          </div>
        </Link>

        <Link href="/reseller/boloes">
          <div className="bg-[#1A2233] p-6 rounded-xl border border-white/5 shadow-sm hover:border-[#FF6B00]/20 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg">
                <span className="material-symbols-outlined">trophy</span>
              </div>
            </div>
            <p className="text-slate-400 text-sm font-medium">Bolões</p>
            <h3 className="text-2xl font-bold mt-1 text-white">{totalBoloes.toLocaleString("pt-BR")}</h3>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Engajamento + Widgets */}
        <div className="lg:col-span-2 space-y-8">
          {/* Engajamento Chart */}
          <div className="bg-[#1A2233] rounded-xl border border-white/5 overflow-hidden">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <h3 className="font-bold flex items-center gap-2 text-white">
                <span className="material-symbols-outlined text-[#FF6B00]">analytics</span>
                Engajamento Mensal
              </h3>
              <span className="text-xs text-slate-500 font-medium">Últimos 30 dias</span>
            </div>
            <div className="p-6">
              <div className="h-48 w-full flex items-end gap-2 px-2">
                {[40, 55, 45, 70, 85, 60, 95, 75, 50, 65, 80, 40].map((h, i) => (
                  <div
                    key={i}
                    className={`w-full rounded-t-sm ${i === 6 ? "bg-[#FF6B00]" : "bg-[#FF6B00]/20"}`}
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-4 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                <span>01</span>
                <span>07</span>
                <span>14</span>
                <span>21</span>
                <span>30</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bolões Ativos */}
            <div className="bg-[#1A2233] rounded-xl border border-white/5 p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-white">Bolões Ativos</h3>
                <Link className="text-[#FF6B00] text-xs font-bold hover:underline" href="/reseller/boloes">
                  Ver todos
                </Link>
              </div>
              <div className="space-y-4">
                {activeBoloes.length > 0 ? (
                  activeBoloes.map((b) => (
                    <div key={b.id} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-white/5 flex items-center justify-center text-[#FF6B00] font-bold text-xs">
                        {b.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{b.name}</p>
                        <p className="text-xs text-slate-500">{b._count.members} participantes</p>
                      </div>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500 text-sm text-center py-4">Nenhum bolão ativo</p>
                )}
              </div>
            </div>

            {/* Usuários Recentes */}
            <div className="bg-[#1A2233] rounded-xl border border-white/5 p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-white">Usuários Recentes</h3>
                <Link className="text-[#FF6B00] text-xs font-bold hover:underline" href="/reseller/usuarios">
                  Ver todos
                </Link>
              </div>
              <div className="space-y-4">
                {recentUsers.length > 0 ? (
                  recentUsers.map((u) => (
                    <div key={u.id} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#FF6B00]/20 border border-[#FF6B00]/30 flex items-center justify-center text-xs font-bold text-[#FF6B00] shrink-0">
                        {u.name[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{u.name}</p>
                        <p className="text-[10px] text-slate-500 uppercase truncate">{u.email}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500 text-sm text-center py-4">Nenhum usuário ainda</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-8">
          {/* Ações Rápidas */}
          <div className="bg-[#1A2233] rounded-xl border border-white/5 p-6">
            <h3 className="font-bold text-white mb-4">Ações Rápidas</h3>
            <div className="grid grid-cols-1 gap-3">
              <Link href="/reseller/personalizacao">
                <button className="w-full flex items-center gap-3 p-3 rounded-lg border border-white/5 hover:bg-[#FF6B00]/5 transition-colors group text-left">
                  <span className="material-symbols-outlined text-[#FF6B00] p-2 bg-[#FF6B00]/10 rounded-lg">edit_note</span>
                  <div>
                    <p className="text-sm font-semibold text-white group-hover:text-[#FF6B00] transition-colors">Customizar UI</p>
                    <p className="text-[10px] text-slate-500 uppercase">Logo, cores e fontes</p>
                  </div>
                </button>
              </Link>
              <Link href="/reseller/usuarios">
                <button className="w-full flex items-center gap-3 p-3 rounded-lg border border-white/5 hover:bg-[#FF6B00]/5 transition-colors group text-left">
                  <span className="material-symbols-outlined text-[#FF6B00] p-2 bg-[#FF6B00]/10 rounded-lg">person_add_alt</span>
                  <div>
                    <p className="text-sm font-semibold text-white group-hover:text-[#FF6B00] transition-colors">Gerenciar Usuários</p>
                    <p className="text-[10px] text-slate-500 uppercase">Ver, bloquear e pontuar</p>
                  </div>
                </button>
              </Link>
              <Link href="/reseller/relatorios">
                <button className="w-full flex items-center gap-3 p-3 rounded-lg border border-white/5 hover:bg-[#FF6B00]/5 transition-colors group text-left">
                  <span className="material-symbols-outlined text-[#FF6B00] p-2 bg-[#FF6B00]/10 rounded-lg">analytics</span>
                  <div>
                    <p className="text-sm font-semibold text-white group-hover:text-[#FF6B00] transition-colors">Ver Relatórios</p>
                    <p className="text-[10px] text-slate-500 uppercase">Analytics e engajamento</p>
                  </div>
                </button>
              </Link>
            </div>
          </div>

          {/* Status do Sistema */}
          <div className="bg-[#1A2233] rounded-xl border border-white/5 p-6">
            <h3 className="font-bold text-white mb-4">Status do Sistema</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-500 text-sm">check_circle</span>
                  <span className="text-sm text-slate-300">Plataforma</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">ONLINE</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-500 text-sm">lock</span>
                  <span className="text-sm text-slate-300">Domínio &amp; SSL</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">ATIVO</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-500 text-sm">database</span>
                  <span className="text-sm text-slate-300">API Feed</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">ESTÁVEL</span>
              </div>
            </div>
          </div>

          {/* Upgrade Card */}
          <div className="relative overflow-hidden bg-[#FF6B00]/10 border border-[#FF6B00]/20 rounded-xl p-6 text-white">
            <div className="relative z-10">
              <h4 className="font-bold text-lg leading-tight">Melhore seu Alcance</h4>
              <p className="text-sm text-slate-400 mt-2 mb-4">
                O plano Enterprise permite até 50 mil usuários simultâneos e suporte 24/7.
              </p>
              <button className="bg-[#FF6B00] text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg shadow-black/10 hover:bg-[#FF6B00]/90 transition-colors">
                Falar com Consultor
              </button>
            </div>
            <span className="material-symbols-outlined absolute -bottom-4 -right-4 text-9xl text-[#FF6B00]/10 rotate-12">rocket_launch</span>
          </div>
        </div>
      </div>
    </div>
  );
}
