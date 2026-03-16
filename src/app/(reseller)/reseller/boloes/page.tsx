"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import type { BolaoWithDetails } from "@/types";

export default function ResellerBaloesPage() {
  const [boloes, setBoloes] = useState<BolaoWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 1 });
  const [activeTab, setActiveTab] = useState<"all" | "ACTIVE" | "FINISHED" | "ARCHIVED">("all");

  async function fetchBoloes(page = 1) {
    setLoading(true);
    try {
      const res = await fetch(`/api/reseller/boloes?page=${page}&limit=20`);
      const data = await res.json();
      if (data.success) {
        setBoloes(data.data.boloes);
        setPagination(data.data.pagination);
      }
    } catch {
      toast.error("Erro ao carregar bolões");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBoloes();
  }, []);

  const filtered = activeTab === "all"
    ? boloes
    : boloes.filter((b) => (b.status as string) === activeTab);

  const tabs = [
    { key: "all", label: "Todos" },
    { key: "ACTIVE", label: "Ativos" },
    { key: "FINISHED", label: "Finalizados" },
    { key: "ARCHIVED", label: "Arquivados" },
  ] as const;

  function getStatusBadge(status: string) {
    switch (status) {
      case "ACTIVE":
        return (
          <span className="flex items-center gap-1.5 text-emerald-500 text-[10px] font-bold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block"></span>
            Ativo
          </span>
        );
      case "FINISHED":
        return (
          <span className="flex items-center gap-1.5 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500 inline-block"></span>
            Finalizado
          </span>
        );
      case "ARCHIVED":
        return (
          <span className="flex items-center gap-1.5 text-[#FF6B00] text-[10px] font-bold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00] inline-block"></span>
            Arquivado
          </span>
        );
      default:
        return (
          <span className="text-slate-500 text-[10px] font-bold uppercase">{status}</span>
        );
    }
  }

  const activeBoloes = boloes.filter((b) => b.status === "ACTIVE").length;
  const totalParticipants = boloes.reduce((acc, b) => acc + (b.membersCount ?? 0), 0);

  return (
    <div className="p-6 md:p-8 space-y-8">
      {/* Page Title & CTA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white">Gerenciamento de Bolões</h1>
          <p className="text-slate-400 mt-1">Administre as ligas privadas e competições da sua plataforma.</p>
        </div>
        <button className="bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-[#FF6B00]/30 active:scale-95 self-start md:self-auto">
          <span className="material-symbols-outlined">add_circle</span>
          Criar bolão
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 rounded-2xl bg-[#1A2233] border border-slate-800">
          <p className="text-sm font-medium text-slate-400">Bolões Ativos</p>
          <div className="flex items-end justify-between mt-2">
            <h3 className="text-3xl font-bold text-white">{activeBoloes}</h3>
            <span className="text-emerald-500 text-sm font-bold flex items-center bg-emerald-500/10 px-2 py-0.5 rounded-full">
              <span className="material-symbols-outlined text-xs">trending_up</span> 5%
            </span>
          </div>
        </div>
        <div className="p-6 rounded-2xl bg-[#1A2233] border border-slate-800">
          <p className="text-sm font-medium text-slate-400">Participantes Totais</p>
          <div className="flex items-end justify-between mt-2">
            <h3 className="text-3xl font-bold text-white">{totalParticipants.toLocaleString("pt-BR")}</h3>
            <span className="text-emerald-500 text-sm font-bold flex items-center bg-emerald-500/10 px-2 py-0.5 rounded-full">
              <span className="material-symbols-outlined text-xs">trending_up</span> 12%
            </span>
          </div>
        </div>
        <div className="p-6 rounded-2xl bg-[#1A2233] border border-slate-800">
          <p className="text-sm font-medium text-slate-400">Total</p>
          <div className="flex items-end justify-between mt-2">
            <h3 className="text-3xl font-bold text-white">{pagination.total}</h3>
            <span className="text-[#FF6B00] text-sm font-bold flex items-center bg-[#FF6B00]/10 px-2 py-0.5 rounded-full">
              <span className="material-symbols-outlined text-xs">calendar_today</span> Total
            </span>
          </div>
        </div>
        <div className="p-6 rounded-2xl bg-[#1A2233] border border-slate-800">
          <p className="text-sm font-medium text-slate-400">Finalizados</p>
          <div className="flex items-end justify-between mt-2">
            <h3 className="text-3xl font-bold text-[#FF6B00]">
              {boloes.filter((b) => (b.status as string) === "FINISHED").length}
            </h3>
            <span className="text-slate-400 text-xs font-medium">concluídos</span>
          </div>
        </div>
      </div>

      {/* Filters and Tabs */}
      <div className="flex border-b border-slate-800 gap-8">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`pb-4 border-b-2 font-bold text-sm px-2 transition-colors ${
              activeTab === tab.key
                ? "border-[#FF6B00] text-[#FF6B00]"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Data Table */}
      <div className="bg-[#1A2233] border border-slate-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500 text-sm">Carregando...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm">Nenhum bolão encontrado</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/50 border-b border-slate-800">
                  <th className="px-6 py-4 text-xs font-bold uppercase text-slate-400 tracking-wider">Nome do Bolão</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-slate-400 tracking-wider hidden md:table-cell">Criado por</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-slate-400 tracking-wider text-center">Participantes</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-slate-400 tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-slate-400 tracking-wider hidden lg:table-cell">Criado em</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-slate-400 tracking-wider text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filtered.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-900/30 transition-colors">
                    <td className="px-6 py-4 font-bold text-sm text-white">
                      {b.name}
                      {b.description && (
                        <p className="text-xs text-slate-500 font-normal truncate max-w-xs mt-0.5">{b.description}</p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-300 hidden md:table-cell">Admin</td>
                    <td className="px-6 py-4 text-center text-sm font-bold text-white">{b.membersCount ?? 0}</td>
                    <td className="px-6 py-4">{getStatusBadge(b.status)}</td>
                    <td className="px-6 py-4 text-sm text-slate-500 hidden lg:table-cell">
                      {new Date(b.createdAt).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-1.5 rounded-lg hover:bg-[#FF6B00]/20 text-slate-400 hover:text-[#FF6B00] transition-colors">
                          <span className="material-symbols-outlined text-xl">edit</span>
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-[#FF6B00]/20 text-slate-400 hover:text-[#FF6B00] transition-colors">
                          <span className="material-symbols-outlined text-xl">more_vert</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Mostrando 1-{Math.min(boloes.length, 20)} de {pagination.total} bolões
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => fetchBoloes(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-3 py-1 text-xs font-bold border border-slate-800 rounded-lg hover:bg-slate-900 transition-colors disabled:opacity-40"
              >
                Anterior
              </button>
              {Array.from({ length: Math.min(pagination.totalPages, 5) }).map((_, i) => {
                const p = i + 1;
                return (
                  <button
                    key={p}
                    onClick={() => fetchBoloes(p)}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                      pagination.page === p
                        ? "bg-[#FF6B00] text-white"
                        : "border border-slate-800 hover:bg-slate-900"
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
              <button
                onClick={() => fetchBoloes(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="px-3 py-1 text-xs font-bold border border-slate-800 rounded-lg hover:bg-slate-900 transition-colors disabled:opacity-40"
              >
                Próximo
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer Help */}
      <div className="bg-[#1A2233] rounded-2xl p-6 border border-slate-800 flex flex-col md:flex-row items-center gap-6">
        <div className="w-16 h-16 rounded-full bg-[#FF6B00]/10 flex items-center justify-center text-[#FF6B00] shrink-0">
          <span className="material-symbols-outlined text-3xl">help</span>
        </div>
        <div className="flex-1 text-center md:text-left">
          <h4 className="font-bold text-lg text-white">Precisa de ajuda com as ligas?</h4>
          <p className="text-slate-400 text-sm mt-1">
            Consulte nossa documentação sobre como configurar bolões automáticos ou entre em contato com o suporte VIP para revendedores.
          </p>
        </div>
        <button className="border-2 border-[#FF6B00] text-[#FF6B00] hover:bg-[#FF6B00] hover:text-white transition-all font-bold px-6 py-2 rounded-xl shrink-0">
          Ver Tutorial
        </button>
      </div>
    </div>
  );
}
