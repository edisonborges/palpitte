"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";

interface Analytics {
  overview: {
    totalUsers: number;
    activeUsers7d: number;
    newUsers30d: number;
    totalBoloes: number;
    totalPredictions: number;
    totalRedemptions: number;
    engagementRate: number;
  };
  dailySignups: { date: string; count: number }[];
}

export default function RelatoriosPage() {
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/reseller/analytics")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setData(d.data);
      })
      .catch(() => toast.error("Erro ao carregar relatórios"))
      .finally(() => setLoading(false));
  }, []);

  const overview = data?.overview;
  const dailySignups = data?.dailySignups ?? [];

  // Chart bars from daily signups (last 9 data points)
  const chartBars = dailySignups.slice(-9);
  const maxVal = Math.max(...chartBars.map((d) => d.count), 1);

  // Horizontal bar: competitions placeholder data
  const competitions = [
    { name: "Copa Libertadores", pct: 92, label: "2.4k palpites/dia" },
    { name: "Champions League", pct: 85, label: "2.1k palpites/dia" },
    { name: "Brasileirão Série A", pct: 72, label: "1.8k palpites/dia" },
    { name: "Premier League", pct: 48, label: "1.2k palpites/dia" },
    { name: "La Liga", pct: 35, label: "0.9k palpites/dia" },
  ];

  const dayLabels = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const dayBars = [
    { day: "Dom", pct: 45, val: "4.2" },
    { day: "Seg", pct: 65, val: "6.8" },
    { day: "Ter", pct: 85, val: "8.1" },
    { day: "Qua", pct: 100, val: "9.4" },
    { day: "Qui", pct: 90, val: "8.9" },
    { day: "Sex", pct: 75, val: "7.5" },
    { day: "Sáb", pct: 55, val: "5.3" },
  ];

  const kpis = [
    {
      label: "Total de Usuários",
      value: loading ? "—" : (overview?.totalUsers ?? 0).toLocaleString("pt-BR"),
      icon: "group",
      trend: "+12%",
      trendUp: true,
    },
    {
      label: "Palpites Totais",
      value: loading ? "—" : (overview?.totalPredictions ?? 0).toLocaleString("pt-BR"),
      icon: "online_prediction",
      trend: "+5%",
      trendUp: true,
    },
    {
      label: "Taxa Engajamento",
      value: loading ? "—" : `${overview?.engagementRate ?? 0}%`,
      icon: "target",
      trend: "-2%",
      trendUp: false,
    },
    {
      label: "Ativos (7 dias)",
      value: loading ? "—" : (overview?.activeUsers7d ?? 0).toLocaleString("pt-BR"),
      icon: "timer",
      trend: "+0.5%",
      trendUp: true,
    },
    {
      label: "Novos (30 dias)",
      value: loading ? "—" : (overview?.newUsers30d ?? 0).toLocaleString("pt-BR"),
      icon: "person_remove",
      trend: "+1%",
      trendUp: true,
    },
  ];

  return (
    <div className="p-6 lg:p-10 space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h3 className="text-3xl font-extrabold tracking-tight text-white">Business Intelligence</h3>
          <p className="text-slate-400 mt-1 max-w-xl">
            Acompanhe métricas em tempo real e analise o comportamento dos seus usuários e o crescimento da sua rede.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-[#FF6B00] text-white rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-[#FF6B00]/90 transition-all shadow-lg shadow-[#FF6B00]/20">
            <span className="material-symbols-outlined text-sm">download</span>
            Exportar PDF
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="flex flex-col gap-2 rounded-xl p-5 border border-slate-800 bg-[#1A2233] hover:border-[#FF6B00]/30 transition-colors"
          >
            <div className="flex items-center justify-between">
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">{kpi.label}</p>
              <span className="material-symbols-outlined text-[#FF6B00] text-sm">{kpi.icon}</span>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-black leading-tight text-white">{kpi.value}</p>
              <span
                className={`text-xs font-bold flex items-center ${
                  kpi.trendUp ? "text-emerald-500" : "text-red-500"
                }`}
              >
                <span className="material-symbols-outlined text-xs">
                  {kpi.trendUp ? "arrow_upward" : "arrow_downward"}
                </span>
                {kpi.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Growth Area Chart */}
        <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-[#1A2233] p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h4 className="text-lg font-bold text-white">Crescimento de Usuários</h4>
              <p className="text-xs text-slate-500">Últimos 30 dias</p>
            </div>
            <select className="bg-[#0B1120] border-slate-700 text-xs rounded-lg text-slate-300 focus:ring-1 focus:ring-[#FF6B00] pr-8 py-1.5">
              <option>Mensal</option>
              <option>Semanal</option>
            </select>
          </div>
          <div className="relative h-75 w-full flex items-end justify-between gap-1 overflow-hidden">
            {chartBars.length > 0
              ? chartBars.map((bar, i) => {
                  const heightPct = Math.max((bar.count / maxVal) * 100, 4);
                  const isLast = i === chartBars.length - 1;
                  return (
                    <div
                      key={i}
                      className={`flex-1 rounded-t-sm ${isLast ? "bg-[#FF6B00]" : "bg-[#FF6B00]/30"}`}
                      style={{ height: `${heightPct}%` }}
                    />
                  );
                })
              : [30, 35, 45, 40, 55, 70, 65, 85, 100].map((h, i) => (
                  <div
                    key={i}
                    className={`flex-1 rounded-t-sm ${i === 8 ? "bg-[#FF6B00]" : `bg-[#FF6B00]/${20 + i * 5}`}`}
                    style={{ height: `${h}%` }}
                  />
                ))}
          </div>
          <div className="flex justify-between mt-4 text-[10px] text-slate-500 uppercase tracking-tighter font-bold">
            <span>01 Jan</span>
            <span>08 Jan</span>
            <span>15 Jan</span>
            <span>22 Jan</span>
            <span>30 Jan</span>
          </div>
        </div>

        {/* Predictions per Day Bar Chart */}
        <div className="rounded-xl border border-slate-800 bg-[#1A2233] p-6">
          <div className="mb-8">
            <h4 className="text-lg font-bold text-white">Palpites por Dia</h4>
            <p className="text-xs text-slate-500">Média diária por usuário</p>
          </div>
          <div className="space-y-4 h-75 flex flex-col justify-between">
            {dayBars.map((bar) => (
              <div key={bar.day} className="flex items-center gap-3">
                <span className="text-xs font-medium w-8 text-slate-400">{bar.day}</span>
                <div className="flex-1 h-3 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#FF6B00]/70 rounded-full"
                    style={{ width: `${bar.pct}%` }}
                  ></div>
                </div>
                <span className="text-xs font-bold text-slate-300">{bar.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Donut Chart Retention */}
        <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-[#1A2233] p-6">
          <h4 className="text-lg font-bold mb-6 text-white">Retenção de Usuários</h4>
          <div className="flex flex-col items-center justify-center h-full pb-6">
            <div className="relative w-48 h-48 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  className="text-slate-800"
                  cx="96"
                  cy="96"
                  fill="transparent"
                  r="80"
                  stroke="currentColor"
                  strokeWidth="20"
                />
                <circle
                  className="text-[#FF6B00]"
                  cx="96"
                  cy="96"
                  fill="transparent"
                  r="80"
                  stroke="currentColor"
                  strokeDasharray="502.65"
                  strokeDashoffset="125.66"
                  strokeWidth="20"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-4xl font-black text-white">
                  {loading ? "—" : `${overview?.engagementRate ?? 75}%`}
                </span>
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Retenção</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-8 mt-4 w-full px-4">
              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-[#FF6B00]"></div>
                  <span className="text-xs font-medium text-slate-400">Ativos</span>
                </div>
                <p className="text-lg font-bold text-white">
                  {loading ? "—" : (overview?.activeUsers7d ?? 0).toLocaleString("pt-BR")}
                </p>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-slate-700"></div>
                  <span className="text-xs font-medium text-slate-400">Inativos</span>
                </div>
                <p className="text-lg font-bold text-white">
                  {loading ? "—" : ((overview?.totalUsers ?? 0) - (overview?.activeUsers7d ?? 0)).toLocaleString("pt-BR")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Most Active Competitions */}
        <div className="lg:col-span-3 rounded-xl border border-slate-800 bg-[#1A2233] p-6">
          <div className="flex items-center justify-between mb-8">
            <h4 className="text-lg font-bold text-white">Competições Mais Ativas</h4>
            <span className="material-symbols-outlined text-slate-600">info</span>
          </div>
          <div className="space-y-6">
            {competitions.map((comp) => (
              <div key={comp.name} className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-300">{comp.name}</span>
                  <span className="font-bold text-[#FF6B00]">{comp.label}</span>
                </div>
                <div className="w-full h-4 bg-slate-800 rounded-lg overflow-hidden">
                  <div
                    className="h-full bg-[#FF6B00] rounded-lg"
                    style={{ width: `${comp.pct}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-auto p-6 text-center border-t border-slate-800">
        <p className="text-xs text-slate-500">
          © {new Date().getFullYear()} Palpitte BI Dashboard. Analytics atualizados a cada 5 minutos.
        </p>
      </footer>
    </div>
  );
}
