"use client";

import Link from "next/link";
import { Users, Lock, Globe } from "lucide-react";
import { StatusPill } from "./status-pill";
import { cn } from "@/lib/utils";
import type { BolaoWithDetails } from "@/types";

interface BolaoCardProps {
  bolao: BolaoWithDetails;
  className?: string;
}

export function BolaoCard({ bolao, className }: BolaoCardProps) {
  return (
    <Link href={`/boloes/${bolao.id}`}>
      <div
        className={cn(
          "bg-[#111827] border border-white/5 rounded-xl p-4 hover:border-[#FF6B00]/30 transition-all cursor-pointer group",
          bolao.isJoined && "border-[#FF6B00]/20",
          className
        )}
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {!bolao.isPublic ? (
                <Lock className="w-3 h-3 text-zinc-500 shrink-0" />
              ) : (
                <Globe className="w-3 h-3 text-zinc-500 shrink-0" />
              )}
              <h3 className="font-semibold text-white truncate text-sm">
                {bolao.name}
              </h3>
            </div>
            {bolao.description && (
              <p className="text-xs text-zinc-400 line-clamp-2">
                {bolao.description}
              </p>
            )}
          </div>
          <StatusPill status={bolao.status} />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-zinc-400">
            <Users className="w-3.5 h-3.5" />
            <span className="text-xs">
              {bolao.membersCount}
              {bolao.maxMembers ? `/${bolao.maxMembers}` : ""} participantes
            </span>
          </div>

          {bolao.isJoined ? (
            <span className="text-xs text-[#FF6B00] font-medium">
              Participando →
            </span>
          ) : (
            <span className="text-xs text-zinc-500 group-hover:text-[#FF6B00] transition-colors">
              Entrar →
            </span>
          )}
        </div>

        {bolao.owner && (
          <div className="mt-2 pt-2 border-t border-white/5">
            <p className="text-xs text-zinc-500">
              por{" "}
              <span className="text-zinc-400">{bolao.owner.name}</span>
            </p>
          </div>
        )}
      </div>
    </Link>
  );
}
