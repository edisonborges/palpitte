"use client";

import { Logo } from "./logo";
import type { BrandSettings } from "@/types";

interface LivePreviewProps {
  brand: BrandSettings;
}

export function LivePreview({ brand }: LivePreviewProps) {
  return (
    <div className="bg-[#111827] rounded-xl p-4 border border-white/5">
      <p className="text-xs text-zinc-500 mb-3 uppercase tracking-widest">
        Preview
      </p>

      {/* Simulated UI */}
      <div
        className="rounded-lg overflow-hidden border border-white/10"
        style={{ backgroundColor: "#0B1120" }}
      >
        {/* Fake header */}
        <div
          className="h-10 flex items-center px-4 gap-3"
          style={{ backgroundColor: "#0D1523", borderBottom: "1px solid rgba(255,255,255,0.05)" }}
        >
          <Logo size="sm" customName={brand.name} customColor={brand.primaryColor} href="" />
        </div>

        {/* Fake content */}
        <div className="p-4 space-y-3">
          {/* Fake card */}
          <div
            className="rounded-lg p-3 border"
            style={{ backgroundColor: "#111827", borderColor: "rgba(255,255,255,0.05)" }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="h-2 w-20 rounded bg-white/10" />
              <div
                className="h-5 w-12 rounded-full text-xs flex items-center justify-center text-white font-medium"
                style={{ backgroundColor: brand.primaryColor }}
              >
                AO VIVO
              </div>
            </div>
            <div className="flex items-center justify-center gap-4 py-2">
              <div className="h-8 w-8 rounded-full bg-white/10" />
              <div className="text-center">
                <div className="h-6 w-16 rounded bg-white/10" />
              </div>
              <div className="h-8 w-8 rounded-full bg-white/10" />
            </div>
            <button
              className="mt-2 w-full py-1.5 rounded text-xs font-medium text-white"
              style={{ backgroundColor: brand.primaryColor }}
            >
              Dar palpite
            </button>
          </div>

          {/* Fake nav items */}
          <div className="flex gap-2">
            {["Dashboard", "Jogos", "Ranking"].map((item, i) => (
              <div
                key={item}
                className="flex-1 py-1.5 rounded text-xs text-center"
                style={{
                  backgroundColor: i === 0 ? `${brand.primaryColor}20` : "rgba(255,255,255,0.05)",
                  color: i === 0 ? brand.primaryColor : "rgba(255,255,255,0.4)",
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="text-xs text-zinc-600 mt-2 text-center">
        Visualização aproximada
      </p>
    </div>
  );
}
