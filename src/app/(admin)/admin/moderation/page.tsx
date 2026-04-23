import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Role } from "@/generated/prisma/client";
import { ModerationQueue } from "@/components/admin/moderation-queue";
import { ShieldAlert, CheckCircle, XCircle } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = { title: "Sanctuary Moderation" };

async function approvePost(id: string) {
	"use server";
	await db.communityPost.update({ where: { id }, data: { status: "APPROVED" } });
	revalidatePath("/admin/moderation");
}

async function rejectPost(id: string) {
	"use server";
	await db.communityPost.update({ where: { id }, data: { status: "REJECTED" } });
	revalidatePath("/admin/moderation");
}

export default async function AdminModerationPage() {
	const session = await auth.api.getSession({ headers: await headers() });
	if ((session?.user?.role as Role) === Role.CONTENT_MANAGER) redirect("/admin/content");

	const [pendingPosts, stats] = await Promise.all([
		db.communityPost.findMany({
			where: { status: "PENDING" },
			include: {
				topic: { select: { name: true } },
				author: { select: { name: true, email: true } },
			},
			orderBy: { createdAt: "asc" },
			take: 50,
		}),
		db.communityPost.groupBy({
			by: ["status"],
			_count: { _all: true },
		}),
	]);

	const statusCounts = Object.fromEntries(
		stats.map((s) => [s.status, s._count._all])
	);

	const statsCards = [
		{ label: "Pending Verdict", value: statusCounts["PENDING"] ?? 0, icon: ShieldAlert, color: "text-terra-500", bg: "bg-terra-500/5" },
		{ label: "Approved Flows", value: statusCounts["APPROVED"] ?? 0, icon: CheckCircle, color: "text-sage-500", bg: "bg-sage-500/5" },
		{ label: "Rejected Anomalies", value: statusCounts["REJECTED"] ?? 0, icon: XCircle, color: "text-foreground/20", bg: "bg-subtle" },
	];

	return (
		<div className="max-w-[1600px] mx-auto px-12 py-16 space-y-24 relative overflow-hidden">
			{/* Decorative Backdrop Glow */}
			<div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-terra-500/5 rounded-full blur-[140px] pointer-events-none" />

			{/* Editorial Header */}
			<header className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 relative z-10">
				<div className="space-y-8 max-w-3xl">
					<div className="flex items-center gap-4 text-terra-500 font-bold uppercase tracking-[0.4em] text-[11px] animate-in slide-in-from-left duration-700">
						<div className="w-12 h-px bg-terra-500/30" />
						Integrity Control
					</div>
					<h1 className="text-7xl font-light tracking-tighter text-foreground leading-[1.1] animate-in fade-in slide-in-from-bottom-4 duration-1000">
						Content <span className="text-terra-500 italic">Moderation</span>
					</h1>
					<p className="text-xl text-foreground/40 font-medium leading-relaxed max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
						Govern the discourse of the sanctuary. Maintain the high-vibration environment 
						by reviewing flagged community flows and ensuring collective peace.
					</p>
				</div>
				
				<div className={`px-12 py-8 rounded-full glass-morphism border flex items-center gap-6 shadow-2xl transition-all duration-700 animate-in zoom-in duration-1000 ${
					(statusCounts["PENDING"] ?? 0) > 0
						? "border-terra-500/20 shadow-terra-500/5"
						: "border-sage-500/20 shadow-sage-500/5"
				}`}>
					<div className={`w-4 h-4 rounded-full ${(statusCounts["PENDING"] ?? 0) > 0 ? "bg-terra-500 animate-ping shadow-[0_0_12px_rgba(239,68,68,0.5)]" : "bg-sage-500 shadow-[0_0_12px_rgba(34,197,94,0.5)]"}`} />
					<span className="text-xs font-bold uppercase tracking-[0.3em] text-foreground/60">
						{(statusCounts["PENDING"] ?? 0) > 0 ? `${statusCounts["PENDING"]} Anomalies Detected` : "Sanctuary Secure"}
					</span>
				</div>
			</header>

			{/* High-Level Stats */}
			<section className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
				{statsCards.map(({ label, value, icon: Icon, color, bg }) => (
					<div key={label} className="glass-morphism rounded-[40px] p-12 flex items-center gap-10 group hover:-translate-y-1 transition-all duration-500">
						<div className={`w-20 h-20 rounded-3xl ${bg} flex items-center justify-center transition-transform duration-500 group-hover:scale-110 shadow-inner`}>
							<Icon className={`w-8 h-8 ${color}`} />
						</div>
						<div>
							<p className="text-[11px] font-bold text-foreground/30 uppercase tracking-[0.2em] mb-3">{label}</p>
							<p className="text-5xl font-light tracking-tighter text-foreground">{value.toLocaleString()}</p>
						</div>
					</div>
				))}
			</section>

			{/* Main Queue Area */}
			<section className="pb-32 space-y-12">
				<div className="flex items-center gap-4 px-2">
					<div className="h-px flex-1 bg-gradient-to-r from-transparent via-border/20 to-transparent" />
					<h2 className="text-[10px] font-bold text-foreground/30 uppercase tracking-[0.4em]">Pending Flows</h2>
					<div className="h-px flex-1 bg-gradient-to-r from-transparent via-border/20 to-transparent" />
				</div>
				
				<ModerationQueue
					posts={pendingPosts.map((p) => ({
						id: p.id,
						title: p.title,
						body: p.body,
						topic: p.topic.name,
						authorName: p.isAnonymous ? "Anonymous" : (p.author?.name ?? "Unknown"),
						authorEmail: p.isAnonymous ? null : (p.author?.email ?? null),
						createdAt: p.createdAt.toISOString(),
					}))}
					onApprove={approvePost}
					onReject={rejectPost}
				/>
			</section>
		</div>
	);
}
