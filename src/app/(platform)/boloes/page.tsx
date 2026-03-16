"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import type { BolaoWithDetails } from "@/types";
import Link from "next/link";

export default function BaloesPage() {
  const [boloes, setBoloes] = useState<BolaoWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const [joinLoading, setJoinLoading] = useState(false);

  const [newBolao, setNewBolao] = useState({
    name: "",
    description: "",
    isPublic: false,
    maxMembers: "",
  });

  useEffect(() => {
    fetchBoloes();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchBoloes() {
    setLoading(true);
    try {
      const res = await fetch("/api/boloes?filter=mine");
      const data = await res.json();
      if (data.success) setBoloes(data.data);
    } catch {
      toast.error("Erro ao carregar bolões");
    } finally {
      setLoading(false);
    }
  }

  async function handleJoin() {
    if (!inviteCode.trim()) return;
    setJoinLoading(true);
    try {
      const res = await fetch("/api/boloes/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inviteCode: inviteCode.toUpperCase() }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Erro ao entrar no bolão");
        return;
      }
      toast.success("Você entrou no bolão!");
      setShowJoin(false);
      setInviteCode("");
      fetchBoloes();
    } catch {
      toast.error("Erro de conexão");
    } finally {
      setJoinLoading(false);
    }
  }

  async function handleCreate() {
    if (!newBolao.name.trim()) return;
    try {
      const res = await fetch("/api/boloes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newBolao.name,
          description: newBolao.description,
          isPublic: newBolao.isPublic,
          maxMembers: newBolao.maxMembers ? parseInt(newBolao.maxMembers) : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Erro ao criar bolão");
        return;
      }
      toast.success("Bolão criado!");
      setShowCreate(false);
      setNewBolao({ name: "", description: "", isPublic: false, maxMembers: "" });
      fetchBoloes();
    } catch {
      toast.error("Erro de conexão");
    }
  }

  return (
    <main className="flex-1 min-w-0 overflow-y-auto">
      <div className="max-w-6xl mx-auto p-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2 className="text-4xl font-black tracking-tight text-slate-900 dark:text-slate-100">
                Bolões
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
                Gerencie seus grupos e participe de ligas privadas com amigos.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCreate(true)}
                className="flex items-center gap-2 bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-[#FF6B00]/20"
              >
                <span className="material-symbols-outlined">add_circle</span>
                Criar novo bolão
              </button>
              <button
                onClick={() => setShowJoin(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20"
              >
                <span className="material-symbols-outlined">key</span>
                Entrar com código
              </button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column: Bolão Cards */}
          <div className="xl:col-span-2 space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-slate-100">
              <span className="material-symbols-outlined text-[#FF6B00]">military_tech</span>
              Meus Bolões Ativos
            </h3>

            {loading ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-40 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse"
                  />
                ))}
              </div>
            ) : boloes.length === 0 ? (
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-12 text-center">
                <span className="material-symbols-outlined text-5xl text-slate-400 mb-4 block">
                  groups
                </span>
                <p className="text-slate-500 font-medium">Você ainda não participa de nenhum bolão</p>
                <p className="text-slate-400 text-sm mt-1">
                  Crie um bolão ou entre com um código de convite
                </p>
              </div>
            ) : (
              boloes.map((bolao, idx) => {
                const covers = [
                  "https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=400&h=200&fit=crop",
                  "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=200&fit=crop",
                  "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400&h=200&fit=crop",
                  "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=400&h=200&fit=crop",
                  "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=400&h=200&fit=crop",
                ];
                const cover = covers[idx % covers.length];
                return (
                <div
                  key={bolao.id}
                  className="group relative bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 hover:border-[#FF6B00]/50 transition-all"
                >
                  <div className="flex flex-col md:flex-row gap-0">
                    <div className="w-full md:w-48 h-40 md:h-auto relative flex-shrink-0 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={cover}
                        alt={bolao.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-slate-800/60 md:block hidden" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent md:hidden" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between p-5">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="bg-slate-100 dark:bg-slate-700 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded text-slate-500 dark:text-slate-400">
                              {bolao.isPublic ? "Público" : "Privado"}
                            </span>
                            {bolao.inviteCode && (
                              <span className="bg-[#FF6B00]/10 text-[#FF6B00] text-[10px] uppercase font-bold px-2 py-0.5 rounded">
                                Código: {bolao.inviteCode}
                              </span>
                            )}
                          </div>
                          <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                            {bolao.name}
                          </h4>
                          {bolao.description && (
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                              {bolao.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                          <span className="material-symbols-outlined text-base">group</span>
                          {bolao.membersCount ?? 0} participantes
                        </div>
                        <Link
                          href={`/boloes/${bolao.id}`}
                          className="flex items-center gap-1 text-[#FF6B00] font-bold text-sm hover:underline group-hover:translate-x-1 transition-transform"
                        >
                          Ver Detalhes
                          <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                );
              })
            )}
          </div>

          {/* Right Column: Sidebar Widgets */}
          <div className="space-y-6">
            {/* Join Widget */}
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                  <span className="material-symbols-outlined">vpn_key</span>
                </div>
                <h4 className="font-bold text-lg text-slate-900 dark:text-white">
                  Entrar em um Bolão
                </h4>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                Recebeu um convite? Insira o código alfanumérico abaixo para participar da liga.
              </p>
              <div className="space-y-4">
                <input
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all uppercase font-mono tracking-widest text-slate-900 dark:text-white placeholder:text-slate-400"
                  placeholder="Ex: AMIG-42"
                  type="text"
                />
                <button
                  onClick={handleJoin}
                  disabled={joinLoading || inviteCode.length < 4}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {joinLoading ? "Validando..." : "Validar Código"}
                  <span className="material-symbols-outlined text-base">check_circle</span>
                </button>
              </div>
            </div>

            {/* Stats Widget */}
            <div className="bg-[#FF6B00] border border-[#FF6B00]/20 rounded-2xl p-6 text-white relative overflow-hidden group">
              <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:scale-110 transition-transform">
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "120px", fontVariationSettings: "'FILL' 1" }}
                >
                  trending_up
                </span>
              </div>
              <h4 className="font-bold text-lg mb-4">Desempenho Geral</h4>
              <div className="space-y-4 relative z-10">
                <div className="flex justify-between items-center bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                  <span className="text-xs font-medium text-white/80">Bolões Ativos</span>
                  <span className="text-xl font-black">{boloes.length}</span>
                </div>
                <Link
                  href="/ranking"
                  className="block w-full bg-white text-[#FF6B00] font-bold py-2 rounded-lg text-sm text-center"
                >
                  Ver meu ranking global
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal entrar no bolão */}
      {showJoin && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-sm border border-slate-200 dark:border-slate-700 space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">Entrar no bolão</h3>
            <input
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              placeholder="Código (ex: AMIG-42)"
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2.5 text-center text-lg tracking-widest font-mono text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-[#FF6B00]/50 outline-none"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowJoin(false)}
                className="flex-1 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleJoin}
                disabled={joinLoading || inviteCode.length < 4}
                className="flex-1 py-2.5 rounded-lg bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white font-bold transition-colors disabled:opacity-50"
              >
                {joinLoading ? "Entrando..." : "Entrar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal criar bolão */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-sm border border-slate-200 dark:border-slate-700 space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">Criar bolão</h3>
            <div className="space-y-3">
              <input
                value={newBolao.name}
                onChange={(e) => setNewBolao((p) => ({ ...p, name: e.target.value }))}
                placeholder="Nome do bolão *"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-[#FF6B00]/50 outline-none"
              />
              <textarea
                value={newBolao.description}
                onChange={(e) => setNewBolao((p) => ({ ...p, description: e.target.value }))}
                placeholder="Descrição opcional..."
                rows={2}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-[#FF6B00]/50 outline-none resize-none"
              />
              <input
                type="number"
                value={newBolao.maxMembers}
                onChange={(e) => setNewBolao((p) => ({ ...p, maxMembers: e.target.value }))}
                placeholder="Máx. participantes (opcional)"
                min={2}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-[#FF6B00]/50 outline-none"
              />
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newBolao.isPublic}
                  onChange={(e) => setNewBolao((p) => ({ ...p, isPublic: e.target.checked }))}
                  className="rounded border-slate-300"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300">Bolão público</span>
              </label>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowCreate(false)}
                className="flex-1 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreate}
                disabled={!newBolao.name.trim()}
                className="flex-1 py-2.5 rounded-lg bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white font-bold transition-colors disabled:opacity-50"
              >
                Criar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
