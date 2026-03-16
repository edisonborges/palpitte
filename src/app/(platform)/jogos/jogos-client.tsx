"use client";

import { useState } from "react";
import Link from "next/link";

type Match = {
  id: string;
  status: string;
  scheduledAt: Date;
  pointsMultiplier: number;
  homeTeam: { name: string; shortName: string };
  awayTeam: { name: string; shortName: string };
  competition: { name: string };
};

type MockEvent = {
  id: string;
  categoria: string;
  titulo: string;
  descricao: string;
  icon: string;
  status: "ao_vivo" | "encerra_breve" | "aberto";
  tempoRestante: string;
  pontos: number;
  opcoes: { label: string; odd: string; percent: number }[];
};

const MOCK_EVENTS: MockEvent[] = [
  // Entretenimento
  {
    id: "ent-1",
    categoria: "Entretenimento",
    titulo: "BBB 25: Quem vence a prova do líder?",
    descricao: "Quem será o novo líder da semana?",
    icon: "tv",
    status: "ao_vivo",
    tempoRestante: "AO VIVO",
    pontos: 120,
    opcoes: [
      { label: "Giovanna", odd: "2.1x", percent: 47 },
      { label: "Diego", odd: "3.4x", percent: 29 },
      { label: "Outro", odd: "4.8x", percent: 24 },
    ],
  },
  {
    id: "ent-2",
    categoria: "Entretenimento",
    titulo: "The Voice Brasil: Quem leva a final?",
    descricao: "Previsão para o grande campeão",
    icon: "mic",
    status: "encerra_breve",
    tempoRestante: "2h 30min",
    pontos: 80,
    opcoes: [
      { label: "Ana Clara", odd: "1.8x", percent: 55 },
      { label: "Pedro Lima", odd: "3.2x", percent: 28 },
      { label: "Outro", odd: "5.1x", percent: 17 },
    ],
  },
  {
    id: "ent-3",
    categoria: "Entretenimento",
    titulo: "Novo álbum da Anitta: mais de 1 bilhão de streams?",
    descricao: "Previsão em 30 dias após o lançamento",
    icon: "album",
    status: "aberto",
    tempoRestante: "5 dias",
    pontos: 90,
    opcoes: [
      { label: "Sim", odd: "1.6x", percent: 62 },
      { label: "Não", odd: "2.9x", percent: 38 },
    ],
  },
  {
    id: "ent-4",
    categoria: "Entretenimento",
    titulo: "Oscar 2025: Melhor Filme",
    descricao: "Qual levará a estatueta dourada?",
    icon: "movie",
    status: "aberto",
    tempoRestante: "3 dias",
    pontos: 150,
    opcoes: [
      { label: "Oppenheimer 2", odd: "2.3x", percent: 43 },
      { label: "Duna: Parte 3", odd: "2.8x", percent: 35 },
      { label: "Outro", odd: "4.0x", percent: 22 },
    ],
  },
  // Criptomoedas
  {
    id: "cryp-1",
    categoria: "Criptomoedas",
    titulo: "BTC ultrapassa US$ 120.000 até domingo?",
    descricao: "Previsão de preço do Bitcoin neste final de semana",
    icon: "currency_bitcoin",
    status: "ao_vivo",
    tempoRestante: "AO VIVO",
    pontos: 200,
    opcoes: [
      { label: "Sim", odd: "3.2x", percent: 31 },
      { label: "Não", odd: "1.4x", percent: 69 },
    ],
  },
  {
    id: "cryp-2",
    categoria: "Criptomoedas",
    titulo: "ETH: qual direção nesta semana?",
    descricao: "Ethereum sobe ou cai até sexta?",
    icon: "trending_up",
    status: "encerra_breve",
    tempoRestante: "1h 15min",
    pontos: 160,
    opcoes: [
      { label: "Sobe +5%", odd: "2.1x", percent: 47 },
      { label: "Lateral", odd: "3.0x", percent: 33 },
      { label: "Cai -5%", odd: "3.8x", percent: 20 },
    ],
  },
  {
    id: "cryp-3",
    categoria: "Criptomoedas",
    titulo: "Solana bate novo ATH em março?",
    descricao: "SOL atinge recorde histórico neste mês?",
    icon: "bolt",
    status: "aberto",
    tempoRestante: "16 dias",
    pontos: 140,
    opcoes: [
      { label: "Sim", odd: "2.7x", percent: 37 },
      { label: "Não", odd: "1.6x", percent: 63 },
    ],
  },
  {
    id: "cryp-4",
    categoria: "Criptomoedas",
    titulo: "Próximo halving: BTC vai a US$ 200k?",
    descricao: "Previsão pós-halving de 2025",
    icon: "currency_bitcoin",
    status: "aberto",
    tempoRestante: "30 dias",
    pontos: 300,
    opcoes: [
      { label: "Sim, acima de 200k", odd: "4.5x", percent: 22 },
      { label: "Entre 100k e 200k", odd: "1.9x", percent: 51 },
      { label: "Abaixo de 100k", odd: "3.2x", percent: 27 },
    ],
  },
  // Celebridades
  {
    id: "cel-1",
    categoria: "Celebridades",
    titulo: "Neymar anuncia aposentadoria em 2025?",
    descricao: "Previsão sobre o futuro do craque",
    icon: "star",
    status: "aberto",
    tempoRestante: "9 meses",
    pontos: 100,
    opcoes: [
      { label: "Sim", odd: "4.1x", percent: 24 },
      { label: "Não", odd: "1.3x", percent: 76 },
    ],
  },
  {
    id: "cel-2",
    categoria: "Celebridades",
    titulo: "Virgínia e Zé Felipe: bebê em 2025?",
    descricao: "O casal anuncia o 4º filho este ano?",
    icon: "favorite",
    status: "ao_vivo",
    tempoRestante: "AO VIVO",
    pontos: 90,
    opcoes: [
      { label: "Sim", odd: "2.8x", percent: 36 },
      { label: "Não", odd: "1.5x", percent: 64 },
    ],
  },
  {
    id: "cel-3",
    categoria: "Celebridades",
    titulo: "Vini Jr. ganha a Bola de Ouro 2025?",
    descricao: "O brasileiro leva o prêmio máximo do futebol?",
    icon: "emoji_events",
    status: "encerra_breve",
    tempoRestante: "3h 45min",
    pontos: 180,
    opcoes: [
      { label: "Sim", odd: "2.2x", percent: 45 },
      { label: "Não", odd: "1.9x", percent: 55 },
    ],
  },
  {
    id: "cel-4",
    categoria: "Celebridades",
    titulo: "Ludmilla: show no Rock in Rio?",
    descricao: "A artista sobe ao palco principal?",
    icon: "music_note",
    status: "aberto",
    tempoRestante: "4 meses",
    pontos: 70,
    opcoes: [
      { label: "Sim", odd: "1.4x", percent: 71 },
      { label: "Não", odd: "3.8x", percent: 29 },
    ],
  },
  // Financeiro
  {
    id: "fin-1",
    categoria: "Financeiro",
    titulo: "Dólar fecha acima de R$ 6,00 na sexta?",
    descricao: "Câmbio USD/BRL neste encerramento",
    icon: "attach_money",
    status: "ao_vivo",
    tempoRestante: "AO VIVO",
    pontos: 130,
    opcoes: [
      { label: "Sim, acima R$ 6,00", odd: "1.7x", percent: 59 },
      { label: "Não, abaixo R$ 6,00", odd: "2.5x", percent: 41 },
    ],
  },
  {
    id: "fin-2",
    categoria: "Financeiro",
    titulo: "Ibovespa: fechamento desta semana",
    descricao: "O principal índice brasileiro sobe ou cai?",
    icon: "show_chart",
    status: "encerra_breve",
    tempoRestante: "45min",
    pontos: 110,
    opcoes: [
      { label: "Alta +1%", odd: "2.3x", percent: 43 },
      { label: "Lateral", odd: "2.8x", percent: 36 },
      { label: "Queda -1%", odd: "3.5x", percent: 21 },
    ],
  },
  {
    id: "fin-3",
    categoria: "Financeiro",
    titulo: "SELIC: Bacen mantém ou sobe em maio?",
    descricao: "Decisão da próxima reunião do COPOM",
    icon: "percent",
    status: "aberto",
    tempoRestante: "47 dias",
    pontos: 200,
    opcoes: [
      { label: "Sobe 0,25pp", odd: "1.8x", percent: 55 },
      { label: "Mantém", odd: "3.1x", percent: 31 },
      { label: "Sobe 0,50pp", odd: "5.2x", percent: 14 },
    ],
  },
  {
    id: "fin-4",
    categoria: "Financeiro",
    titulo: "Petrobras: dividendos acima de R$ 2 bi?",
    descricao: "Pagamento de dividendos no próximo trimestre",
    icon: "local_gas_station",
    status: "aberto",
    tempoRestante: "20 dias",
    pontos: 170,
    opcoes: [
      { label: "Sim", odd: "1.6x", percent: 62 },
      { label: "Não", odd: "2.8x", percent: 38 },
    ],
  },
  // Política
  {
    id: "pol-1",
    categoria: "Política",
    titulo: "Lula aprova reforma ministerial em março?",
    descricao: "Mudanças no governo federal neste mês",
    icon: "account_balance",
    status: "encerra_breve",
    tempoRestante: "2h 10min",
    pontos: 150,
    opcoes: [
      { label: "Sim", odd: "2.0x", percent: 50 },
      { label: "Não", odd: "2.1x", percent: 50 },
    ],
  },
  {
    id: "pol-2",
    categoria: "Política",
    titulo: "Eleições 2026: quem lidera nas pesquisas?",
    descricao: "Candidato mais votado nas pesquisas de março",
    icon: "how_to_vote",
    status: "aberto",
    tempoRestante: "16 dias",
    pontos: 250,
    opcoes: [
      { label: "Lula", odd: "1.9x", percent: 52 },
      { label: "Bolsonaro", odd: "2.5x", percent: 30 },
      { label: "Novo candidato", odd: "6.0x", percent: 18 },
    ],
  },
  {
    id: "pol-3",
    categoria: "Política",
    titulo: "STF: julgamento do marco temporal em abril?",
    descricao: "O Supremo pautará o tema no próximo mês?",
    icon: "gavel",
    status: "aberto",
    tempoRestante: "15 dias",
    pontos: 120,
    opcoes: [
      { label: "Sim", odd: "2.3x", percent: 43 },
      { label: "Não", odd: "1.9x", percent: 57 },
    ],
  },
  {
    id: "pol-4",
    categoria: "Política",
    titulo: "PEC dos gastos é aprovada em 2025?",
    descricao: "Votação da emenda constitucional fiscal",
    icon: "description",
    status: "ao_vivo",
    tempoRestante: "AO VIVO",
    pontos: 180,
    opcoes: [
      { label: "Sim", odd: "1.7x", percent: 58 },
      { label: "Não", odd: "2.6x", percent: 42 },
    ],
  },
];

