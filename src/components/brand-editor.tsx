"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { brandingSchema, type BrandingInput } from "@/lib/validations";
import type { Tenant } from "@/types";

interface BrandEditorProps {
  tenant: Tenant;
  onUpdate?: (updated: Tenant) => void;
}

export function BrandEditor({ tenant, onUpdate }: BrandEditorProps) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
  } = useForm<BrandingInput>({
    resolver: zodResolver(brandingSchema),
    defaultValues: {
      platformName: tenant.platformName,
      tagline: tenant.tagline ?? "",
      primaryColor: tenant.primaryColor ?? "#FF6B00",
      secondaryColor: tenant.secondaryColor ?? "#FFCA28",
      bgColor: tenant.bgColor ?? "#0B1120",
      logoUrl: tenant.logoUrl ?? "",
      faviconUrl: tenant.faviconUrl ?? "",
      customDomain: tenant.customDomain ?? "",
    },
  });

  async function onSubmit(data: BrandingInput) {
    setLoading(true);
    try {
      const res = await fetch("/api/reseller/branding", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error ?? "Erro ao salvar");
        return;
      }

      toast.success("Branding atualizado!");
      onUpdate?.(json.data);
    } catch {
      toast.error("Erro de conexão");
    } finally {
      setLoading(false);
    }
  }

  const primaryColor = watch("primaryColor");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Nome da plataforma */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-300">
          Nome da plataforma
        </label>
        <input
          {...register("platformName")}
          className="w-full bg-[#111827] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:border-[#FF6B00]/50 outline-none"
          placeholder="Ex: PalpiteFut"
        />
        {errors.platformName && (
          <p className="text-xs text-red-400">{errors.platformName.message}</p>
        )}
      </div>

      {/* Tagline */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-300">Tagline</label>
        <input
          {...register("tagline")}
          className="w-full bg-[#111827] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:border-[#FF6B00]/50 outline-none"
          placeholder="Sua frase de impacto"
        />
      </div>

      {/* Cor primária */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-300">Cor primária</label>
        <div className="flex items-center gap-3">
          <input
            {...register("primaryColor")}
            type="color"
            className="w-10 h-10 rounded-lg border border-white/10 bg-transparent cursor-pointer"
          />
          <input
            {...register("primaryColor")}
            className="flex-1 bg-[#111827] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white font-mono focus:border-[#FF6B00]/50 outline-none"
            placeholder="#FF6B00"
          />
          <div
            className="w-10 h-10 rounded-lg border border-white/10"
            style={{ backgroundColor: primaryColor }}
          />
        </div>
        {errors.primaryColor && (
          <p className="text-xs text-red-400">{errors.primaryColor.message}</p>
        )}
      </div>

      {/* Logo URL */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-300">URL do logo</label>
        <input
          {...register("logoUrl")}
          className="w-full bg-[#111827] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:border-[#FF6B00]/50 outline-none"
          placeholder="https://..."
        />
      </div>

      {/* Domínio customizado */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-300">
          Domínio customizado
        </label>
        <input
          {...register("customDomain")}
          className="w-full bg-[#111827] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:border-[#FF6B00]/50 outline-none"
          placeholder="meupalpite.com.br"
        />
      </div>

      <Button
        type="submit"
        disabled={loading || !isDirty}
        className="w-full bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white font-semibold h-11 disabled:opacity-50"
      >
        {loading ? "Salvando..." : "Salvar alterações"}
      </Button>
    </form>
  );
}
