import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="bg-[#0B1120] text-slate-100 antialiased">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-[#2D3748] bg-[#0B1120]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#FF6B00] text-3xl">
                sports_soccer
              </span>
              <h1
                className="text-3xl font-black tracking-tighter text-white uppercase italic"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              >
                Palpi<span className="text-[#FF6B00]">tt</span>e
              </h1>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <a
                href="#como-funciona"
                className="text-sm font-medium text-slate-300 hover:text-[#FF6B00] transition-colors"
              >
                Como funciona
              </a>
              <a
                href="#competicoes"
                className="text-sm font-medium text-slate-300 hover:text-[#FF6B00] transition-colors"
              >
                Competições
              </a>
              <a
                href="#premios"
                className="text-sm font-medium text-slate-300 hover:text-[#FF6B00] transition-colors"
              >
                Prêmios
              </a>
              <a
                href="#boloes"
                className="text-sm font-medium text-slate-300 hover:text-[#FF6B00] transition-colors"
              >
                Bolões
              </a>
            </nav>
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="hidden sm:block text-sm font-bold text-white hover:text-[#FF6B00] transition-colors px-4 py-2"
              >
                Entrar
              </Link>
              <Link
                href="/cadastro"
                className="bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white px-6 py-2.5 rounded-lg font-bold text-sm transition-all shadow-lg shadow-[#FF6B00]/20"
              >
                Criar conta grátis
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section
          className="relative py-24 lg:py-32 overflow-hidden"
          style={{
            backgroundImage:
              "linear-gradient(to bottom, rgba(11, 17, 32, 0.8), rgba(11, 17, 32, 1)), url('https://images.unsplash.com/photo-1508098682722-e99c643e7f0b?w=1600&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white mb-6">
                Palpite. <span className="text-[#FF6B00]">Vença.</span> Ganhe prêmios reais.
              </h1>
              <p className="text-lg md:text-xl text-slate-300 mb-10 leading-relaxed">
                A plataforma onde seus palpites valem prêmios reais de verdade. Junte-se à maior
                comunidade de palpiteiros do Brasil e mostre seu conhecimento.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/cadastro"
                  className="w-full sm:w-auto bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white px-10 py-4 rounded-xl font-extrabold text-lg transition-all shadow-xl shadow-[#FF6B00]/30"
                >
                  Começar agora
                </Link>
                <a
                  href="#competicoes"
                  className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white px-10 py-4 rounded-xl font-bold text-lg backdrop-blur-sm transition-all"
                >
                  Ver competições
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof Bar */}
        <section className="border-y border-[#2D3748] bg-[#161D2F]/50">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              {[
                { value: "48.000+", label: "Palpiteiros ativos" },
                { value: "1.200+", label: "Jogos por mês" },
                { value: "R$ 500k+", label: "Prêmios entregues" },
                { value: "24/7", label: "Suporte ao vivo" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-3xl md:text-4xl font-black text-[#FF6B00] mb-1">
                    {stat.value}
                  </p>
                  <p className="text-sm font-medium text-slate-400 uppercase tracking-widest">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section id="como-funciona" className="py-24 bg-[#0B1120]">
          <div className="max-w-7xl mx-auto px-4">
            <div className="mb-16">
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
                Como funciona
              </h2>
              <div className="h-1.5 w-24 bg-[#FF6B00] rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: "sports_soccer",
                  title: "Escolha o jogo",
                  desc: "Navegue pelas principais ligas do mundo e selecione as partidas que você domina.",
                },
                {
                  icon: "edit_note",
                  title: "Dê seu palpite",
                  desc: "Analise as estatísticas em tempo real e faça sua aposta no placar exato ou vencedor.",
                },
                {
                  icon: "trending_up",
                  title: "Suba no ranking",
                  desc: "Acumule pontos com seus acertos e supere outros milhares de palpiteiros brasileiros.",
                },
                {
                  icon: "card_giftcard",
                  title: "Resgate prêmios",
                  desc: "Troque seus pontos e vitórias por prêmios exclusivos, camisas oficiais e dinheiro.",
                },
              ].map((step) => (
                <div
                  key={step.title}
                  className="bg-[#161D2F] p-8 rounded-2xl border border-[#2D3748] hover:border-[#FF6B00]/50 transition-colors group"
                >
                  <div className="w-14 h-14 bg-[#FF6B00]/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#FF6B00] transition-colors">
                    <span className="material-symbols-outlined text-[#FF6B00] group-hover:text-white text-3xl">
                      {step.icon}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Competitions */}
        <section id="competicoes" className="py-24 bg-[#161D2F]/30">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-end justify-between mb-12">
              <div>
                <h2 className="text-3xl font-black text-white mb-2">
                  Principais Competições
                </h2>
                <p className="text-slate-400">
                  As ligas mais disputadas do planeta estão aqui.
                </p>
              </div>
              <Link
                href="/jogos"
                className="text-[#FF6B00] font-bold hover:underline flex items-center gap-2"
              >
                Ver todas{" "}
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                "Brasileirão",
                "Champions",
                "Premier League",
                "La Liga",
                "Libertadores",
                "Copa do Brasil",
              ].map((comp) => (
                <div
                  key={comp}
                  className="bg-[#0B1120] border border-[#2D3748] p-6 rounded-xl text-center hover:scale-105 transition-transform cursor-pointer"
                >
                  <div className="w-16 h-16 mx-auto mb-4 bg-slate-800 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl text-[#FF6B00]">
                      emoji_events
                    </span>
                  </div>
                  <p className="font-bold text-white text-sm">{comp}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Prizes */}
        <section id="premios" className="py-24 bg-[#0B1120]">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
                Prêmios Incríveis
              </h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                Sua paixão recompensada com os melhores itens do mundo do futebol.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { title: "Bola Oficial", desc: "A mesma bola usada nas finais europeias.", pts: "2.500 pts" },
                { title: "Camisa Oficial", desc: "Manto sagrado do seu time do coração.", pts: "5.000 pts" },
                { title: "Chuteira Pro", desc: "Alta performance para seus jogos.", pts: "8.000 pts" },
                { title: "Ingresso VIP", desc: "Experiência única direto do camarote.", pts: "12.000 pts" },
              ].map((prize) => (
                <div
                  key={prize.title}
                  className="bg-[#161D2F] rounded-2xl overflow-hidden border border-[#2D3748] flex flex-col group"
                >
                  <div className="aspect-square relative overflow-hidden bg-slate-800 flex items-center justify-center">
                    <span className="material-symbols-outlined text-6xl text-slate-600">
                      redeem
                    </span>
                    <div className="absolute top-4 right-4 bg-yellow-400 text-black text-xs font-black px-3 py-1 rounded-full">
                      GOLD PRIZE
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-xl font-bold text-white mb-1">{prize.title}</h3>
                    <p className="text-slate-400 text-sm mb-4">{prize.desc}</p>
                    <div className="mt-auto flex items-center justify-between">
                      <span className="text-[#FF6B00] font-black text-2xl">{prize.pts}</span>
                      <button className="bg-[#FF6B00]/20 text-[#FF6B00] hover:bg-[#FF6B00] hover:text-white p-2 rounded-lg transition-colors">
                        <span className="material-symbols-outlined">shopping_cart</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="max-w-5xl mx-auto bg-gradient-to-br from-[#FF6B00] to-orange-700 rounded-3xl p-12 text-center relative overflow-hidden shadow-2xl shadow-[#FF6B00]/20">
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
                Pronto para ser o próximo campeão?
              </h2>
              <p className="text-white/80 text-lg mb-10 max-w-xl mx-auto">
                Crie sua conta em menos de 1 minuto e ganhe 100 pontos de bônus para começar a
                palpitar hoje mesmo.
              </p>
              <Link
                href="/cadastro"
                className="inline-block bg-white text-[#FF6B00] px-12 py-5 rounded-2xl font-black text-xl hover:scale-105 transition-transform shadow-xl"
              >
                CRIAR MINHA CONTA GRÁTIS
              </Link>
            </div>
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <span className="material-symbols-outlined absolute -bottom-20 -left-20 text-white" style={{ fontSize: "300px" }}>
                sports_soccer
              </span>
              <span className="material-symbols-outlined absolute -top-20 -right-20 text-white" style={{ fontSize: "300px" }}>
                trophy
              </span>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#0B1120] border-t border-[#2D3748] pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-[#FF6B00] text-3xl">
                  sports_soccer
                </span>
                <h1
                  className="text-3xl font-black tracking-tighter text-white uppercase italic"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                >
                  Palpi<span className="text-[#FF6B00]">tt</span>e
                </h1>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                A maior e mais segura plataforma de palpites esportivos do Brasil. Venha fazer
                parte da nossa torcida.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">Plataforma</h4>
              <ul className="space-y-4">
                {["Competições", "Bolões Públicos", "Ranking Global", "Prêmios"].map((item) => (
                  <li key={item}>
                    <Link
                      href="/login"
                      className="text-slate-400 text-sm hover:text-[#FF6B00] transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">Suporte</h4>
              <ul className="space-y-4">
                {["Central de Ajuda", "Regras do Jogo", "Jogo Responsável", "Contato"].map(
                  (item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className="text-slate-400 text-sm hover:text-[#FF6B00] transition-colors"
                      >
                        {item}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">Redes Sociais</h4>
              <div className="flex gap-4">
                {["share", "tag", "group"].map((icon) => (
                  <a
                    key={icon}
                    href="#"
                    className="w-10 h-10 bg-[#161D2F] rounded-full flex items-center justify-center text-slate-300 hover:bg-[#FF6B00] hover:text-white transition-all"
                  >
                    <span className="material-symbols-outlined">{icon}</span>
                  </a>
                ))}
              </div>
              <div className="mt-8">
                <Link
                  href="/reseller"
                  className="text-xs text-slate-500 hover:text-[#FF6B00] transition-colors"
                >
                  Seja um revendedor white-label →
                </Link>
              </div>
            </div>
          </div>
          <div className="border-t border-[#2D3748] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-xs">
              © 2025 Palpitte. Todos os direitos reservados. Jogue com responsabilidade.
            </p>
            <div className="flex gap-6">
              {["Privacidade", "Termos de Uso", "Cookies"].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-slate-500 text-xs hover:text-slate-300 transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
