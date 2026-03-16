"use client";

import { useState } from "react";
import { Sidebar } from "@/components/sidebar";

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[#0a0f1a]">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center gap-3 px-4 h-14 border-b border-slate-800 bg-[#0a0f1a]">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-slate-400 hover:text-white"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
          <span
            className="text-xl font-black tracking-tighter text-white uppercase"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontStyle: "italic" }}
          >
            Palpi<span className="text-[#FF6B00]">tt</span>e
          </span>
        </div>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
