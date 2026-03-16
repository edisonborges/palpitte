"use client";

import Link from "next/link";
import { Clock, Lock } from "lucide-react";
import { StatusPill } from "./status-pill";
import { cn } from "@/lib/utils";
import type { MatchWithDetails } from "@/types";

interface MatchCardProps {
  match: MatchWithDetails;
  showPrediction?: boolean;
  className?: string;
}

export function MatchCard({ match, showPrediction = true, className }: MatchCardProps) {
  const isPast = match.closedAt ? new Date(match.closedAt) < new Date() : false;
  const isLive = match.status === "LIVE";
  const isFinished = match.status === "FINISHED";

  const matchDate = new Date(match.matchDate);
  const dateStr = matchDate.toLocaleDateString("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });
  const timeStr = matchDate.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Link href={`/jogos/${match.id}`}>
      <div
        className={cn(
          "bg-[#111827] border border-white/5 rounded-xl p-4 hover:border-[#FF6B00]/30 transition-all cursor-pointer group",
          isLive && "border-green-500/30",
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {match.competition?.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={match.competition.logoUrl}
                alt={match.competition.name}
                className="w-4 h-4 object-contain"
              />
            ) : null}
            <span className="text-xs text-zinc-400">
              {match.competition?.name}
            </span>
          </div>
          <StatusPill status={match.status} />
        </div>

        {/* Teams */}
        <div className="flex items-center gap-3">
          {/* Home */}
          <div className="flex-1 flex flex-col items-center gap-1">
            {match.homeTeam?.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={match.homeTeam.logoUrl}
                alt={match.homeTeam.name}
                className="w-10 h-10 object-contain"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center text-xs font-bold">
                {match.homeTeam?.shortName?.slice(0, 3) ?? "?"}
              </div>
            )}
            <span className="text-xs font-medium text-white text-center">
              {match.homeTeam?.shortName ?? match.homeTeam?.name}
            </span>
          </div>

          {/* Score / Time */}
          <div className="flex flex-col items-center gap-1 min-w-[60px]">
            {isFinished || isLive ? (
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold barlow-condensed text-white">
                  {match.homeScore ?? 0}
                </span>
                <span className="text-zinc-500">×</span>
                <span className="text-2xl font-bold barlow-condensed text-white">
                  {match.awayScore ?? 0}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-zinc-400">
                <Clock className="w-3 h-3" />
                <span className="text-sm">{timeStr}</span>
              </div>
            )}
            <span className="text-xs text-zinc-500">{dateStr}</span>
          </div>

          {/* Away */}
          <div className="flex-1 flex flex-col items-center gap-1">
            {match.awayTeam?.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={match.awayTeam.logoUrl}
                alt={match.awayTeam.name}
                className="w-10 h-10 object-contain"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center text-xs font-bold">
                {match.awayTeam?.shortName?.slice(0, 3) ?? "?"}
              </div>
            )}
            <span className="text-xs font-medium text-white text-center">
              {match.awayTeam?.shortName ?? match.awayTeam?.name}
            </span>
          </div>
        </div>

        {/* Prediction */}
        {showPrediction && (
          <div className="mt-3 pt-3 border-t border-white/5">
            {match.userPrediction ? (
              <div className="flex items-center justify-center gap-2">
                <span className="text-xs text-zinc-400">Seu palpite:</span>
                <span className="text-xs font-bold text-[#FF6B00]">
                  {match.userPrediction.homeScore} × {match.userPrediction.awayScore}
                </span>
                {match.userPrediction.pointsEarned !== null && (
                  <span className="text-xs text-[#00C853] font-medium ml-1">
                    +{match.userPrediction.pointsEarned} pts
                  </span>
                )}
              </div>
            ) : isPast ? (
              <div className="flex items-center justify-center gap-1 text-zinc-500 text-xs">
                <Lock className="w-3 h-3" />
                <span>Palpite encerrado</span>
              </div>
            ) : (
              <div className="text-center text-xs text-[#FF6B00] group-hover:underline">
                Dar palpite →
              </div>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
