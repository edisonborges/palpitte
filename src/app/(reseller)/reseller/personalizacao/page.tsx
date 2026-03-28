import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { BrandEditorClient } from "./brand-editor-client";

export const dynamic = "force-dynamic";

export default async function PersonalizacaoPage() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "RESELLER") {
    redirect("/login");
  }

  const tenant = await prisma.tenant.findFirst({
    where: { users: { some: { id: session.user.id } } },
  });

  if (!tenant) redirect("/login");

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-wrap justify-between items-end gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-black tracking-tight text-white">Personalização da Marca</h1>
          <p className="text-slate-400">
            Configure sua identidade visual única e configurações de domínio personalizado.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300 font-bold text-sm hover:bg-[#1A2233] transition-colors">
            Descartar
          </button>
          <button className="px-6 py-2 rounded-lg bg-[#FF6B00] text-white font-bold text-sm shadow-lg shadow-[#FF6B00]/30 hover:opacity-90 transition-opacity">
            Salvar Alterações
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Left Column: Settings */}
        <div className="flex flex-col gap-6">
          {/* Identity Card */}
          <div className="p-6 rounded-xl bg-[#1A2233] border border-slate-800">
            <div className="flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-[#FF6B00]">badge</span>
              <h3 className="font-bold text-lg text-white">Identidade da Marca</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-300">Nome da Plataforma</label>
                <input
                  className="w-full bg-[#0B1120] border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-[#FF6B00]/40 focus:border-[#FF6B00] outline-none transition-all"
                  type="text"
                  defaultValue={tenant.platformName}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-300">Tagline</label>
                <input
                  className="w-full bg-[#0B1120] border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-[#FF6B00]/40 focus:border-[#FF6B00] outline-none transition-all"
                  type="text"
                  placeholder="O melhor bolão do futebol brasileiro"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-300">E-mail de Contato</label>
                <input
                  className="w-full bg-[#0B1120] border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-[#FF6B00]/40 focus:border-[#FF6B00] outline-none transition-all"
                  type="email"
                  placeholder="contato@suaplataforma.com.br"
                />
              </div>
            </div>
          </div>

          {/* Logo & Assets */}
          <div className="p-6 rounded-xl bg-[#1A2233] border border-slate-800">
            <div className="flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-[#FF6B00]">image</span>
              <h3 className="font-bold text-lg text-white">Ativos Visuais</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <p className="text-sm font-semibold mb-3 text-slate-300">Logo da Marca</p>
                <div className="h-32 rounded-xl border-2 border-dashed border-slate-700 flex flex-col items-center justify-center gap-2 hover:bg-slate-800/50 transition-colors cursor-pointer group">
                  <span className="material-symbols-outlined text-3xl text-slate-400 group-hover:text-[#FF6B00] transition-colors">upload_file</span>
                  <span className="text-xs text-slate-500">SVG, PNG (Max 2MB)</span>
                </div>
              </div>
              <div className="flex flex-col">
                <p className="text-sm font-semibold mb-3 text-slate-300">Favicon</p>
                <div className="h-32 rounded-xl border-2 border-dashed border-slate-700 flex flex-col items-center justify-center gap-2 hover:bg-slate-800/50 transition-colors cursor-pointer group">
                  <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center">
                    <span className="material-symbols-outlined text-slate-400 group-hover:text-[#FF6B00]">insert_photo</span>
                  </div>
                  <span className="text-xs text-slate-500">ICO, PNG (32x32)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Color Pickers */}
          <div className="p-6 rounded-xl bg-[#1A2233] border border-slate-800">
            <div className="flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-[#FF6B00]">colorize</span>
              <h3 className="font-bold text-lg text-white">Paleta de Cores</h3>
            </div>
            <div className="flex flex-wrap gap-8">
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold text-slate-300">Cor Principal</span>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg border-2 border-white shadow-sm ring-1 ring-slate-700 cursor-pointer"
                    style={{ backgroundColor: tenant.primaryColor ?? "#FF6B00" }}
                  ></div>
                  <span className="text-sm font-mono text-slate-300">{tenant.primaryColor ?? "#FF6B00"}</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold text-slate-300">Secundária</span>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-800 border-2 border-white shadow-sm ring-1 ring-slate-700 cursor-pointer"></div>
                  <span className="text-sm font-mono text-slate-300">#1E293B</span>
                </div>
              </div>
            </div>
          </div>

          {/* Domain Configuration */}
          <div className="p-6 rounded-xl bg-[#1A2233] border border-slate-800">
            <div className="flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-[#FF6B00]">language</span>
              <h3 className="font-bold text-lg text-white">Configurações de Domínio</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-300">Subdomínio Palpitte</label>
                <input
                  className="w-full bg-[#0B1120] border border-slate-800 rounded-lg px-4 py-2.5 text-white font-mono focus:ring-2 focus:ring-[#FF6B00]/40 outline-none"
                  type="text"
                  defaultValue={`${tenant.subdomain}.palpitte.com`}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-300">Domínio Próprio</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-sm">link</span>
                    <input
                      className="w-full bg-[#0B1120] border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-white focus:ring-2 focus:ring-[#FF6B00]/40 focus:border-[#FF6B00] outline-none transition-all"
                      type="text"
                      defaultValue={tenant.customDomain ?? ""}
                      placeholder="seudominio.com.br"
                    />
                  </div>
                  <button className="px-4 py-2 rounded-lg bg-[#FF6B00] text-white font-bold text-sm shadow-md shadow-[#FF6B00]/20 hover:opacity-90">
                    Verificar
                  </button>
                </div>
                <p className="mt-2 text-[10px] text-slate-500 flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">info</span>
                  O registro CNAME deve apontar para proxy.palpitte.com
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Preview */}
        <div className="relative">
          <div className="sticky top-24">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-white">Preview ao Vivo</h3>
              <div className="flex bg-[#1A2233] p-1 rounded-lg border border-slate-800">
                <button className="p-2 rounded-md bg-[#FF6B00] shadow-sm text-white">
                  <span className="material-symbols-outlined text-xl">smartphone</span>
                </button>
                <button className="p-2 rounded-md text-slate-500 hover:text-slate-300">
                  <span className="material-symbols-outlined text-xl">desktop_windows</span>
                </button>
              </div>
            </div>

            {/* Mobile Mockup */}
            <div className="mx-auto w-75 h-150 border-8 border-slate-900 rounded-[3rem] overflow-hidden shadow-2xl relative bg-white">
              {/* Mobile Status Bar */}
              <div className="h-6 w-full bg-white flex items-center justify-between px-6 pt-2">
                <span className="text-[10px] font-bold text-slate-900">9:41</span>
                <div className="flex gap-1 text-slate-900">
                  <span className="material-symbols-outlined text-xs">signal_cellular_4_bar</span>
                  <span className="material-symbols-outlined text-xs">wifi</span>
                  <span className="material-symbols-outlined text-xs">battery_full</span>
                </div>
              </div>
              {/* Mockup Content */}
              <div className="h-full overflow-y-auto bg-slate-50 pb-20">
                {/* Preview Header */}
                <div className="px-4 py-3 flex items-center justify-between bg-white border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded flex items-center justify-center text-white text-[10px] font-black"
                      style={{ backgroundColor: tenant.primaryColor ?? "#FF6B00" }}
                    >
                      {tenant.platformName.slice(0, 1).toUpperCase()}
                    </div>
                    <span className="text-sm font-bold text-slate-900">{tenant.platformName}</span>
                  </div>
                  <span className="material-symbols-outlined text-slate-600">menu</span>
                </div>
                {/* Preview Hero */}
                <div className="p-6 text-center" style={{ background: `linear-gradient(to bottom, ${tenant.primaryColor ?? "#FF6B00"}10, transparent)` }}>
                  <h4 className="text-xl font-black text-slate-900 leading-tight mb-2">
                    O melhor bolão do futebol
                  </h4>
                  <p className="text-[10px] text-slate-500 mb-6">
                    Participe de ligas públicas ou crie a sua própria para jogar com amigos.
                  </p>
                  <button
                    className="w-full text-white py-2.5 rounded-lg text-xs font-bold shadow-lg"
                    style={{ backgroundColor: tenant.primaryColor ?? "#FF6B00" }}
                  >
                    Criar meu Bolão
                  </button>
                </div>
                {/* Preview Stats */}
                <div className="px-4 grid grid-cols-2 gap-3 mt-2">
                  <div className="p-3 rounded-xl bg-white border border-slate-100 shadow-sm">
                    <p className="text-[8px] uppercase tracking-wider text-slate-400 font-bold">Jogadores</p>
                    <p className="text-lg font-black text-slate-900">12.5k</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-slate-100 shadow-sm">
                    <p className="text-[8px] uppercase tracking-wider text-slate-400 font-bold">Ligas</p>
                    <p className="text-lg font-black text-slate-900">1.2k</p>
                  </div>
                </div>
              </div>
              {/* Mobile Home Indicator */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-800 rounded-full"></div>
            </div>

            <div className="mt-8 p-4 rounded-xl border border-slate-800 bg-[#1A2233]">
              <p className="text-xs text-slate-500 italic text-center">
                &ldquo;Este preview reflete a identidade visual da sua plataforma.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