const CATEGORIES = [
  { label: "Todos", icon: "grid_view" },
  { label: "Entretenimento", icon: "movie" },
  { label: "Criptomoedas", icon: "currency_bitcoin" },
  { label: "Esportes", icon: "sports_soccer" },
  { label: "Celebridades", icon: "star_rate" },
  { label: "Financeiro", icon: "monetization_on" },
  { label: "Política", icon: "account_balance" },
] as const;

const SUB_TABS = ["Encerram em breve", "Em Alta", "Ao Vivo"] as const;

function StatusBadge({ status, time }: { status: MockEvent["status"]; time: string }) {
  if (status === "ao_vivo") {
    return (
      <span className="flex items-center gap-1.5 bg-red-500/15 border border-red-500/30 text-red-400 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 animate-ping" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
        </span>
        AO VIVO
      </span>
    );
  }
  if (status === "encerra_breve") {
    return (
      <span className="flex items-center gap-1 bg-amber-500/15 border border-amber-500/30 text-amber-400 px-3 py-1 rounded-full text-xs font-bold">
        <span className="material-symbols-outlined text-sm">timer</span>
        {time}
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 bg-[#FF6B00]/15 border border-[#FF6B00]/30 text-[#FF6B00] px-3 py-1 rounded-full text-xs font-bold">
      <span className="material-symbols-outlined text-sm">schedule</span>
      {time}
    </span>
  );
}

function OptionBar({ label, odd, percent }: { label: string; odd: string; percent: number }) {
  const isHigh = percent >= 50;
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-slate-400 w-28 shrink-0 truncate">{label}</span>
      <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${isHigh ? "bg-[#FF6B00]" : "bg-slate-600"}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className={`text-xs font-black w-10 text-right ${isHigh ? "text-[#FF6B00]" : "text-slate-400"}`}>
        {percent}%
      </span>
      <span className="text-xs text-slate-500 w-10 text-right">{odd}</span>
    </div>
  );
}

export function JogosClient({ matches }: { matches: Match[] }) {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [activeSubTab, setActiveSubTab] = useState("Encerram em breve");

  // Esportes convertidos para o formato unificado
  const sportsEvents: MockEvent[] = matches.map((m) => ({
    id: m.id,
    categoria: "Esportes",
    titulo: `${m.homeTeam.name} vs ${m.awayTeam.name}`,
    descricao: m.competition.name,
    icon: "sports_soccer",
    status: m.status === "LIVE" ? "ao_vivo" : "encerra_breve",
    tempoRestante:
      m.status === "LIVE"
        ? "AO VIVO"
        : new Date(m.scheduledAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    pontos: Math.round(100 * m.pointsMultiplier),
    opcoes: [
      { label: m.homeTeam.shortName, odd: "2.1x", percent: 48 },
      { label: "Empate", odd: "3.2x", percent: 27 },
      { label: m.awayTeam.shortName, odd: "3.5x", percent: 25 },
    ],
  }));

  const allEvents = [...sportsEvents, ...MOCK_EVENTS];

  const liveCount = allEvents.filter((e) => e.status === "ao_vivo").length;

  // Filtragem por categoria
  let filtered =
    activeCategory === "Todos" ? allEvents : allEvents.filter((e) => e.categoria === activeCategory);

  // Filtragem por sub-tab
  if (activeSubTab === "Ao Vivo") {
    filtered = filtered.filter((e) => e.status === "ao_vivo");
  } else if (activeSubTab === "Encerram em breve") {
    filtered = filtered.filter((e) => e.status === "encerra_breve" || e.status === "ao_vivo");
  } else if (activeSubTab === "Em Alta") {
    // Simula "em alta" pelo pontos
    filtered = [...filtered].sort((a, b) => b.pontos - a.pontos);
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Hero */}
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-white">Jogos disponíveis</h2>
        <p className="text-slate-400 mt-1">Dê seus palpites antes do apito inicial e suba no ranking.</p>
      </div>

      {/* Filtros */}
      <div className="space-y-5 mb-8">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.label}
              onClick={() => setActiveCategory(cat.label)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all border ${
                activeCategory === cat.label
                  ? "bg-[#FF6B00] border-[#FF6B00] text-white shadow-lg shadow-[#FF6B00]/20"
                  : "bg-transparent border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200"
              }`}
            >
              <span className="material-symbols-outlined text-base">{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Sub-tabs */}
        <div className="flex items-center gap-6 border-b border-slate-800">
          {SUB_TABS.map((tab) => {
            const isAoVivo = tab === "Ao Vivo";
            const isActive = activeSubTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveSubTab(tab)}
                className={`pb-3 flex items-center gap-2 border-b-2 transition-all ${
                  isActive
                    ? isAoVivo
                      ? "border-red-500 text-red-400"
                      : "border-white text-white"
                    : "border-transparent text-slate-500 hover:text-slate-300"
                } text-sm font-bold`}
              >
                {isAoVivo && (
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 animate-ping" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                  </span>
                )}
                {tab}
                {isAoVivo && (
                  <span
                    className={`text-[10px] font-black px-1.5 py-0.5 rounded-full border ${
                      isActive
                        ? "bg-red-500/20 border-red-500/40 text-red-400"
                        : "bg-slate-800 border-slate-700 text-slate-400"
                    }`}
                  >
                    {liveCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid de eventos */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <span className="material-symbols-outlined text-5xl text-slate-700 mb-4 block">search_off</span>
          <p className="text-slate-400 text-lg">Nenhum evento encontrado.</p>
          <p className="text-slate-500 text-sm mt-2">Tente outra categoria ou volte em breve.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {filtered.map((event) => {
            const isSport = event.categoria === "Esportes";
            const isLive = event.status === "ao_vivo";
            return (
              <div
                key={event.id}
                className={`rounded-2xl p-5 border transition-all group ${
                  isLive
                    ? "bg-red-500/5 border-red-500/20 hover:border-red-500/40"
                    : "bg-slate-900/50 border-slate-800 hover:border-[#FF6B00]/40"
                }`}
              >
                {/* Topo: categoria + status */}
                <div className="flex items-center justify-between mb-4">
                  <span className="flex items-center gap-1.5 bg-slate-800 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    <span className="material-symbols-outlined text-sm">{event.icon}</span>
                    {event.categoria}
                  </span>
                  <StatusBadge status={event.status} time={event.tempoRestante} />
                </div>

                {/* Título */}
                <h3 className="font-bold text-white text-base leading-snug mb-1 group-hover:text-[#FF6B00] transition-colors">
                  {event.titulo}
                </h3>
                <p className="text-slate-500 text-xs mb-4">{event.descricao}</p>

                {/* Opções / barras de probabilidade */}
                <div className="space-y-2 mb-4">
                  {event.opcoes.map((opt) => (
                    <OptionBar key={opt.label} {...opt} />
                  ))}
                </div>

                {/* Rodapé */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-800/60">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-yellow-500 text-sm">star</span>
                    <span className="text-xs font-bold text-yellow-500">{event.pontos} pts em jogo</span>
                  </div>
                  {isSport ? (
                    <Link
                      href={`/jogos/${event.id}`}
                      className="px-5 py-1.5 rounded-lg border-2 border-[#FF6B00] text-[#FF6B00] font-bold text-xs hover:bg-[#FF6B00] hover:text-white transition-all group-hover:bg-[#FF6B00] group-hover:text-white"
                    >
                      Dar palpite
                    </Link>
                  ) : (
                    <button className="px-5 py-1.5 rounded-lg bg-[#FF6B00] text-white font-bold text-xs hover:bg-orange-600 transition-all shadow-lg shadow-[#FF6B00]/20">
                      Dar palpite
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
