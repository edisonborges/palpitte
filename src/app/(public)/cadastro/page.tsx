"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function CadastroPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", favoriteTeam: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Erro ao criar conta"); return; }
      const loginResult = await signIn("credentials", { email: form.email, password: form.password, redirect: false });
      if (loginResult?.error) { router.push("/login"); return; }
      router.push("/dashboard");
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-[#111827]">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden bg-[#0a0f1a] text-slate-100">
        <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center select-none">
          <span className="text-[22rem] font-black tracking-tighter" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>2 x 1</span>
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-16">
            <span className="text-4xl tracking-tighter uppercase text-white" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontStyle: "italic" }}>
              Palpi<span className="text-[#FF6B00]">tt</span>e
            </span>
          </div>
          <div className="max-w-md">
            <h1 className="text-5xl font-black leading-tight mb-8">
              Acerte mais.<br />
              <span className="text-[#FF6B00]">Ganhe mais.</span>
            </h1>
            <div className="space-y-8">
              {[
                { icon: "trending_up", title: "Probabilidades Reais", desc: "Acesse dados estatísticos avançados para fundamentar seus palpites." },
                { icon: "payments", title: "Saques Instantâneos", desc: "Receba seus ganhos via PIX em poucos minutos, sem burocracia." },
                { icon: "workspace_premium", title: "Ranking Global", desc: "Compita com os melhores e ganhe bônus exclusivos por performance." },
              ].map((f) => (
                <div key={f.title} className="flex items-start gap-4">
                  <div className="bg-[#FF6B00]/20 p-2 rounded-lg text-[#FF6B00]">
                    <span className="material-symbols-outlined">{f.icon}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{f.title}</h3>
                    <p className="text-slate-400">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="relative z-10 text-slate-500 text-sm">© 2025 Palpitte. Jogue com responsabilidade.</div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12 bg-[#1f2937]">
        <div className="w-full max-w-110">
          <div className="flex lg:hidden items-center justify-center mb-10">
            <span className="text-3xl tracking-tighter uppercase text-white" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontStyle: "italic" }}>
              Palpi<span className="text-[#FF6B00]">tt</span>e
            </span>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-slate-700 mb-8">
            <Link href="/login" className="flex-1 pb-4 text-center text-sm font-bold border-b-2 border-transparent text-slate-500 hover:text-slate-300">
              Entrar
            </Link>
            <button className="flex-1 pb-4 text-center text-sm font-bold border-b-2 border-[#FF6B00] text-[#FF6B00]">
              Cadastrar
            </button>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Crie sua conta</h2>
            <p className="text-slate-400 text-sm">Grátis, sem apostas com dinheiro real.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-200">Nome completo</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                required
                placeholder="Seu nome"
                className="w-full h-12 px-4 rounded-lg bg-[#111827] border border-slate-700 text-white focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent outline-none transition-all placeholder:text-slate-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-200">E-mail</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                required
                placeholder="seu@email.com"
                className="w-full h-12 px-4 rounded-lg bg-[#111827] border border-slate-700 text-white focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent outline-none transition-all placeholder:text-slate-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-200">Senha</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                  required
                  minLength={8}
                  placeholder="Mínimo 8 caracteres"
                  className="w-full h-12 px-4 pr-12 rounded-lg bg-[#111827] border border-slate-700 text-white focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent outline-none transition-all placeholder:text-slate-500"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200">
                  <span className="material-symbols-outlined text-xl">{showPassword ? "visibility_off" : "visibility"}</span>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-200">
                Time do coração <span className="text-slate-500 font-normal">(opcional)</span>
              </label>
              <input
                type="text"
                value={form.favoriteTeam}
                onChange={(e) => setForm((p) => ({ ...p, favoriteTeam: e.target.value }))}
                placeholder="Ex: Flamengo"
                className="w-full h-12 px-4 rounded-lg bg-[#111827] border border-slate-700 text-white focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent outline-none transition-all placeholder:text-slate-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-[#FF6B00] hover:bg-orange-600 disabled:opacity-60 text-white font-bold rounded-lg transition-colors shadow-lg shadow-[#FF6B00]/20"
            >
              {loading ? "Criando conta..." : "Criar conta grátis"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500">
              Já tem conta?{" "}
              <Link href="/login" className="text-[#FF6B00] font-bold hover:underline">Entrar</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
