"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Avatar } from "./avatar";
import { StatusPill } from "./status-pill";
import { Button } from "./ui/button";
import { MoreHorizontal, UserX, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import type { UserSummary } from "@/types";

interface UsersTableProps {
  users: UserSummary[];
  onStatusChange?: (userId: string, status: "ACTIVE" | "SUSPENDED") => void;
  className?: string;
}

export function UsersTable({ users, onStatusChange, className }: UsersTableProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function handleStatusToggle(user: UserSummary) {
    const newStatus = user.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    setLoadingId(user.id);

    try {
      const res = await fetch(`/api/reseller/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error();

      toast.success(
        newStatus === "SUSPENDED"
          ? "Usuário suspenso"
          : "Usuário reativado"
      );
      onStatusChange?.(user.id, newStatus);
    } catch {
      toast.error("Erro ao atualizar usuário");
    } finally {
      setLoadingId(null);
    }
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-12 text-zinc-500 text-sm">
        Nenhum usuário encontrado
      </div>
    );
  }

  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/5">
            <th className="text-left py-3 px-4 text-xs font-medium text-zinc-400">
              Usuário
            </th>
            <th className="text-left py-3 px-4 text-xs font-medium text-zinc-400 hidden sm:table-cell">
              Email
            </th>
            <th className="text-right py-3 px-4 text-xs font-medium text-zinc-400">
              Pontos
            </th>
            <th className="text-center py-3 px-4 text-xs font-medium text-zinc-400 hidden md:table-cell">
              Status
            </th>
            <th className="text-right py-3 px-4 text-xs font-medium text-zinc-400 hidden lg:table-cell">
              Cadastro
            </th>
            <th className="py-3 px-4 w-10" />
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              className="border-b border-white/5 hover:bg-white/2 transition-colors"
            >
              <td className="py-3 px-4">
                <div className="flex items-center gap-3">
                  <Avatar name={user.name} size="sm" />
                  <span className="text-sm font-medium text-white">
                    {user.name}
                  </span>
                </div>
              </td>
              <td className="py-3 px-4 text-sm text-zinc-400 hidden sm:table-cell">
                {user.email}
              </td>
              <td className="py-3 px-4 text-right">
                <span className="text-sm font-bold text-[#FF6B00] barlow-condensed">
                  {user.points.toLocaleString("pt-BR")}
                </span>
              </td>
              <td className="py-3 px-4 text-center hidden md:table-cell">
                <StatusPill status={user.status} />
              </td>
              <td className="py-3 px-4 text-right text-xs text-zinc-500 hidden lg:table-cell">
                {new Date(user.createdAt).toLocaleDateString("pt-BR")}
              </td>
              <td className="py-3 px-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-7 h-7 text-zinc-500 hover:text-white"
                  onClick={() => handleStatusToggle(user)}
                  disabled={loadingId === user.id}
                >
                  {user.status === "ACTIVE" ? (
                    <UserX className="w-3.5 h-3.5" />
                  ) : (
                    <UserCheck className="w-3.5 h-3.5" />
                  )}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
