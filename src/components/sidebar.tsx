"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", icon: "home", label: "Início" },
  { href: "/jogos", icon: "sports_esports", label: "Jogos" },
  { href: "/ranking", icon: "leaderboard", label: "Ranking" },
  { href: "/boloes", icon: "groups", label: "Bolões" },
  { href: "/premios", icon: "redeem", label: "Prêmios" },
  { href: "/perfil", icon: "person", label: "Perfil" },
];

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const initials = session?.user?.name
    ? session.user.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  return (
    <>
      {/* Mobile overlay */}
      {open !== undefined && (
        <div
          className={cn(
            "fixed inset-0 bg-black/60 z-30 lg:hidden transition-opacity",
            open ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-64 bg-[#0a0f1a] border-r border-slate-800 z-40 flex flex-col transition-transform duration-300",
          "lg:translate-x-0 lg:static lg:z-auto",
          open !== undefined &&
            (open ? "translate-x-0" : "-translate-x-full lg:translate-x-0")
        )}
      >
        {/* Logo */}
        <div className="px-6 py-5 flex items-center">
          <Link href="/dashboard" className="flex-1">
            <span
              className="text-3xl font-black tracking-tighter text-white uppercase leading-none hover:opacity-90 transition-opacity"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontStyle: "italic", letterSpacing: "-0.02em" }}
            >
              Palpi<span className="text-[#FF6B00]">tt</span>e
            </span>
          </Link>
          {onClose && (
            <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-white">
              <span className="material-symbols-outlined">close</span>
            </button>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-lg text-sm transition-colors",
                  active
                    ? "bg-[#FF6B00]/10 text-[#FF6B00]"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                )}
              >
                <span className={cn("material-symbols-outlined", active && "text-[#FF6B00]")}>
                  {item.icon}
                </span>
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User brief info */}
        <div className="px-4 py-4">
          <div className="bg-[#161e2d] p-4 rounded-xl border border-slate-800">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-[#FF6B00]/20 flex items-center justify-center text-[#FF6B00] font-bold text-sm">
                {initials}
              </div>
              <div className="overflow-hidden flex-1">
                <p className="text-sm font-bold truncate text-white">
                  {session?.user?.name ?? "Usuário"}
                </p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">Premium Plan</p>
              </div>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="w-full text-xs bg-slate-800 hover:bg-slate-700 py-2 rounded font-medium transition-colors text-slate-300"
            >
              Sair
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
