"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  href?: string;
  className?: string;
  customName?: string;
  customColor?: string;
}

const sizes = {
  sm: { icon: 24, text: "text-lg" },
  md: { icon: 32, text: "text-2xl" },
  lg: { icon: 48, text: "text-4xl" },
};

export function Logo({
  size = "md",
  href = "/",
  className,
  customName,
  customColor,
}: LogoProps) {
  const s = sizes[size];
  const color = customColor ?? "#FF6B00";
  const name = customName ?? "Palpitte";

  const content = (
    <div className={cn("flex items-center gap-2", className)}>
      <svg
        width={s.icon}
        height={s.icon}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="32" height="32" rx="8" fill={color} />
        <path
          d="M10 22L16 10L22 22"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 18H20"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
      <span
        className={cn(
          "font-bold tracking-tight barlow-condensed",
          s.text
        )}
        style={{ color }}
      >
        {name}
      </span>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  return content;
}
