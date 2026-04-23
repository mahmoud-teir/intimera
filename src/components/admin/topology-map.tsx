"use client";

import { TopologyNode } from "./topology-node";
import { 
  Users, 
  MessageSquare, 
  BookOpen, 
  Activity, 
  ShieldAlert,
  Zap
} from "lucide-react";

interface TopologyMapProps {
  metrics: {
    totalUsers: number;
    premiumUsers: number;
    totalContent: number;
    totalAiSessions: number;
    totalCheckIns: number;
    pendingPosts: number;
    conversionRate: string;
    newUsersThisMonth: number;
  };
}

export function TopologyMap({ metrics }: TopologyMapProps) {
  return (
    <div className="relative w-full min-h-[700px] flex items-center justify-center overflow-hidden p-16">
      {/* Background Sanctuary Decor - Tonal Layers */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(216,95,60,0.03)_0%,transparent_70%)]" />
      <div className="absolute inset-0 opacity-5 dark:opacity-10" 
           style={{ backgroundImage: "radial-gradient(var(--color-terra-500) 0.5px, transparent 0.5px)", backgroundSize: "60px 60px" }} />

      {/* SVG Connections Layer - Using Radiance Primary */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="sanctuary-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--color-terra-500)" stopOpacity="0" />
            <stop offset="50%" stopColor="var(--color-terra-500)" stopOpacity="0.2" />
            <stop offset="100%" stopColor="var(--color-terra-500)" stopOpacity="0" />
          </linearGradient>
        </defs>
        
        <path d="M 50% 50% L 25% 30%" stroke="url(#sanctuary-grad)" strokeWidth="1" fill="none" className="topology-line" />
        <path d="M 50% 50% L 75% 30%" stroke="url(#sanctuary-grad)" strokeWidth="1" fill="none" className="topology-line" style={{ animationDelay: "0.5s" }} />
        <path d="M 50% 50% L 25% 70%" stroke="url(#sanctuary-grad)" strokeWidth="1" fill="none" className="topology-line" style={{ animationDelay: "1s" }} />
        <path d="M 50% 50% L 75% 70%" stroke="url(#sanctuary-grad)" strokeWidth="1" fill="none" className="topology-line" style={{ animationDelay: "1.5s" }} />
        <path d="M 50% 50% L 50% 15%" stroke="url(#sanctuary-grad)" strokeWidth="1" fill="none" className="topology-line" style={{ animationDelay: "2s" }} />
      </svg>

      {/* Nodes Layer - Intentional Asymmetry */}
      <div className="relative z-10 w-full max-w-6xl h-full flex flex-wrap items-center justify-center gap-20 md:gap-32">
        
        {/* Editorial Left Column */}
        <div className="flex flex-col gap-32">
          <TopologyNode 
            label="Total Guardians"
            value={metrics.totalUsers.toLocaleString()}
            subValue={`+${metrics.newUsersThisMonth} new this cycle`}
            icon={Users}
            color="from-sand-400 to-sand-600"
            className="float-slow"
          />
          <TopologyNode 
            label="Archive Assets"
            value={metrics.totalContent.toLocaleString()}
            subValue="Curation Active"
            icon={BookOpen}
            color="from-sage-400 to-sage-600"
            className="float-slow"
            style={{ animationDelay: "1s" }}
          />
        </div>

        {/* Center: The Sanctum Heart */}
        <div className="relative group">
          <div className="absolute -inset-24 rounded-full bg-terra-500/5 blur-[100px] glow-pulse" />
          <div className="bg-surface/80 dark:bg-sanctum/80 backdrop-blur-3xl relative w-56 h-56 rounded-full flex flex-col items-center justify-center border border-terra-500/10 shadow-2xl shadow-terra-500/5 group-hover:scale-105 transition-all duration-700">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-terra-500 to-terra-700 flex items-center justify-center mb-4 shadow-xl shadow-terra-500/20 group-hover:rotate-12 transition-all duration-700">
              <Zap className="w-10 h-10 text-white fill-white" />
            </div>
            <p className="text-[11px] font-bold text-foreground/30 tracking-[0.4em] uppercase mb-1">Sanctum Heart</p>
            <p className="text-[10px] text-sage-600 dark:text-sage-400 font-bold uppercase tracking-widest animate-pulse">Pulse Optimal</p>
          </div>
        </div>

        {/* Editorial Right Column */}
        <div className="flex flex-col gap-32">
          <TopologyNode 
            label="Whisper Sessions"
            value={metrics.totalAiSessions.toLocaleString()}
            subValue="AI Empathy active"
            icon={MessageSquare}
            color="from-terra-400 to-terra-600"
            className="float-slow"
            style={{ animationDelay: "0.5s" }}
          />
          <TopologyNode 
            label="Wellness Flows"
            value={metrics.totalCheckIns.toLocaleString()}
            subValue="Daily rituals"
            icon={Activity}
            color="from-amber-300 to-amber-500"
            className="float-slow"
            style={{ animationDelay: "1.5s" }}
          />
        </div>

        {/* Floating Moderation Hub */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-12">
          <TopologyNode 
            label="Moderation Queue"
            value={metrics.pendingPosts}
            subValue={metrics.pendingPosts > 0 ? "Review Required" : "Archive Secure"}
            icon={ShieldAlert}
            color="from-terra-600 to-terra-800"
            status={metrics.pendingPosts > 0 ? "warning" : "healthy"}
            className="float-slow"
            style={{ animationDelay: "2s" }}
          />
        </div>
      </div>
    </div>
  );
}
