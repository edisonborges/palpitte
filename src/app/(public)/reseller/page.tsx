"use client";

import Link from "next/link";
import { Logo } from "@/components/logo";
import { PlanCard } from "@/components/plan-card";
import {
  ChevronRight,
  Palette,
  Users,
  BarChart3,
  Globe,
  Shield,
  Zap,
} from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: 97,
    features: [
      "Até 500 usuários",
      "Subdomínio personalizado",
      "Cores e logo customizados",
      "Suporte por e-mail",
      "Analytics básico",
    ],
  },
  {
    name: "Pro",
    price: 197,
    highlighted: true,
    features: [
      "Até 2.000 usuários",
      "Domínio próprio",
      "Cores, logo e favicon",
      "Analytics avançado",
      "Suporte prioritário",
      "Gerenciamento de prêmios",
    ],
  },
  {
    name: "Enterprise",
    price: 497,
    features: [
      "Usuários ilimitados",
      "Domínio próprio",
      "Personalização completa",
      "Analytics em tempo real",
      "Suporte dedicado",
      "API de integração",
      "White-label 100%",
    ],
  },
];

export default function ResellerLandingPage() {
  return (
    <div className="min-h-screen bg-[#0B1120] text-white">
      {/* Nav */}
      <nav className="border-b border-white/5 bg-[#0B1120]/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm text-zinc-400 hover:text-white"
            >
              Entrar
            </Link>
            <Link
              href="#planos"
              className="bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white text-sm font-semibold px-4 py-2 rounded-lg"
            >
              Começar agora
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 py-20 text-center">
        <div className="inline-flex items-center gap-2 bg-[#FF6B00]/10 border border-[#FF6B00]/20 rounded-full px-4 py-2 text-sm text-[#FF6B00] mb-6">
          <Zap className="w-3.5 h-3.5" />
          Plataforma White-Label de Palpites
        </div>

        <h1 className="text-5xl sm:text-6xl font-bold barlow-condensed leading-tight mb-6">
          Sua marca.
          <br />
          <span className="text-[#FF6B00]">Nossa tecnologia.</span>
        </h1>

        <p className="text-lg text-zinc-400 max-w-2xl mx-auto mb-8">
          Lance sua própria plataforma de palpites esportivos com sua marca em
          minutos. Sem desenvolvimento, sem custos de infraestrutura.
        </p>

        <Link
          href="#planos"
          className="inline-flex items-center gap-2 bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white font-semibold px-8 py-3.5 rounded-xl text-base"
        >
          Ver planos
          <ChevronRight className="w-4 h-4" />
        </Link>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold barlow-condensed text-center mb-10">
          Tudo que você precisa
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              icon: Palette,
              title: "Personalização total",
              desc: "Logo, cores, domínio próprio. Seus usuários nem saberão que é Palpitte.",
            },
            {
              icon: Users,
              title: "Gestão de usuários",
              desc: "Painel completo para gerenciar, pontuar e moderar sua comunidade.",
            },
            {
              icon: BarChart3,
              title: "Analytics em tempo real",
              desc: "Acompanhe engajamento, novos cadastros e palpites em tempo real.",
            },
            {
              icon: Globe,
              title: "Domínio personalizado",
              desc: "Configure seu próprio domínio .com.br e tenha presença digital profissional.",
            },
            {
              icon: Shield,
              title: "Infraestrutura segura",
              desc: "Hospedagem, segurança e backups inclusos. Foque no seu negócio.",
            },
            {
              icon: Zap,
              title: "Setup em minutos",
              desc: "Configure sua plataforma em menos de 5 minutos. Sem código necessário.",
            },
          ].map((f, i) => (
            <div
              key={i}
              className="bg-[#111827] rounded-2xl p-6 border border-white/5 hover:border-[#FF6B00]/20 transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-[#FF6B00]/10 flex items-center justify-center mb-4">
                <f.icon className="w-5 h-5 text-[#FF6B00]" />
              </div>
              <h3 className="font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-zinc-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Plans */}
      <section id="planos" className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold barlow-condensed text-center mb-3">
          Escolha seu plano
        </h2>
        <p className="text-zinc-400 text-center mb-10">
          Sem taxa de setup. Cancele quando quiser.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {plans.map((plan) => (
            <PlanCard
              key={plan.name}
              name={plan.name}
              price={plan.price}
              features={plan.features}
              highlighted={"highlighted" in plan ? plan.highlighted : false}
              ctaLabel="Começar agora"
              onSelect={() => {
                window.location.href = `/cadastro?plan=${plan.name.toLowerCase()}`;
              }}
            />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#0D1523]">
        <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo size="sm" />
          <p className="text-sm text-zinc-500">
            © {new Date().getFullYear()} Palpitte. Plataforma white-label.
          </p>
        </div>
      </footer>
    </div>
  );
}
