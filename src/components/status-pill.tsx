import { cn } from "@/lib/utils";

type Status =
  | "SCHEDULED"
  | "LIVE"
  | "FINISHED"
  | "POSTPONED"
  | "CANCELLED"
  | "OPEN"
  | "CLOSED"
  | "ACTIVE"
  | "INACTIVE"
  | "SUSPENDED"
  | "PENDING"
  | "PROCESSING"
  | "DELIVERED"
  | string;

const statusConfig: Record<
  string,
  { label: string; className: string }
> = {
  SCHEDULED: { label: "Agendado", className: "bg-blue-500/20 text-blue-400" },
  LIVE: { label: "Ao Vivo", className: "bg-green-500/20 text-green-400 animate-pulse" },
  FINISHED: { label: "Encerrado", className: "bg-zinc-500/20 text-zinc-400" },
  POSTPONED: { label: "Adiado", className: "bg-yellow-500/20 text-yellow-400" },
  CANCELLED: { label: "Cancelado", className: "bg-red-500/20 text-red-400" },
  OPEN: { label: "Aberto", className: "bg-green-500/20 text-green-400" },
  CLOSED: { label: "Fechado", className: "bg-zinc-500/20 text-zinc-400" },
  ACTIVE: { label: "Ativo", className: "bg-green-500/20 text-green-400" },
  INACTIVE: { label: "Inativo", className: "bg-zinc-500/20 text-zinc-400" },
  SUSPENDED: { label: "Suspenso", className: "bg-red-500/20 text-red-400" },
  PENDING: { label: "Pendente", className: "bg-yellow-500/20 text-yellow-400" },
  PROCESSING: { label: "Processando", className: "bg-blue-500/20 text-blue-400" },
  DELIVERED: { label: "Entregue", className: "bg-green-500/20 text-green-400" },
};

interface StatusPillProps {
  status: Status;
  className?: string;
}

export function StatusPill({ status, className }: StatusPillProps) {
  const config = statusConfig[status] ?? {
    label: status,
    className: "bg-zinc-500/20 text-zinc-400",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
        config.className,
        className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {config.label}
    </span>
  );
}
