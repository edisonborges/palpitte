"use client";

import { Crown, Medal, Trophy } from "lucide-react";
import { Avatar } from "./avatar";
import { cn } from "@/lib/utils";
import type { RankingEntry } from "@/types";

interface RankingTableProps {
  entries: RankingEntry[];
  currentUserId?: string;
  className?: string;
}

function getRankIcon(position: number) {
  if (position === 1) return <Crown className="w-4 h-4 text-brand-gold" />;
  if (position === 2) return <Medal className="w-4 h-4 text-zinc-300" />;
  if (position === 3) return <Trophy className="w-4 h-4 text-amber-600" />;
  return null;
}

function getRankColor(position: number) {
  if (position === 1) return "text-[#FFCA28]";
  if (position === 2) return "text-zinc-300";
  if (position === 3) return "text-amber-600";
  return "text-zinc-500";
}

export function RankingTable({
  entries,
  currentUserId,
  className,
}: RankingTableProps) {
  return (
    <div className={cn("space-y-1", className)}>
      {entries.map((entry) => {
        const isMe = entry.userId === currentUserId;

        return (
          <div
            key={entry.userId}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
              isMe
                ? "bg-[#FF6B00]/10 border border-[#FF6B00]/20"
                : "bg-[#111827] border border-white/5 hover:border-white/10",
              entry.position <= 3 && !isMe && "bg-[#1A2233]"
            )}
          >
            {/* Position */}
            <div
              className={cn(
                "w-8 flex items-center justify-center font-bold barlow-condensed text-lg",
                getRankColor(entry.position)
              )}
            >
              {getRankIcon(entry.position) ?? `#${entry.position}`}
            </div>

            {/* Avatar */}
            <Avatar src={entry.avatarUrl} name={entry.name} size="sm" />

            {/* Name */}
            <div className="flex-1 min-w-0">
              <p className={cn("font-medium text-sm truncate", isMe ? "text-[#FF6B00]" : "text-white")}>
                {entry.name}
                {isMe && <span className="ml-1 text-xs text-zinc-400">(você)</span>}
              </p>
              <p className="text-xs text-zinc-500">
                {entry.totalPredictions} palpites
              </p>
            </div>

            {/* Points */}
            <div className="text-right">
              <p className={cn("font-bold barlow-condensed text-lg", isMe ? "text-[#FF6B00]" : "text-white")}>
                {entry.points.toLocaleString("pt-BR")}
              </p>
              <p className="text-xs text-zinc-500">pts</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
