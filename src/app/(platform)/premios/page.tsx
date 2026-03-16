"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import type { Prize } from "@/types";

interface PrizesData {
  prizes: (Prize & { canRedeem: boolean })[];
  userPoints: number;
}

export default function PremiosPage() {
  const [data, setData] = useState<PrizesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [redeemModal, setRedeemModal] = useState<Prize | null>(null);
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Brasil",
  });
  const [redeemLoading, setRedeemLoading] = useState(false);

  useEffect(() => {
    fetchPrizes();
  }, []);

  async function fetchPrizes() {
    setLoading(true);
    try {
      const res = await fetch("/api/prizes");
      const json = await res.json();
      if (json.success) setData(json.data);
    } catch {
      toast.error("Erro ao carregar prêmios");
    } finally {
      setLoading(false);
    }
  }

  async function handleRedeem() {
    if (!redeemModal) return;
    if (!address.street || !address.city || !address.state || !address.zipCode) {
      toast.error("Preencha todos os campos do endereço");
      return;
    }
    setRedeemLoading(true);
    try {
      const res = await fetch("/api/prizes/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prizeId: redeemModal.id, shippingAddress: address }),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error ?? "Erro ao resgatar");
        return;
      }
      toast.success("Prêmio resgatado! Você receberá em breve.");
      setRedeemModal(null);
      fetchPrizes();
    } catch {
      toast.error("Erro de conexão");
    } finally {
      setRedeemLoading(false);
    }
  }

  const userPoints = data?.userPoints ?? 0;
  const maxGoal = 2000;
  const progressPct = Math.min(Math.round((userPoints / maxGoal) * 100), 100);

  return (
    <main className="ml-0 flex-1 p-8 max-w-[1280px]">
      {/* Header */}
      <header className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-4xl font-black tracking-tight mb-2 text-slate-900 dark:text-slate-100">
            Prêmios 🎁
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-lg">
            Troque seus pontos por recompensas exclusivas e upgrades de conta.
          </p>
        </div>
      </header>

      {/* Progress Banner */}
      <section className="mb-12 bg-slate-100 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="flex flex-col items-center justify-center p-4 bg-[#FF6B00] rounded-2xl text-white min-w-[180px] shadow-lg shadow-[#FF6B00]/20">
            <span className="text-xs font-bold uppercase tracking-wider opacity-80">
              Saldo Atual
            </span>
            <span className="text-3xl font-black">
              {userPoints.toLocaleString("pt-BR")} pts
            </span>
          </div>
          <div className="flex-1 w-full">
            <div className="flex justify-between items-end mb-3">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                  Próxima Meta:{" "}
                  <span className="text-yellow-500 flex items-center gap-1">
                    Nível Ouro{" "}
                    <span
                      className="material-symbols-outlined text-lg"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      workspace_premium
                    </span>
                  </span>
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Faltam {Math.max(maxGoal - userPoints, 0).toLocaleString("pt-BR")} pts para
                  desbloquear o próximo marco de recompensas.
                </p>
              </div>
              <span className="text-[#FF6B00] font-black text-xl">{progressPct}%</span>
            </div>
            <div className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#FF6B00] rounded-full transition-all duration-1000"
                style={{ width: `${progressPct}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-3 px-1">
              <span className="material-symbols-outlined text-slate-400">stars</span>
              <span className="material-symbols-outlined text-yellow-500">military_tech</span>
              <span className="material-symbols-outlined text-slate-600">trophy</span>
            </div>
          </div>
          <button className="bg-[#FF6B00]/10 hover:bg-[#FF6B00]/20 text-[#FF6B00] px-6 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap">
            Ver Histórico
          </button>
        </div>
        <div className="absolute -right-16 -bottom-16 size-64 bg-[#FF6B00]/5 rounded-full blur-3xl"></div>
      </section>

      {/* Prize Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-72 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      ) : data && data.prizes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {data.prizes.map((prize) => {
            const canRedeem = prize.canRedeem;
            const progress =
              !canRedeem && userPoints > 0
                ? Math.min(Math.round((userPoints / prize.pointsCost) * 100), 100)
                : 100;
            const isLocked = prize.pointsCost > userPoints * 2;

            return (
              <div
                key={prize.id}
                className={`bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border transition-transform hover:-translate-y-1 ${
                  canRedeem
                    ? "border-[#FF6B00] shadow-lg shadow-[#FF6B00]/20"
                    : isLocked
                    ? "border-slate-200 dark:border-slate-700 opacity-60 grayscale"
                    : "border-slate-200 dark:border-slate-700"
                }`}
              >
                <div
                  className="h-48 bg-cover bg-center relative bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600"
                  style={prize.imageUrl ? { backgroundImage: `url('${prize.imageUrl}')` } : {}}
                >
                  {isLocked && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="material-symbols-outlined text-5xl text-white opacity-80">
                        lock
                      </span>
                    </div>
                  )}
                  <div
                    className={`absolute top-4 right-4 text-[10px] font-bold px-3 py-1 rounded-full uppercase ${
                      canRedeem
                        ? "bg-[#FF6B00] text-white"
                        : isLocked
                        ? "bg-slate-500 text-white"
                        : "bg-yellow-400 text-yellow-950"
                    }`}
                  >
                    {canRedeem ? "Disponível" : isLocked ? "Bloqueado" : "Quase lá"}
                  </div>
                  {!prize.imageUrl && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="material-symbols-outlined text-6xl text-slate-400 dark:text-slate-500">
                        redeem
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-xl font-bold mb-1 text-slate-900 dark:text-white">
                        {prize.name}
                      </h4>
                      {prize.description && (
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {prize.description}
                        </p>
                      )}
                    </div>
                    <div
                      className={`font-black text-lg ${
                        canRedeem ? "text-[#FF6B00]" : "text-slate-400"
                      }`}
                    >
                      {prize.pointsCost.toLocaleString("pt-BR")} pts
                    </div>
                  </div>

                  {!canRedeem && !isLocked && (
                    <div className="mb-4">
                      <div className="flex justify-between text-[10px] font-bold mb-1 uppercase text-slate-500">
                        <span>Progresso</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#FF6B00] rounded-full"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {canRedeem ? (
                    <button
                      onClick={() => setRedeemModal(prize)}
                      className="w-full bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined text-lg">shopping_bag</span>
                      Resgatar Agora
                    </button>
                  ) : isLocked ? (
                    <div className="flex items-center gap-2 text-[#FF6B00] font-bold text-xs uppercase">
                      <span className="material-symbols-outlined text-sm">workspace_premium</span>
                      Requer mais pontos
                    </div>
                  ) : (
                    <button
                      disabled
                      className="w-full bg-slate-100 dark:bg-slate-700 text-slate-400 font-bold py-3 rounded-xl cursor-not-allowed"
                    >
                      Faltam {(prize.pointsCost - userPoints).toLocaleString("pt-BR")} pts
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-700">
          <span className="material-symbols-outlined text-5xl text-slate-400 mb-4 block">
            redeem
          </span>
          <p className="text-slate-500 font-medium">Nenhum prêmio disponível no momento</p>
          <p className="text-slate-400 text-sm mt-1">
            Continue fazendo palpites para ganhar pontos!
          </p>
        </div>
      )}

      {/* Modal de resgate */}
      {redeemModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md border border-slate-200 dark:border-slate-700 space-y-4">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-lg">
                Resgatar prêmio
              </h3>
              <p className="text-slate-500 text-sm">{redeemModal.name}</p>
            </div>
            <div className="bg-[#FF6B00]/10 border border-[#FF6B00]/20 rounded-lg px-4 py-3">
              <p className="text-sm text-[#FF6B00]">
                Custo:{" "}
                <span className="font-bold">
                  {redeemModal.pointsCost.toLocaleString("pt-BR")} pontos
                </span>
              </p>
            </div>
            <div className="space-y-3">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Endereço de entrega
              </p>
              <input
                value={address.street}
                onChange={(e) => setAddress((p) => ({ ...p, street: e.target.value }))}
                placeholder="Rua, número, complemento"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-[#FF6B00]/50 outline-none"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  value={address.city}
                  onChange={(e) => setAddress((p) => ({ ...p, city: e.target.value }))}
                  placeholder="Cidade"
                  className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-[#FF6B00]/50 outline-none"
                />
                <input
                  value={address.state}
                  onChange={(e) => setAddress((p) => ({ ...p, state: e.target.value }))}
                  placeholder="Estado"
                  className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-[#FF6B00]/50 outline-none"
                />
              </div>
              <input
                value={address.zipCode}
                onChange={(e) => setAddress((p) => ({ ...p, zipCode: e.target.value }))}
                placeholder="CEP"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-[#FF6B00]/50 outline-none"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setRedeemModal(null)}
                className="flex-1 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleRedeem}
                disabled={redeemLoading}
                className="flex-1 py-2.5 rounded-lg bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white font-medium transition-colors disabled:opacity-60"
              >
                {redeemLoading ? "Resgatando..." : "Confirmar resgate"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
