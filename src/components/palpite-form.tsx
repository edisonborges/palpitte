"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { MatchWithDetails } from "@/types";

interface PalpiteFormProps {
  match: MatchWithDetails;
  className?: string;
}

export function PalpiteForm({ match }: PalpiteFormProps) {
  const router = useRouter();
  const existing = match.userPrediction;

  const [homeScore, setHomeScore] = useState(existing?.homeScore ?? 0);
  const [awayScore, setAwayScore] = useState(existing?.awayScore ?? 0);
  const [bonusAnswers, setBonusAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const isPast = match.closedAt ? new Date(match.closedAt) < new Date() : false;

  const bonusQuestions = match.bonusQuestions ?? [];
  const bonusSelected = Object.keys(bonusAnswers).length;
  const estimatedScore = 40 + bonusSelected * 10;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isPast) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/matches/${match.id}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ homeScore, awayScore, bonusAnswers }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error ?? "Erro ao salvar palpite");
        return;
      }

      toast.success("Palpite salvo com sucesso!");
      router.refresh();
    } catch {
      toast.error("Erro de conexão");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Score Prediction Section */}
      <section className="bg-slate-100 dark:bg-[#FF6B00]/5 rounded-3xl p-8 mb-6 border border-[#FF6B00]/10">
        <h3 className="text-center text-lg font-bold mb-8 uppercase tracking-widest text-slate-500 dark:text-slate-400">
          Placar Final
        </h3>
        <div className="flex items-center justify-center gap-8 lg:gap-16">
          {/* Home Score */}
          <div className="flex flex-col items-center gap-4">
            <button
              type="button"
              onClick={() => !isPast && setHomeScore((s) => s + 1)}
              disabled={isPast}
              className="w-10 h-10 rounded-full border border-[#FF6B00]/30 flex items-center justify-center hover:bg-[#FF6B00] hover:text-white hover:border-[#FF6B00] transition-all disabled:opacity-40"
            >
              <span className="material-symbols-outlined">add</span>
            </button>
            <span
              className="text-7xl text-[#FF6B00] leading-none"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900 }}
            >
              {homeScore}
            </span>
            <button
              type="button"
              onClick={() => !isPast && setHomeScore((s) => Math.max(0, s - 1))}
              disabled={isPast || homeScore === 0}
              className="w-10 h-10 rounded-full border border-[#FF6B00]/30 flex items-center justify-center hover:bg-[#FF6B00] hover:text-white hover:border-[#FF6B00] transition-all disabled:opacity-40"
            >
              <span className="material-symbols-outlined">remove</span>
            </button>
          </div>

          <div
            className="text-4xl text-slate-300 dark:text-slate-700 select-none"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900 }}
          >
            X
          </div>

          {/* Away Score */}
          <div className="flex flex-col items-center gap-4">
            <button
              type="button"
              onClick={() => !isPast && setAwayScore((s) => s + 1)}
              disabled={isPast}
              className="w-10 h-10 rounded-full border border-[#FF6B00]/30 flex items-center justify-center hover:bg-[#FF6B00] hover:text-white hover:border-[#FF6B00] transition-all disabled:opacity-40"
            >
              <span className="material-symbols-outlined">add</span>
            </button>
            <span
              className="text-7xl text-[#FF6B00] leading-none"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900 }}
            >
              {awayScore}
            </span>
            <button
              type="button"
              onClick={() => !isPast && setAwayScore((s) => Math.max(0, s - 1))}
              disabled={isPast || awayScore === 0}
              className="w-10 h-10 rounded-full border border-[#FF6B00]/30 flex items-center justify-center hover:bg-[#FF6B00] hover:text-white hover:border-[#FF6B00] transition-all disabled:opacity-40"
            >
              <span className="material-symbols-outlined">remove</span>
            </button>
          </div>
        </div>
      </section>

      {/* Bonus Questions */}
      {bonusQuestions.length > 0 && (
        <section className="space-y-4 mb-8">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-2">
            Perguntas Bônus
          </h3>
          <div className="bg-white dark:bg-slate-800/40 border border-[#FF6B00]/5 rounded-2xl p-5 flex flex-col gap-4">
            {bonusQuestions.map((q, idx) => (
              <div key={q.id}>
                {idx > 0 && <hr className="border-slate-100 dark:border-white/5 mb-4" />}
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    {q.question}
                  </p>
                  {q.options ? (
                    <div className="flex gap-2 flex-wrap">
                      {(q.options as string[]).map((opt: string) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() =>
                            !isPast && setBonusAnswers((prev) => ({ ...prev, [q.id]: opt }))
                          }
                          disabled={isPast}
                          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all disabled:opacity-60 ${
                            bonusAnswers[q.id] === opt
                              ? "bg-[#FF6B00] text-white shadow-lg shadow-[#FF6B00]/20"
                              : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-700"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <input
                      type="text"
                      placeholder="Sua resposta..."
                      value={bonusAnswers[q.id] ?? ""}
                      onChange={(e) =>
                        setBonusAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))
                      }
                      disabled={isPast}
                      className="w-full mt-2 bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:border-[#FF6B00]/50 outline-none disabled:opacity-60"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Points Summary Card */}
      <section className="bg-[#FF6B00]/10 rounded-2xl p-6 mb-8 border-l-4 border-[#FF6B00]">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#FF6B00]">
              Estimativa de ganhos
            </h4>
            <div className="flex gap-4">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Placar:{" "}
                <b className="text-slate-700 dark:text-slate-200">
                  +{match.isChampions ? Math.round(40 * 1.5) : 40} pts
                </b>
              </span>
              {bonusSelected > 0 && (
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Bônus:{" "}
                  <b className="text-slate-700 dark:text-slate-200">+{bonusSelected * 10} pts</b>
                </span>
              )}
              {match.isChampions && (
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  <b className="text-yellow-500">×{match.pointsMultiplier} multiplicador</b>
                </span>
              )}
            </div>
          </div>
          <div className="text-right">
            <span className="text-3xl font-black text-[#FF6B00]">
              +{match.isChampions ? Math.round(estimatedScore * (match.pointsMultiplier ?? 1)) : estimatedScore}
            </span>
            <span className="text-xs font-bold text-[#FF6B00] block leading-none">
              PONTOS TOTAL
            </span>
          </div>
        </div>
      </section>

      {/* Action Button */}
      {!isPast ? (
        <button
          type="submit"
          disabled={loading}
          className="w-full py-5 rounded-2xl bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white font-black text-lg shadow-xl shadow-[#FF6B00]/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-60"
        >
          <span className="material-symbols-outlined">check_circle</span>
          {loading ? "Confirmando..." : existing ? "Atualizar palpite" : "Confirmar palpite"}
        </button>
      ) : (
        <div className="w-full py-5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold text-lg text-center">
          Palpites encerrados para esta partida
        </div>
      )}
    </form>
  );
}
