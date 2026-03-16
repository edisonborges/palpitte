import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ConfiguracoesPage() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "RESELLER") {
    redirect("/login");
  }

  const tenant = await prisma.tenant.findFirst({
    where: { users: { some: { id: session.user.id } } },
    include: { subscription: true },
  });

  if (!tenant) redirect("/login");

  const planLabels: Record<string, string> = {
    STARTER: "Starter",
    PRO: "Pro",
    ENTERPRISE: "Enterprise",
  };

  const renewalDate = tenant.subscription?.currentPeriodEnd
    ? new Date(tenant.subscription.currentPeriodEnd).toLocaleDateString("pt-BR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  const priceMonthly = tenant.subscription?.priceMonthly ?? 0;

  return (
    <div className="p-6 md:p-10 lg:px-16 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight">Configurações &amp; Plano</h1>
        <p className="text-slate-400 mt-1">Gerencie seus detalhes de conta, segurança e assinatura.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: User Data & Security */}
        <div className="lg:col-span-7 space-y-8">
          {/* Account Data Section */}
          <section className="bg-[#1A2233] p-6 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2 mb-6 text-[#FF6B00]">
              <span className="material-symbols-outlined">person</span>
              <h3 className="text-lg font-bold text-white">Dados da Conta</h3>
            </div>
            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-300">Nome da Plataforma</label>
                <input
                  className="bg-slate-800/50 border border-slate-700 rounded-lg p-3 text-white focus:ring-1 focus:ring-[#FF6B00] focus:border-[#FF6B00] outline-none"
                  type="text"
                  defaultValue={tenant.platformName}
                  readOnly
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-300">Subdomínio</label>
                <input
                  className="bg-slate-800/50 border border-slate-700 rounded-lg p-3 text-white font-mono focus:ring-1 focus:ring-[#FF6B00] outline-none"
                  type="text"
                  defaultValue={`${tenant.subdomain}.palpitte.com`}
                  readOnly
                />
              </div>
              {tenant.customDomain && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-slate-300">Domínio Próprio</label>
                  <input
                    className="bg-slate-800/50 border border-slate-700 rounded-lg p-3 text-white font-mono focus:ring-1 focus:ring-[#FF6B00] outline-none"
                    type="text"
                    defaultValue={tenant.customDomain}
                    readOnly
                  />
                </div>
              )}
              <a
                href="/reseller/personalizacao"
                className="mt-2 inline-block bg-[#FF6B00] text-white font-bold py-2.5 px-6 rounded-lg hover:brightness-110 transition-all text-sm"
              >
                Editar Personalização
              </a>
            </div>
          </section>

          {/* Security Section */}
          <section className="bg-[#1A2233] p-6 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2 mb-6 text-[#FF6B00]">
              <span className="material-symbols-outlined">security</span>
              <h3 className="text-lg font-bold text-white">Segurança</h3>
            </div>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg">
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-slate-400">key</span>
                  <div>
                    <p className="font-bold text-white">Alterar Senha</p>
                    <p className="text-xs text-slate-500">Atualize sua senha de acesso</p>
                  </div>
                </div>
                <button className="text-sm font-bold text-[#FF6B00] hover:underline">Atualizar</button>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg border-l-4 border-[#FF6B00]">
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-[#FF6B00]">verified_user</span>
                  <div>
                    <p className="font-bold text-white">Autenticação de Dois Fatores (2FA)</p>
                    <p className="text-xs text-slate-500">Segurança adicional para sua conta</p>
                  </div>
                </div>
                <button className="text-sm font-bold text-slate-400 hover:text-red-400 transition-colors">Configurar</button>
              </div>
            </div>
          </section>

          {/* Notifications Section */}
          <section className="bg-[#1A2233] p-6 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2 mb-6 text-[#FF6B00]">
              <span className="material-symbols-outlined">notifications_active</span>
              <h3 className="text-lg font-bold text-white">Preferências de Notificação</h3>
            </div>
            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-slate-300">Notificações por E-mail</span>
                <div className="relative inline-block w-11 h-6">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-700 peer-checked:bg-[#FF6B00] rounded-full transition-colors"></div>
                  <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition-transform"></div>
                </div>
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-slate-300">Alertas de Relatórios Semanais</span>
                <div className="relative inline-block w-11 h-6">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-700 peer-checked:bg-[#FF6B00] rounded-full transition-colors"></div>
                  <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition-transform"></div>
                </div>
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-slate-300">Mensagens de Suporte</span>
                <div className="relative inline-block w-11 h-6">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-700 peer-checked:bg-[#FF6B00] rounded-full transition-colors"></div>
                  <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition-transform"></div>
                </div>
              </label>
            </div>
          </section>
        </div>

        {/* Right Column: Subscription & Billing */}
        <div className="lg:col-span-5 space-y-8">
          {/* My Plan Card */}
          <section className="bg-[#1A2233] p-8 rounded-2xl text-white border border-slate-800 shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="bg-[#FF6B00]/20 text-[#FF6B00] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-[#FF6B00]/30">
                    Plano Atual
                  </span>
                  <h3 className="text-4xl font-black mt-2">
                    Plano {planLabels[tenant.plan] ?? tenant.plan}
                  </h3>
                </div>
                <span className="material-symbols-outlined text-5xl text-[#FF6B00] opacity-50">diamond</span>
              </div>
              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-lg text-slate-400">R$</span>
                  <span className="text-5xl font-black tracking-tight">
                    {priceMonthly.toLocaleString("pt-BR", { minimumFractionDigits: 0 })}
                  </span>
                  <span className="text-lg text-slate-400">/mês</span>
                </div>
                {renewalDate && (
                  <p className="text-slate-400 mt-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">event_repeat</span>
                    Renova em {renewalDate}
                  </p>
                )}
                {tenant.maxUsers && (
                  <p className="text-slate-400 mt-1 flex items-center gap-2 text-sm">
                    <span className="material-symbols-outlined text-sm">group</span>
                    Até {tenant.maxUsers.toLocaleString("pt-BR")} usuários
                  </p>
                )}
              </div>
              <div className="flex gap-3">
                <button className="flex-1 bg-[#FF6B00] text-white font-bold py-3 rounded-xl hover:brightness-110 transition-colors">
                  Fazer Upgrade
                </button>
                <button className="bg-slate-800 text-white font-bold px-6 rounded-xl hover:bg-slate-700 transition-colors border border-slate-700">
                  Gerenciar
                </button>
              </div>
            </div>
          </section>

          {/* Billing History */}
          <section className="bg-[#1A2233] p-6 rounded-xl border border-slate-800">
            <h3 className="text-lg font-bold text-white mb-4">Histórico de Faturamento</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-2">Data</th>
                    <th className="py-3 px-2">Plano</th>
                    <th className="py-3 px-2">Valor</th>
                    <th className="py-3 px-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  <tr>
                    <td className="py-4 px-2 text-slate-400">—</td>
                    <td className="py-4 px-2 font-medium text-white">{planLabels[tenant.plan] ?? tenant.plan}</td>
                    <td className="py-4 px-2 text-white">
                      R$ {priceMonthly.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-4 px-2">
                      <span className="bg-emerald-900/30 text-emerald-400 px-2.5 py-1 rounded-lg text-xs font-bold">
                        Ativo
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <button className="w-full mt-4 text-center text-sm font-bold text-[#FF6B00] hover:underline">
              Ver histórico completo
            </button>
          </section>

          {/* Support Section */}
          <section className="bg-slate-800/20 p-6 rounded-xl border border-dashed border-slate-700">
            <h3 className="text-lg font-bold text-white mb-4">Precisa de Ajuda?</h3>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <a
                className="flex flex-col items-center justify-center p-4 bg-[#1A2233] rounded-lg hover:border-[#FF6B00] border border-transparent transition-all group"
                href="#"
              >
                <span className="material-symbols-outlined text-[#FF6B00] mb-2 group-hover:scale-110 transition-transform">menu_book</span>
                <span className="text-xs font-bold text-slate-300">Base Conhecimento</span>
              </a>
              <a
                className="flex flex-col items-center justify-center p-4 bg-[#1A2233] rounded-lg hover:border-[#FF6B00] border border-transparent transition-all group"
                href="#"
              >
                <span className="material-symbols-outlined text-[#FF6B00] mb-2 group-hover:scale-110 transition-transform">mail</span>
                <span className="text-xs font-bold text-slate-300">Ticket Suporte</span>
              </a>
            </div>
            <button className="w-full bg-white text-slate-900 font-black py-3 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
              <span className="material-symbols-outlined">forum</span>
              Falar no Chat Agora
            </button>
          </section>

          {/* Danger Zone */}
          <section className="bg-red-500/5 p-6 rounded-xl border border-red-500/20">
            <h3 className="text-lg font-bold text-red-400 mb-2">Zona de Risco</h3>
            <p className="text-sm text-slate-400 mb-4">Estas ações são irreversíveis. Tenha cuidado.</p>
            <button className="text-sm text-red-400 border border-red-500/20 rounded-lg px-4 py-2 hover:bg-red-500/10 transition-colors">
              Cancelar assinatura
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
