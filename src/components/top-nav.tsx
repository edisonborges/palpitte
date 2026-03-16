"use client";

import { Menu, Bell } from "lucide-react";
import { Avatar } from "./avatar";
import { useSession } from "next-auth/react";

interface TopNavProps {
  title?: string;
  onMenuClick?: () => void;
}

export function TopNav({ title, onMenuClick }: TopNavProps) {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between h-14 px-4 bg-[#0B1120]/80 backdrop-blur-sm border-b border-white/5">
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="lg:hidden text-zinc-400 hover:text-white"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        {title && (
          <h1 className="font-semibold text-white text-sm">{title}</h1>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button className="relative text-zinc-400 hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#FF6B00] rounded-full" />
        </button>
        {session?.user && (
          <Avatar src={session.user.image} name={session.user.name} size="sm" />
        )}
      </div>
    </header>
  );
}
