"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import type { UserSummary } from "@/types";

export default function UsuariosPage() {
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    totalPages: 1,
  });
  const [activeTab, setActiveTab] = useState<"" | "ACTIVE" | "SUSPENDED" | "PENDING">("");

  const fetchUsers = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "20",
        ...(search && { search }),
        ...(statusFilter && { status: statusFilter }),
      });
      const res = await fetch(`/api/reseller/users?${params}`);
      const data = await res.json();
      if (data.success) {
        setUsers(data.data.users);
        setPagination(data.data.pagination);
      }
    } catch {
      toast.error("Erro ao carregar usuários");
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    const t = setTimeout(() => fetchUsers(1), 300);
    return () => clearTimeout(t);
  }, [fetchUsers]);

  function handleTabChange(tab: "" | "ACTIVE" | "SUSPENDED" | "PENDING") {
    setActiveTab(tab);
    setStatusFilter(tab);
  }

  function handleStatusChange(userId: string, status: "ACTIVE" | "SUSPENDED") {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status } : u))
    );
  }

  function getStatusBadge(status: string) {
    switch (status) {
      case "ACTIVE":
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/10 text-emerald-500 ring-1 ring-emerald-500/20">
            Ativo
          </span>
        );
      case "SUSPENDED":
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-rose-500/10 text-rose-500 ring-1 ring-rose-500/20">
            Bloqueado
          </span>
        );
      case "PENDING":
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-amber-500/10 text-amber-500 ring-1 ring-amber-500/20">
            Pendente
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-slate-700 text-slate-400">
            {status}
          </span>
        );
    }
  }

  const activeCount = users.filter((u) => u.status === "ACTIVE").length;
  const suspendedCount = users.filter((u) => u.status === "SUSPENDED").length;

  return (
    <div className="p-6 md:p-8 space-y-8">
      {/* Page Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Usuários</h1>
          <p className="text-slate-400 mt-1">
            Gerencie a base de apostadores da plataforma.
          </p>
        </div>
        <button className="bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-[#FF6B00]/20 transition-all">
          <span className="material-symbols-outlined">person_add</span>
          Novo Usuário
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#1A2233] p-6 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <span className="material-symbols-outlined">group</span>
            </div>
            <span className="text-emerald-500 text-sm font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">trending_up</span> +12%
            </span>
          </div>
          <p className="text-slate-400 text-sm font-medium">Total de Usuários</p>
          <h3 className="text-3xl font-bold mt-1 text-white">{pagination.total.toLocaleString("pt-BR")}</h3>
        </div>
        <div className="bg-[#1A2233] p-6 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-[#FF6B00]/10 text-[#FF6B00] flex items-center justify-center">
              <span className="material-symbols-outlined">bolt</span>
            </div>
            <span className="text-emerald-500 text-sm font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">trending_up</span> +5%
            </span>
          </div>
          <p className="text-slate-400 text-sm font-medium">Ativos (página atual)</p>
          <h3 className="text-3xl font-bold mt-1 text-white">{activeCount.toLocaleString("pt-BR")}</h3>
        </div>
        <div className="bg-[#1A2233] p-6 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center">
              <span className="material-symbols-outlined">block</span>
            </div>
            <span className="text-rose-500 text-sm font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">trending_down</span> -2%
            </span>
          </div>
          <p className="text-slate-400 text-sm font-medium">Bloqueados</p>
          <h3 className="text-3xl font-bold mt-1 text-white">{suspendedCount.toLocaleString("pt-BR")}</h3>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-[#1A2233] rounded-xl border border-slate-800 overflow-hidden">
        {/* Table Filters */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por nome, email ou ID..."
                className="bg-slate-800 border-none rounded-lg py-2 pl-10 pr-4 focus:ring-2 focus:ring-[#FF6B00]/50 text-sm transition-all outline-none w-72 text-white placeholder:text-slate-500"
              />
            </div>
            <div className="h-6 w-px bg-slate-800 mx-2 hidden sm:block"></div>
            <div className="hidden sm:flex gap-1">
              {[
                { key: "", label: "Todos" },
                { key: "ACTIVE", label: "Ativos" },
                { key: "PENDING", label: "Pendentes" },
                { key: "SUSPENDED", label: "Bloqueados" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => handleTabChange(tab.key as "" | "ACTIVE" | "SUSPENDED" | "PENDING")}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${
                    activeTab === tab.key
                      ? "bg-[#FF6B00] text-white"
                      : "text-slate-500 hover:bg-slate-800"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 uppercase font-bold tracking-wider hidden sm:block">Ordenar por:</span>
            <select className="bg-transparent border-none text-sm font-medium focus:ring-0 cursor-pointer text-slate-300 outline-none">
              <option className="bg-[#1A2233]">Mais recentes</option>
              <option className="bg-[#1A2233]">Alfabética</option>
              <option className="bg-[#1A2233]">Mais pontos</option>
            </select>
          </div>
        </div>

        {/* User Table */}
        {loading ? (
          <div className="p-12 text-center text-slate-500 text-sm">Carregando...</div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm">Nenhum usuário encontrado</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-900/50 border-b border-slate-800 text-slate-400 text-xs uppercase font-bold tracking-wider">
                  <th className="px-6 py-4 w-12 text-center">
                    <input className="rounded border-slate-700 bg-transparent text-[#FF6B00] focus:ring-[#FF6B00]" type="checkbox" />
                  </th>
                  <th className="px-6 py-4">Usuário</th>
                  <th className="px-6 py-4 hidden md:table-cell">Email</th>
                  <th className="px-6 py-4 text-center hidden lg:table-cell">Data Registro</th>
                  <th className="px-6 py-4 text-right">Pontos</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-900/50 transition-colors group">
                    <td className="px-6 py-4 text-center">
                      <input className="rounded border-slate-700 bg-transparent text-[#FF6B00] focus:ring-[#FF6B00]" type="checkbox" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#FF6B00]/20 border border-[#FF6B00]/30 flex items-center justify-center text-[#FF6B00] font-bold text-sm shrink-0">
                          {u.name[0]}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-sm text-white">{u.name}</span>
                          <span className="text-xs text-slate-500 hidden md:block">{u.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-300 hidden md:table-cell">{u.email}</td>
                    <td className="px-6 py-4 text-sm text-center text-slate-400 hidden lg:table-cell">
                      {new Date(u.createdAt).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-6 py-4 text-sm text-right font-bold text-[#FF6B00]">
                      {u.points.toLocaleString("pt-BR")}
                    </td>
                    <td className="px-6 py-4 text-center">{getStatusBadge(u.status)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 hover:text-[#FF6B00] text-slate-400 transition-colors">
                          <span className="material-symbols-outlined text-lg">edit</span>
                        </button>
                        <button
                          onClick={() =>
                            handleStatusChange(
                              u.id,
                              u.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE"
                            )
                          }
                          className="p-1.5 hover:text-[#FF6B00] text-slate-400 transition-colors"
                        >
                          <span className="material-symbols-outlined text-lg">shield_person</span>
                        </button>
                        <button className="p-1.5 hover:text-rose-500 text-slate-400 transition-colors">
                          <span className="material-symbols-outlined text-lg">delete</span>
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
        <div className="p-4 border-t border-slate-800 flex items-center justify-between">
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
            Mostrando {users.length} de {pagination.total.toLocaleString("pt-BR")}
          </p>
          {pagination.totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => fetchUsers(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="p-2 rounded hover:bg-slate-800 text-slate-400 disabled:opacity-40 transition-colors"
              >
                <span className="material-symbols-outlined text-lg">chevron_left</span>
              </button>
              {Array.from({ length: Math.min(pagination.totalPages, 5) }).map((_, i) => {
                const p = i + 1;
                return (
                  <button
                    key={p}
                    onClick={() => fetchUsers(p)}
                    className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
                      pagination.page === p
                        ? "bg-[#FF6B00] text-white"
                        : "hover:bg-slate-800 text-slate-400"
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
              {pagination.totalPages > 5 && (
                <>
                  <span className="px-2 text-slate-400">...</span>
                  <button
                    onClick={() => fetchUsers(pagination.totalPages)}
                    className="px-3 py-1 rounded hover:bg-slate-800 text-xs font-bold text-slate-400 transition-colors"
                  >
                    {pagination.totalPages}
                  </button>
                </>
              )}
              <button
                onClick={() => fetchUsers(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="p-2 rounded hover:bg-slate-800 text-slate-400 disabled:opacity-40 transition-colors"
              >
                <span className="material-symbols-outlined text-lg">chevron_right</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
