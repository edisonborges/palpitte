"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";

  const [email, setEmail] = useState("teste@teste.com");
  const [password, setPassword] = useState("123456");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await signIn("credentials", { email, password, redirect: false });
      if (result?.error) {
        setError("E-mail ou senha incorretos");
        return;
      }
      router.push(callbackUrl);
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-[#111827]">
      {/* Left Panel – Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden bg-[#0a0f1a] text-slate-100">
        {/* Decorative background */}
        <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center select-none">
          <span className="text-[22rem] font-black tracking-tighter" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>2 x 1</span>
        </div>

        {/* Logo — topo */}
        <div className="relative z-10">
          <span
            className="text-4xl tracking-tighter uppercase text-white"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontStyle: "italic" }}
          >
            Palpi<span className="text-[#FF6B00]">tt</span>e
          </span>
        </div>

        {/* Conteúdo principal — centralizado */}
        <div className="relative z-10 max-w-md mx-auto -mt-16">
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

        {/* Rodapé */}
        <div className="relative z-10 text-slate-500 text-sm">© 2025 Palpitte. Jogue com responsabilidade.</div>
      </div>

      {/* Right Panel – Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12 bg-[#1f2937]">
        <div className="w-full max-w-110">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center justify-center gap-2 mb-10">
            <span
              className="text-3xl tracking-tighter uppercase text-white"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontStyle: "italic" }}
            >
              Palpi<span className="text-[#FF6B00]">tt</span>e
            </span>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-slate-700 mb-8">
            <button className="flex-1 pb-4 text-center text-sm font-bold border-b-2 border-[#FF6B00] text-[#FF6B00]">
              Entrar
            </button>
            <Link href="/cadastro" className="flex-1 pb-4 text-center text-sm font-bold border-b-2 border-transparent text-slate-500 hover:text-slate-300">
              Cadastrar
            </Link>
          </div>

          {/* DEV banner */}
          <div className="mb-6 bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-4 py-3 flex items-start gap-2">
            <span className="material-symbols-outlined text-yellow-400 text-base mt-0.5">construction</span>
            <div>
              <p className="text-yellow-400 text-xs font-bold uppercase tracking-wide">Modo desenvolvimento</p>
              <p className="text-yellow-300/80 text-xs mt-0.5">
                Login: <span className="font-mono font-bold">teste@teste.com</span> · Senha: <span className="font-mono font-bold">123456</span>
              </p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Boas-vindas de volta</h2>
            <p className="text-slate-400 text-sm">Insira seus dados para acessar sua conta.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-200">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="seu@email.com"
                className="w-full h-12 px-4 rounded-lg bg-[#111827] border border-slate-700 text-white focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent outline-none transition-all placeholder:text-slate-500"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-slate-200">Senha</label>
                <a className="text-xs font-semibold text-[#FF6B00] hover:underline" href="#">Esqueci senha</a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full h-12 px-4 pr-12 rounded-lg bg-[#111827] border border-slate-700 text-white focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent outline-none transition-all placeholder:text-slate-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  <span className="material-symbols-outlined text-xl">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-[#FF6B00] hover:bg-orange-600 disabled:opacity-60 text-white font-bold rounded-lg transition-colors shadow-lg shadow-[#FF6B00]/20"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500">
              Não tem uma conta?{" "}
              <Link href="/cadastro" className="text-[#FF6B00] font-bold hover:underline">
                Cadastre-se grátis
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
