"use client";

import { Minus, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface ScoreInputProps {
  value: number;
  onChange: (v: number) => void;
  disabled?: boolean;
  className?: string;
}

export function ScoreInput({ value, onChange, disabled, className }: ScoreInputProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="w-8 h-8 border-white/10 hover:border-[#FF6B00]/50 hover:bg-[#FF6B00]/10"
        onClick={() => onChange(Math.max(0, value - 1))}
        disabled={disabled || value === 0}
      >
        <Minus className="w-3 h-3" />
      </Button>

      <div className="w-12 h-10 flex items-center justify-center bg-[#0B1120] border border-white/10 rounded-lg">
        <span className="text-2xl font-bold barlow-condensed text-white">
          {value}
        </span>
      </div>

      <Button
        type="button"
        variant="outline"
        size="icon"
        className="w-8 h-8 border-white/10 hover:border-[#FF6B00]/50 hover:bg-[#FF6B00]/10"
        onClick={() => onChange(Math.min(20, value + 1))}
        disabled={disabled || value === 20}
      >
        <Plus className="w-3 h-3" />
      </Button>
    </div>
  );
}
