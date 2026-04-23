import { redirect } from "next/navigation";
import Link from "next/link";
import { HeartHandshake, Sparkles, Activity, CheckCircle } from "lucide-react";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Button } from "@/components/ui/button";
import { PartnerCard } from "@/components/couple/partner-card";
import { ConnectionHealthChart } from "@/components/couple/connection-health-chart";
import { SharedNotes } from "@/components/couple/shared-notes";
import { getTranslations, getLocale } from "next-intl/server";

export const dynamic = 'force-dynamic';

export default async function CoupleDashboardPage() {
	const session = await auth.api.getSession({
		headers: await headers()
	});

	if (!session?.user) {
		redirect("/login");
	}

	const t = await getTranslations("couple");
	const locale = await getLocale();

	// Fetch couple data
	const coupleMember = await db.coupleMember.findFirst({
		where: { userId: session.user.id },
		include: {
			couple: {
				include: {
					members: {
						include: { user: true }
					},
					sharedNotes: {
						orderBy: { createdAt: "desc" }
					},
					checkIns: {
						orderBy: { createdAt: "asc" },
						take: 10
					}
				}
			}
		}
	});

	// Empty State: Not coupled
	if (!coupleMember || !coupleMember.couple) {
		return (
			<div className="max-w-4xl mx-auto py-12 px-4">
				<div className="bg-gradient-to-br from-terra-500/5 to-sage-500/5 border border-sand-200 dark:border-sand-800 rounded-3xl p-10 md:p-16 text-center flex flex-col items-center">
					<div className="w-20 h-20 bg-white dark:bg-black rounded-full flex items-center justify-center shadow-sm border border-sand-100 dark:border-sand-800 mb-6">
						<HeartHandshake className="w-10 h-10 text-terra-500" strokeWidth={1.5} />
					</div>
					<h1 className="text-3xl font-light tracking-tight text-sand-900 dark:text-sand-100 mb-4">
						{t("emptyTitle")}
					</h1>
					<p className="text-sand-600 dark:text-sand-400 mb-8 max-w-lg leading-relaxed">
						{t("emptyDescription")}
					</p>
					<Link href="/settings/couple">
						<Button className="h-12 px-8 bg-terra-500 hover:bg-terra-600 text-white rounded-xl shadow-md transition-all text-base font-medium group">
							<Sparkles className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
							{t("invitePartner")}
						</Button>
					</Link>
				</div>
			</div>
		);
	}

	const couple = coupleMember.couple;
	const currentUser = couple.members.find(m => m.userId === session.user.id)?.user;
	const partnerUser = couple.members.find(m => m.userId !== session.user.id)?.user;

	// In a real scenario, this happens if partner hasn't accepted yet
	if (!currentUser || !partnerUser) {
		return (
			<div className="max-w-4xl mx-auto py-12 px-4 text-center">
				<h1 className="text-2xl font-light text-sand-900 dark:text-sand-100 mb-4">{t("waitingTitle")}</h1>
				<p className="text-sand-600 dark:text-sand-400">{t("waitingDescription")}</p>
				<Link href="/settings/couple" className="mt-6 inline-block text-terra-500 hover:underline">
					{t("manageInvitations")}
				</Link>
			</div>
		);
	}

	// Fetch Couple-wide Stats
	const [coupleCompletionsCount] = await Promise.all([
		db.exerciseCompletion.count({
			where: {
				userId: { in: couple.members.map(m => m.userId) }
			}
		})
	]);

	// Prepare Chart Data (using connectionScore for connection health)
	const chartData = couple.checkIns.map((ci: any) => ({
		date: ci.createdAt.toLocaleDateString(locale, { month: 'short', day: 'numeric' }),
		score: ci.connectionScore,
	}));

	return (
		<div className="max-w-6xl mx-auto py-6">
			{/* Header */}
			<div className="mb-10 flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-light tracking-tight text-sand-900 dark:text-sand-100">
						{t("title")}
					</h1>
					<p className="text-sand-600 dark:text-sand-400 mt-1">
						{t("description")}
					</p>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
				
				{/* Left Column */}
				<div className="lg:col-span-7 space-y-8">
					{/* Partner Card */}
					<PartnerCard user={currentUser} partner={partnerUser} />

					{/* Connection Health Chart */}
					<div className="bg-white/50 dark:bg-black/20 border border-sand-200 dark:border-sand-800 rounded-3xl p-6 md:p-8">
						<div className="flex items-center justify-between mb-6">
							<div>
								<h2 className="text-xl font-medium text-sand-900 dark:text-sand-100 flex items-center">
									{t("connectionHealth")} <Activity className="w-4 h-4 ml-2 text-terra-500" />
								</h2>
								<p className="text-sm text-sand-500 mt-1">{t("connectionHealthDescription")}</p>
							</div>
						</div>
						<ConnectionHealthChart data={chartData} />
					</div>
					
					{/* Shared Stats Mini-Cards */}
					<div className="grid grid-cols-2 gap-4">
						<div className="bg-sage-50 dark:bg-sage-900/20 border border-sage-200 dark:border-sage-800 rounded-2xl p-6">
							<CheckCircle className="w-6 h-6 text-sage-600 dark:text-sage-400 mb-3" />
							<div className="text-3xl font-light text-sand-900 dark:text-sand-100 mb-1">{coupleCompletionsCount}</div>
							<div className="text-sm font-medium text-sand-600 dark:text-sand-400">{t("sharedStats")}</div>
						</div>
						<div className="bg-terra-50 dark:bg-terra-900/20 border border-terra-200 dark:border-terra-800 rounded-2xl p-6">
							<Sparkles className="w-6 h-6 text-terra-600 dark:text-terra-400 mb-3" />
							<div className="text-3xl font-light text-sand-900 dark:text-sand-100 mb-1">0</div>
							<div className="text-sm font-medium text-sand-600 dark:text-sand-400">{t("milestonesReached")}</div>
						</div>
					</div>
				</div>

				{/* Right Column */}
				<div className="lg:col-span-5 space-y-8">
					{/* Shared Notes */}
					<SharedNotes notes={couple.sharedNotes as any} />
					
					{/* Recommended Shared Activity */}
					<div className="bg-gradient-to-br from-sand-100 to-white dark:from-sand-900/40 dark:to-black/40 border border-sand-200 dark:border-sand-800 rounded-3xl p-6 md:p-8 relative overflow-hidden">
						<div className="relative z-10">
							<h3 className="text-lg font-medium text-sand-900 dark:text-sand-100 mb-2">
								{t("recommendedActivity")}
							</h3>
							<p className="text-sm text-sand-600 dark:text-sand-400 mb-6">
								{t("recommendedActivityDescription")}
							</p>
							<Link href="/exercises">
								<Button className="w-full h-11 bg-black dark:bg-white text-white dark:text-black rounded-xl hover:bg-sand-800 dark:hover:bg-sand-200 transition-colors">
									{t("startExercise")}
								</Button>
							</Link>
						</div>
					</div>
				</div>

			</div>
		</div>
	);
}
