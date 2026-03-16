"use client";

import { useState } from "react";
import { BrandEditor } from "@/components/brand-editor";
import { LivePreview } from "@/components/live-preview";
import type { Tenant } from "@/types";

export function BrandEditorClient({ tenant }: { tenant: Tenant }) {
  const [currentTenant, setCurrentTenant] = useState<Tenant>(tenant);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-[#111827] rounded-xl p-6 border border-white/5">
        <h2 className="font-semibold text-white mb-4">Configurações de marca</h2>
        <BrandEditor tenant={currentTenant} onUpdate={setCurrentTenant} />
      </div>

      <div>
        <LivePreview
          brand={{
            name: currentTenant.platformName,
            primaryColor: currentTenant.primaryColor,
            logoUrl: currentTenant.logoUrl ?? undefined,
            customDomain: currentTenant.customDomain ?? undefined,
          }}
        />

        <div className="mt-4 bg-[#111827] rounded-xl p-4 border border-white/5">
          <h3 className="text-sm font-medium text-zinc-300 mb-3">
            Informações do domínio
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-500">Subdomínio Palpitte:</span>
              <span className="text-white font-mono">
                {currentTenant.subdomain}.palpitte.com
              </span>
            </div>
            {currentTenant.customDomain && (
              <div className="flex justify-between">
                <span className="text-zinc-500">Domínio próprio:</span>
                <span className="text-white font-mono">
                  {currentTenant.customDomain}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
