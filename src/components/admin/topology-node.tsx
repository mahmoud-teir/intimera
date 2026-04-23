"use client";

import { LucideIcon } from "lucide-react";

interface TopologyNodeProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon: LucideIcon;
  color: string;
  status?: "healthy" | "warning" | "error";
  className?: string;
  style?: React.CSSProperties;
}

export function TopologyNode({
  label,
  value,
  subValue,
  icon: Icon,
  color,
  status = "healthy",
  className = "",
  style = {},
}: TopologyNodeProps) {
  const statusColors = {
    healthy: "bg-sage-500",
    warning: "bg-amber-500",
    error: "bg-terra-500",
  };

  return (
    <div className={`relative group ${className}`} style={style}>
      {/* Node Glow - Editorial, soft depth */}
      <div className={`absolute -inset-8 rounded-[40px] opacity-5 dark:opacity-10 blur-3xl transition-all duration-700 group-hover:opacity-20 bg-gradient-to-br ${color}`} />
      
      {/* Node Content - Following Sanctuary card rules */}
      <div className="bg-surface/60 dark:bg-sanctum/40 backdrop-blur-xl relative flex flex-col items-center justify-center p-8 rounded-[48px] w-56 text-center transition-all duration-500 group-hover:-translate-y-2 group-hover:bg-surface dark:group-hover:bg-sanctum border border-border/5">
        {/* Status Indicator */}
        <div className="absolute top-6 right-6 flex items-center gap-2">
          <span className={`w-1.5 h-1.5 rounded-full ${statusColors[status]} ${status === "healthy" ? "" : "animate-pulse shadow-[0_0_8px_currentColor]"}`} />
        </div>

        {/* Icon - Circular, premium feel */}
        <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${color} flex items-center justify-center mb-5 shadow-xl shadow-black/5 dark:shadow-black/20 group-hover:scale-110 transition-transform duration-500`}>
          <Icon className="w-7 h-7 text-white" aria-hidden="true" />
        </div>

        {/* Label & Value - Editorial scale */}
        <p className="text-[10px] font-bold text-foreground/40 mb-2 uppercase tracking-[0.2em]">{label}</p>
        <p className="text-3xl font-light text-foreground tracking-tighter mb-1">{value}</p>
        {subValue && (
          <p className="text-[10px] text-terra-600 dark:text-terra-400 font-bold uppercase tracking-wide">{subValue}</p>
        )}
      </div>

      {/* Aesthetic Connection Dots */}
      <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-terra-500/20 rounded-full" />
      <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-terra-500/20 rounded-full" />
    </div>
  );
}
