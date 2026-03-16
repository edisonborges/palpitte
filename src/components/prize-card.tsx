"use client";

import { Gift, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import type { Prize } from "@/types";

interface PrizeCardProps {
  prize: Prize & { canRedeem?: boolean };
  userPoints?: number;
  onRedeem?: (prizeId: string) => void;
  className?: string;
}

export function PrizeCard({ prize, userPoints, onRedeem, className }: PrizeCardProps) {
  const lacking = userPoints !== undefined ? Math.max(0, prize.pointsCost - userPoints) : 0;
  const outOfStock = prize.stock !== null && prize.stock <= 0;

  return (
    <div
      className={cn(
        "bg-[#111827] border border-white/5 rounded-xl overflow-hidden flex flex-col",
        prize.canRedeem && "border-[#FF6B00]/20",
        className
      )}
    >
      {/* Image */}
      <div className="aspect-video bg-[#0B1120] flex items-center justify-center overflow-hidden">
        {prize.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={prize.imageUrl}
            alt={prize.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <Gift className="w-12 h-12 text-zinc-600" />
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex-1">
          <h3 className="font-semibold text-white text-sm mb-1">{prize.name}</h3>
          {prize.description && (
            <p className="text-xs text-zinc-400 line-clamp-2 mb-3">
              {prize.description}
            </p>
          )}
        </div>

        <div className="space-y-3">
          {/* Points cost */}
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold barlow-condensed text-[#FF6B00]">
              {prize.pointsCost.toLocaleString("pt-BR")}
              <span className="text-sm font-normal text-zinc-400 ml-1">pts</span>
            </span>
            <span className="text-xs text-zinc-500">
              {outOfStock
                ? "Esgotado"
                : prize.stock !== null
                ? `${prize.stock} disponíveis`
                : "Disponível"}
            </span>
          </div>

          {/* Lacking points */}
          {lacking > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-zinc-500">
              <AlertCircle className="w-3 h-3" />
              <span>Faltam {lacking.toLocaleString("pt-BR")} pts</span>
            </div>
          )}

          {/* CTA */}
          {onRedeem && (
            <Button
              onClick={() => onRedeem(prize.id)}
              disabled={!prize.canRedeem || outOfStock}
              size="sm"
              className={cn(
                "w-full",
                prize.canRedeem && !outOfStock
                  ? "bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white"
                  : "bg-white/5 text-zinc-500 cursor-not-allowed"
              )}
            >
              {outOfStock
                ? "Esgotado"
                : prize.canRedeem
                ? "Resgatar"
                : "Pontos insuficientes"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
