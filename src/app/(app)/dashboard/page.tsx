import { BookOpen, Sparkles, Heart, Calendar, ArrowRight, Flame, CheckCircle2, Activity, BrainCircuit } from "lucide-react";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { getTranslations, getLocale } from "next-intl/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { Role } from "@/generated/prisma/client";
import { CheckInPrompt } from "@/components/dashboard/check-in-prompt";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
	const session = await auth.api.getSession({ headers: await headers() });

	// Redirect privileged roles to the admin panel
	const role = session?.user?.role as Role | undefined;
	if (role === Role.ADMIN) redirect("/admin/analytics");
	if (role === Role.CONTENT_MANAGER) redirect("/admin/content");
	
	let lastCheckInDate = null;
	let checkInCount = 0;
	let userCompletionsCount = 0;
	let connectionScorePercent = 0;

	if (session?.user) {
		try {
			const [lastCheckIn, count, exerciseCount, recentCheckIns] = await Promise.all([
				db.checkIn.findFirst({
					where: { userId: session.user.id },
					orderBy: { createdAt: "desc" },
					select: { createdAt: true },
				}),
				db.checkIn.count({ where: { userId: session.user.id } }),
				db.exerciseCompletion.count({ where: { userId: session.user.id } }),
				db.checkIn.findMany({
					where: { userId: session.user.id },
					orderBy: { createdAt: "desc" },
					take: 5,
					select: { connectionScore: true }
				})
			]);

			if (lastCheckIn) lastCheckInDate = lastCheckIn.createdAt;
			checkInCount = count;
			userCompletionsCount = exerciseCount;

			if (recentCheckIns.length > 0) {
				const avg = recentCheckIns.reduce((acc, curr) => acc + curr.connectionScore, 0) / recentCheckIns.length;
				connectionScorePercent = Math.round((avg / 5) * 100);
			}
		} catch (error) {
			console.error("Dashboard data fetch error:", error);
		}
	}

	const t = await getTranslations("dashboard");
	const locale = await getLocale();

	// Calculate greeting
	const hour = new Date().getHours();
	let greetingKey = "goodMorning";
	if (hour >= 12 && hour < 17) greetingKey = "goodAfternoon";
	if (hour >= 17) greetingKey = "goodEvening";
	
	const greeting = t(greetingKey);
	const userName = session?.user?.name || t("friend");

	return (
		<div className="flex flex-col gap-12 pb-12">
			{/* Top Bar / Welcome */}
			<section className="flex flex-col gap-1 pt-4 pl-6">
				<h1 className="text-4xl font-light text-[--text-base] tracking-tight">
					{t("greeting", { greeting, name: userName.split(" ")[0] })}{" "}
					<span className="text-terra-500 opacity-80">🌿</span>
				</h1>
				<p className="text-lg text-[--text-muted] font-light">
					{new Date().toLocaleDateString(locale, { weekday: 'long', month: 'long', day: 'numeric' })}
				</p>
			</section>

			{/* Stats Row */}
			<section className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{/* Active Days */}
				<div className="bg-[--bg-surface] rounded-2xl p-8 shadow-[0_8px_32px_rgba(28,20,16,0.05)] ring-1 ring-sand-100 dark:ring-white/5 flex flex-col gap-4 relative overflow-hidden group">
					<div className="absolute -right-8 -top-8 w-32 h-32 bg-terra-100/30 dark:bg-terra-500/10 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-700 pointer-events-none" />
					<div className="flex items-center justify-between z-10">
						<div className="w-10 h-10 rounded-xl bg-terra-50 dark:bg-terra-500/10 flex items-center justify-center">
							<Calendar className="w-5 h-5 text-terra-500" />
						</div>
					</div>
					<div className="z-10 mt-2">
						<p className="text-5xl font-light text-[--text-base]">{checkInCount}</p>
						<p className="text-sm text-[--text-faint] mt-2 font-medium tracking-wide">{t("activeDays")}</p>
					</div>
				</div>

				{/* Exercises Done */}
				<div className="bg-[--bg-surface] rounded-2xl p-8 shadow-[0_8px_32px_rgba(28,20,16,0.05)] ring-1 ring-sand-100 dark:ring-white/5 flex flex-col gap-4 relative overflow-hidden group">
					<div className="absolute -right-8 -top-8 w-32 h-32 bg-sage-100/30 dark:bg-sage-500/10 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-700 pointer-events-none" />
					<div className="flex items-center justify-between z-10">
						<div className="w-10 h-10 rounded-xl bg-sage-50 dark:bg-sage-500/10 flex items-center justify-center">
							<Sparkles className="w-5 h-5 text-sage-500" />
						</div>
					</div>
					<div className="z-10 mt-2">
						<p className="text-5xl font-light text-[--text-base]">{userCompletionsCount}</p>
						<p className="text-sm text-[--text-faint] mt-2 font-medium tracking-wide">{t("exercisesDone")}</p>
					</div>
				</div>

				{/* Connection Score */}
				<div className="bg-[--bg-surface] rounded-2xl p-8 shadow-[0_8px_32px_rgba(28,20,16,0.05)] ring-1 ring-sand-100 dark:ring-white/5 flex flex-col gap-4 relative overflow-hidden group">
					<div className="absolute -right-8 -top-8 w-32 h-32 bg-terra-100/20 dark:bg-terra-500/5 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-700 pointer-events-none" />
					<div className="flex items-center justify-between z-10">
						<div className="w-10 h-10 rounded-xl bg-terra-50 dark:bg-terra-500/10 flex items-center justify-center">
							<Heart className="w-5 h-5 text-terra-500" />
						</div>
					</div>
					<div className="z-10 mt-2">
						<p className="text-5xl font-light text-[--text-base]">
							{connectionScorePercent > 0 ? connectionScorePercent : "-"}<span className="text-3xl text-[--text-faint]">%</span>
						</p>
						<p className="text-sm text-[--text-faint] mt-2 font-medium tracking-wide">{t("connectionScore")}</p>
					</div>
				</div>
			</section>

			{/* Check-in + Quick Actions */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				{/* Daily Check-in — takes 2 cols */}
				<section className="lg:col-span-2">
					<CheckInPrompt lastCheckInDate={lastCheckInDate} />
				</section>

				{/* Quick Actions */}
				<section className="flex flex-col gap-4">
					<h2 className="text-lg font-medium text-[--text-base] px-1">{t("quickAccess")}</h2>
					<Link
						href="/learn"
						className="flex items-center gap-4 p-5 bg-[--bg-surface] rounded-2xl ring-1 ring-sand-100 dark:ring-white/5 shadow-[0_4px_16px_rgba(28,20,16,0.04)] hover:shadow-[0_8px_32px_rgba(28,20,16,0.08)] transition-all group"
					>
						<div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center shrink-0">
							<BookOpen className="w-5 h-5 text-amber-600" />
						</div>
						<div className="flex-1 min-w-0">
							<p className="text-sm font-medium text-[--text-base]">{t("contentLibrary")}</p>
							<p className="text-xs text-[--text-faint] mt-0.5">{t("contentLibraryDescription")}</p>
						</div>
						<ArrowRight className="w-4 h-4 text-[--text-faint] group-hover:text-terra-500 group-hover:translate-x-0.5 transition-all" />
					</Link>

					<Link
						href="/exercises"
						className="flex items-center gap-4 p-5 bg-[--bg-surface] rounded-2xl ring-1 ring-sand-100 dark:ring-white/5 shadow-[0_4px_16px_rgba(28,20,16,0.04)] hover:shadow-[0_8px_32px_rgba(28,20,16,0.08)] transition-all group"
					>
						<div className="w-10 h-10 rounded-xl bg-sage-50 dark:bg-sage-500/10 flex items-center justify-center shrink-0">
							<Sparkles className="w-5 h-5 text-sage-500" />
						</div>
						<div className="flex-1 min-w-0">
							<p className="text-sm font-medium text-[--text-base]">{t("exercisesTitle")}</p>
							<p className="text-xs text-[--text-faint] mt-0.5">{t("exercisesDescription")}</p>
						</div>
						<ArrowRight className="w-4 h-4 text-[--text-faint] group-hover:text-terra-500 group-hover:translate-x-0.5 transition-all" />
					</Link>

					<Link
						href="/advisor"
						className="flex items-center gap-4 p-5 bg-gradient-to-br from-terra-50 to-sand-50 dark:from-terra-500/10 dark:to-sand-900/10 rounded-2xl ring-1 ring-terra-200/40 dark:ring-terra-500/20 shadow-[0_4px_16px_rgba(216,95,60,0.06)] hover:shadow-[0_8px_32px_rgba(216,95,60,0.12)] transition-all group"
					>
						<div className="w-10 h-10 rounded-xl bg-terra-100 dark:bg-terra-500/20 flex items-center justify-center shrink-0">
							<BrainCircuit className="w-5 h-5 text-terra-500" />
						</div>
						<div className="flex-1 min-w-0">
							<p className="text-sm font-medium text-terra-700 dark:text-terra-400">{t("title")}</p>
							<p className="text-xs text-terra-500/70 mt-0.5">{t("advisorDescription")}</p>
						</div>
						<ArrowRight className="w-4 h-4 text-terra-400 group-hover:translate-x-0.5 transition-transform" />
					</Link>
				</section>
			</div>
		</div>
	);
}
