"use client";

import { Check } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface PlanCardProps {
  name: string;
  price: number;
  period?: string;
  features: string[];
  highlighted?: boolean;
  ctaLabel?: string;
  onSelect?: () => void;
  currentPlan?: boolean;
}

export function PlanCard({
  name,
  price,
  period = "mês",
  features,
  highlighted,
  ctaLabel = "Assinar",
  onSelect,
  currentPlan,
}: PlanCardProps) {
  return (
    <div
      className={cn(
        "relative bg-[#111827] rounded-2xl p-6 border flex flex-col",
        highlighted
          ? "border-[#FF6B00] shadow-[0_0_30px_rgba(255,107,0,0.15)]"
          : "border-white/5"
      )}
    >
      {highlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-[#FF6B00] text-white text-xs font-bold px-3 py-1 rounded-full">
            MAIS POPULAR
          </span>
        </div>
      )}

      <div className="mb-6">
        <h3 className="font-bold text-lg text-white barlow-condensed">{name}</h3>
        <div className="flex items-baseline gap-1 mt-2">
          <span className="text-3xl font-bold barlow-condensed text-white">
            R${price}
          </span>
          <span className="text-zinc-400 text-sm">/{period}</span>
        </div>
      </div>

      <ul className="space-y-3 flex-1 mb-6">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
            <Check className="w-4 h-4 text-brand-green shrink-0 mt-0.5" />
            {feature}
          </li>
        ))}
      </ul>

      {currentPlan ? (
        <div className="text-center py-2 rounded-lg bg-white/5 text-zinc-400 text-sm font-medium">
          Plano atual
        </div>
      ) : (
        <Button
          onClick={onSelect}
          className={cn(
            "w-full font-semibold h-11",
            highlighted
              ? "bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white"
              : "bg-white/10 hover:bg-white/15 text-white"
          )}
        >
          {ctaLabel}
        </Button>
      )}
    </div>
  );
}
