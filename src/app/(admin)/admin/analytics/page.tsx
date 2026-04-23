import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Role } from "@/generated/prisma/client";
import { TopologyMap } from "@/components/admin/topology-map";
import { 
	Users, 
	CreditCard, 
	Zap, 
	ArrowUpRight, 
	TrendingUp,
	Clock,
	FileText
} from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
	return { title: "Sanctuary Analytics" };
}

export default async function AdminAnalyticsPage() {
	const t = await import("next-intl/server").then(m => m.getTranslations("admin"));
	const session = await auth.api.getSession({ headers: await headers() });
	if ((session?.user?.role as Role) === Role.CONTENT_MANAGER) redirect("/admin/content");

	// Fetch platform metrics
	const [userCount, premiumCount, contentCount, aiSessions, checkIns, pendingPosts, newUsers] = await Promise.all([
		db.user.count(),
		db.user.count({ where: { role: Role.ADMIN } }), // Placeholder for premium logic
		db.content.count(),
		db.aiConversation.count(),
		db.checkIn.count(),
		db.content.count({ where: { status: "DRAFT" } }),
		db.user.count({ where: { createdAt: { gte: new Date(new Date().setDate(new Date().getDate() - 30)) } } })
	]);

	const metrics = {
		totalUsers: userCount,
		premiumUsers: premiumCount,
		totalContent: contentCount,
		totalAiSessions: aiSessions,
		totalCheckIns: checkIns,
		pendingPosts: pendingPosts,
		conversionRate: ((premiumCount / userCount) * 100).toFixed(1) + "%",
		newUsersThisMonth: newUsers
	};

	const stats = [
		{ label: t("analyticsPage.stats.totalGuardians"), value: userCount, icon: Users, trend: "+12%", color: "text-terra-500" },
		{ label: t("analyticsPage.stats.premiumRituals"), value: premiumCount, icon: CreditCard, trend: "+5%", color: "text-amber-500" },
		{ label: t("analyticsPage.stats.activePulse"), value: "98.2%", icon: Zap, trend: t("analyticsPage.stats.stable"), color: "text-sage-500" },
		{ label: t("analyticsPage.stats.conversionFlow"), value: metrics.conversionRate, icon: TrendingUp, trend: "+2.4%", color: "text-terra-600" },
	];

	return (
		<div className="max-w-[1600px] mx-auto px-12 py-16 space-y-24 relative overflow-hidden">
			{/* Decorative Backdrop Glow */}
			<div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-terra-500/5 rounded-full blur-[140px] pointer-events-none" />

			{/* Editorial Header */}
			<header className="flex flex-col md:flex-row md:items-end justify-between gap-12 relative z-10">
				<div className="space-y-8 max-w-2xl">
					<div className="flex items-center gap-4 text-terra-500 font-bold uppercase tracking-[0.4em] text-[11px] animate-in slide-in-from-left duration-700">
						<div className="w-12 h-px bg-terra-500/30" />
						{t("analyticsPage.intelligenceCommand")}
					</div>
					<h1 className="text-7xl font-light tracking-tighter text-foreground leading-[1.1] animate-in fade-in slide-in-from-bottom-4 duration-1000">
						{t("analyticsPage.title")} <span className="text-terra-500 italic">{t("analyticsPage.titleItalic")}</span>
					</h1>
					<p className="text-xl text-foreground/40 font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
						{t("analyticsPage.description")}
					</p>
				</div>
				<div className="flex items-center gap-6 glass-morphism px-8 py-5 rounded-full border border-border/5 animate-in zoom-in duration-1000">
					<Clock className="w-4 h-4 text-terra-500" />
					<span className="text-[10px] font-bold uppercase tracking-widest text-foreground/60">
						{t("analyticsPage.lastPulse", { time: new Date().toLocaleTimeString() })}
					</span>
				</div>
			</header>

			{/* Metric Grid */}
			<section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
				{stats.map((stat, i) => (
					<div 
						key={i} 
						className="glass-morphism rounded-[40px] p-10 space-y-8 hover:-translate-y-1 transition-all duration-500 group"
					>
						<div className="flex items-start justify-between">
							<div className={`p-5 rounded-3xl bg-background shadow-inner transition-transform duration-500 group-hover:scale-110 ${stat.color}`}>
								<stat.icon className="w-6 h-6" />
							</div>
							<div className="flex items-center gap-1.5 px-3 py-1 bg-sage-500/10 text-sage-600 dark:text-sage-400 rounded-full text-[9px] font-bold uppercase tracking-widest">
								<ArrowUpRight className="w-3 h-3" />
								{stat.trend}
							</div>
						</div>
						<div>
							<p className="text-[11px] font-bold text-foreground/30 uppercase tracking-[0.2em] mb-3">{stat.label}</p>
							<p className="text-5xl font-light tracking-tighter text-foreground leading-none">{stat.value.toLocaleString()}</p>
						</div>
					</div>
				))}
			</section>

			{/* Main Topology Map - The 'Private Sanctuary' Visualization */}
			<section className="space-y-8">
				<div className="flex items-center gap-4 px-2">
					<div className="h-px flex-1 bg-gradient-to-r from-transparent via-border/20 to-transparent" />
					<h2 className="text-[10px] font-bold text-foreground/30 uppercase tracking-[0.4em]">{t("analyticsPage.stats.systemTopology")}</h2>
					<div className="h-px flex-1 bg-gradient-to-r from-transparent via-border/20 to-transparent" />
				</div>
				<div className="bg-surface/20 dark:bg-sanctum/20 rounded-[64px] overflow-hidden border border-border/5 relative shadow-inner">
					<TopologyMap metrics={metrics} />
				</div>
			</section>

			{/* Bottom Insights: Recent Activity & Content Performance */}
			<section className="grid grid-cols-1 lg:grid-cols-2 gap-16 pb-20">
				<div className="space-y-8">
					<h3 className="text-2xl font-light tracking-tight text-foreground flex items-center gap-4">
						{t("analyticsPage.insights.recentFlows")} <span className="italic text-terra-500">{t("analyticsPage.insights.recentFlowsItalic")}</span>
					</h3>
					<div className="bg-surface/30 dark:bg-sanctum/30 backdrop-blur-md rounded-[48px] p-8 border border-border/5 space-y-1">
						{[1, 2, 3, 4].map((_, i) => (
							<div key={i} className="flex items-center gap-6 p-5 rounded-[32px] hover:bg-background/50 transition-all duration-300 group">
								<div className="w-12 h-12 rounded-full bg-gradient-to-br from-sand-100 to-sand-200 dark:from-sand-800 dark:to-sand-900 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-500">
									<Users className="w-5 h-5 text-terra-500" />
								</div>
								<div className="flex-1">
									<p className="text-sm font-semibold text-foreground">{t("analyticsPage.insights.newGuardianJoined")}</p>
									<p className="text-[10px] text-foreground/40 font-medium uppercase tracking-wider">{t("analyticsPage.insights.aura", { id: 1234 + i, time: "2 minutes" })}</p>
								</div>
								<div className="px-4 py-2 bg-sage-500/5 text-sage-600 rounded-full text-[9px] font-bold uppercase tracking-widest border border-sage-500/10">
									{t("analyticsPage.insights.active")}
								</div>
							</div>
						))}
					</div>
				</div>

				<div className="space-y-8">
					<h3 className="text-2xl font-light tracking-tight text-foreground flex items-center gap-4">
						{t("analyticsPage.insights.valuedAssets")} <span className="italic text-terra-500">{t("analyticsPage.insights.valuedAssetsItalic")}</span>
					</h3>
					<div className="bg-surface/30 dark:bg-sanctum/30 backdrop-blur-md rounded-[48px] p-8 border border-border/5 space-y-1">
						{[1, 2, 3, 4].map((_, i) => (
							<div key={i} className="flex items-center gap-6 p-5 rounded-[32px] hover:bg-background/50 transition-all duration-300 group">
								<div className="w-12 h-12 rounded-2xl bg-subtle flex items-center justify-center shrink-0 group-hover:rotate-3 transition-transform duration-500">
									<FileText className="w-5 h-5 text-amber-500" />
								</div>
								<div className="flex-1">
									<p className="text-sm font-semibold text-foreground">The Art of Mindful Touch</p>
									<p className="text-[10px] text-foreground/40 font-medium uppercase tracking-wider">Education • {t("analyticsPage.insights.bookmarks", { count: 450 - i * 12 })}</p>
								</div>
								<div className="px-4 py-2 bg-terra-500/5 text-terra-600 rounded-full text-[9px] font-bold uppercase tracking-widest border border-terra-500/10">
									{t("analyticsPage.insights.trending")}
								</div>
							</div>
						))}
					</div>
				</div>
			</section>
		</div>
	);
}
