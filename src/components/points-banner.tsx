"use client";

import { Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

interface PointsBannerProps {
  points: number;
  rank?: number;
  className?: string;
}

export function PointsBanner({ points, rank, className }: PointsBannerProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 bg-[#FF6B00]/10 border border-[#FF6B00]/20 rounded-xl px-4 py-3",
        className
      )}
    >
      <div className="w-10 h-10 rounded-full bg-[#FF6B00]/20 flex items-center justify-center">
        <Trophy className="w-5 h-5 text-[#FF6B00]" />
      </div>
      <div>
        <p className="text-xs text-zinc-400">Seus pontos</p>
        <p className="text-xl font-bold text-white barlow-condensed">
          {points.toLocaleString("pt-BR")}
          <span className="text-sm font-normal text-zinc-400 ml-1">pts</span>
        </p>
      </div>
      {rank && (
        <div className="ml-auto text-right">
          <p className="text-xs text-zinc-400">Posição</p>
          <p className="text-xl font-bold text-[#FFCA28] barlow-condensed">
            #{rank}
          </p>
        </div>
      )}
    </div>
  );
}
