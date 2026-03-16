"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  LayoutDashboard,
  Palette,
  Users,
  Trophy,
  BarChart3,
  Settings,
  LogOut,
  X,
  ChevronRight,
} from "lucide-react";
import { Logo } from "./logo";
import { Avatar } from "./avatar";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/reseller/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/reseller/personalizacao", icon: Palette, label: "Personalização" },
  { href: "/reseller/usuarios", icon: Users, label: "Usuários" },
  { href: "/reseller/boloes", icon: Trophy, label: "Bolões" },
  { href: "/reseller/relatorios", icon: BarChart3, label: "Relatórios" },
  { href: "/reseller/configuracoes", icon: Settings, label: "Configurações" },
];

interface ResellerSidebarProps {
  open?: boolean;
  onClose?: () => void;
}

export function ResellerSidebar({ open, onClose }: ResellerSidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <>
      {open !== undefined && (
        <div
          className={cn(
            "fixed inset-0 bg-black/60 z-30 lg:hidden transition-opacity",
            open ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-64 bg-[#0D1523] border-r border-white/5 z-40 flex flex-col transition-transform duration-300",
          "lg:translate-x-0 lg:static lg:z-auto",
          open !== undefined &&
            (open ? "translate-x-0" : "-translate-x-full lg:translate-x-0")
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/5">
          <div>
            <Logo size="sm" />
            <p className="text-xs text-zinc-500 mt-0.5 pl-9">Painel Revendedor</p>
          </div>
          {onClose && (
            <button onClick={onClose} className="lg:hidden text-zinc-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all group",
                  active
                    ? "bg-[#FF6B00]/10 text-[#FF6B00] font-medium"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                )}
              >
                <item.icon
                  className={cn(
                    "w-4 h-4 shrink-0",
                    active ? "text-[#FF6B00]" : "text-zinc-500 group-hover:text-white"
                  )}
                />
                <span className="flex-1">{item.label}</span>
                {active && <ChevronRight className="w-3 h-3 text-[#FF6B00]" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        {session?.user && (
          <div className="px-3 py-4 border-t border-white/5">
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/5">
              <Avatar src={session.user.image} name={session.user.name} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{session.user.name}</p>
                <p className="text-xs text-[#FF6B00]">Revendedor</p>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-zinc-500 hover:text-red-400 transition-colors"
                title="Sair"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
