"use client";

import { useState, useTransition } from "react";
import { CheckCircle, Trash2, ShieldCheck, Search, Filter, Mail, Calendar, User, Zap } from "lucide-react";

type Role = "USER" | "PREMIUM" | "COUPLES" | "ADMIN" | "CONTENT_MANAGER";

interface UserRow {
	id: string;
	name: string | null;
	email: string;
	role: Role;
	emailVerified: boolean;
	stripeCustomerId: string | null;
	aiSessions: number;
	checkIns: number;
	createdAt: string;
}

const ROLE_LABELS: Record<Role, string> = {
	USER: "Seeker",
	PREMIUM: "Premium Guardian",
	COUPLES: "Union Member",
	ADMIN: "Archon",
	CONTENT_MANAGER: "Vault Keeper",
};

interface AdminUsersTableProps {
	users: UserRow[];
	onDelete: (id: string) => Promise<void>;
	onChangeRole: (id: string, role: Role) => Promise<any>;
}

export function AdminUsersTable({ users, onDelete, onChangeRole }: AdminUsersTableProps) {
	const [search, setSearch] = useState("");
	const [roleFilter, setRoleFilter] = useState<"all" | Role>("all");
	const [isPending, startTransition] = useTransition();
	const [changingRoleFor, setChangingRoleFor] = useState<string | null>(null);

	const filtered = users.filter((u) => {
		const matchesRole = roleFilter === "all" || u.role === roleFilter;
		const matchesSearch =
			(u.name ?? "").toLowerCase().includes(search.toLowerCase()) ||
			u.email.toLowerCase().includes(search.toLowerCase());
		return matchesRole && matchesSearch;
	});

	const ALL_ROLES: Role[] = ["USER", "PREMIUM", "COUPLES", "ADMIN", "CONTENT_MANAGER"];

	return (
		<div className="space-y-12">
			{/* Command Center Filtering */}
			<div className="flex flex-col md:flex-row items-center gap-6">
				<div className="relative flex-1 w-full group">
					<Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-terra-500/40 group-focus-within:text-terra-500 transition-colors" />
					<input
						type="search"
						placeholder="Identify a soul in the sanctuary..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="w-full glass-morphism rounded-full px-14 py-4 text-sm text-foreground placeholder:text-foreground/20 focus:outline-none focus:ring-2 focus:ring-terra-500/20 transition-all font-medium border-none shadow-none"
					/>
				</div>
				<div className="relative w-full md:w-72">
					<Filter className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-terra-500/40" />
					<select
						value={roleFilter}
						onChange={(e) => setRoleFilter(e.target.value as "all" | Role)}
						className="w-full glass-morphism rounded-full px-14 py-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-terra-500/20 transition-all cursor-pointer appearance-none font-medium border-none shadow-none"
					>
						<option value="all">All Disciplines</option>
						{ALL_ROLES.map((r) => (
							<option key={r} value={r}>{ROLE_LABELS[r]}</option>
						))}
					</select>
				</div>
			</div>

			{/* User Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-8">
				{filtered.length === 0 ? (
					<div className="col-span-full glass-morphism rounded-[48px] py-32 text-center border-dashed border-terra-500/10">
						<p className="text-foreground/40 font-medium italic">No guardians found in this circle.</p>
					</div>
				) : (
					filtered.map((user) => (
						<div 
							key={user.id} 
							className="glass-morphism rounded-[40px] p-8 space-y-8 relative overflow-hidden group hover:-translate-y-1 transition-all duration-500"
						>
							{/* Decorative Glow */}
							<div className="absolute -top-10 -right-10 w-32 h-32 bg-terra-500/5 rounded-full blur-3xl group-hover:bg-terra-500/10 transition-colors duration-700" />
							
							<div className="flex items-start justify-between relative z-10">
								<div className="flex items-center gap-4">
									<div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-sand-100 to-sand-200 dark:from-sand-800 dark:to-sand-900 flex items-center justify-center text-terra-600 dark:text-terra-400 text-xl font-light shadow-inner group-hover:scale-105 transition-transform duration-500">
										{user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
									</div>
									<div className="min-w-0">
										<h3 className="text-lg font-light tracking-tight text-foreground flex items-center gap-2">
											{user.name || "Seeker"}
											{user.emailVerified && <CheckCircle className="w-3.5 h-3.5 text-sage-500" />}
										</h3>
										<p className="text-xs text-foreground/40 font-medium truncate flex items-center gap-1.5">
											<Mail className="w-3 h-3" />
											{user.email}
										</p>
									</div>
								</div>
								
								<div className="flex items-center gap-2">
									<button
										disabled={isPending}
										onClick={() => setChangingRoleFor(user.id)}
										className="p-3 rounded-2xl bg-background/50 text-foreground/20 hover:text-terra-500 hover:bg-terra-500/5 transition-all"
										title="Change Discipline"
									>
										<ShieldCheck className="w-4 h-4" />
									</button>
									<button
										disabled={isPending || user.role === "ADMIN"}
										onClick={() => {
											if (confirm(`Remove ${user.email} from the Sanctuary?`)) {
												startTransition(() => onDelete(user.id));
											}
										}}
										className="p-3 rounded-2xl bg-background/50 text-foreground/20 hover:text-terra-500 hover:bg-terra-500/5 transition-all"
										title="Purge"
									>
										<Trash2 className="w-4 h-4" />
									</button>
								</div>
							</div>

							<div className="grid grid-cols-2 gap-4 relative z-10">
								<div className="p-4 rounded-3xl bg-background/30 border border-border/5 space-y-1">
									<p className="text-[9px] font-bold text-foreground/20 uppercase tracking-widest">Discipline</p>
									<p className="text-[10px] font-bold text-terra-500 uppercase tracking-widest truncate">
										{ROLE_LABELS[user.role]}
									</p>
								</div>
								<div className="p-4 rounded-3xl bg-background/30 border border-border/5 space-y-1">
									<p className="text-[9px] font-bold text-foreground/20 uppercase tracking-widest">Initiated</p>
									<p className="text-[10px] font-bold text-foreground/60 uppercase tracking-widest flex items-center gap-1.5">
										<Calendar className="w-3 h-3 text-terra-500/40" />
										{new Date(user.createdAt).toLocaleDateString()}
									</p>
								</div>
							</div>

							<div className="flex items-center justify-between pt-2 relative z-10">
								<div className="flex items-center gap-6">
									<div className="flex flex-col">
										<span className="text-[10px] font-bold text-foreground tracking-tight">{user.aiSessions}</span>
										<span className="text-[8px] font-bold text-foreground/20 uppercase tracking-widest">Whispers</span>
									</div>
									<div className="w-px h-6 bg-border/5" />
									<div className="flex flex-col">
										<span className="text-[10px] font-bold text-foreground tracking-tight">{user.checkIns}</span>
										<span className="text-[8px] font-bold text-foreground/20 uppercase tracking-widest">Rituals</span>
									</div>
								</div>
								<div className="flex items-center gap-1.5">
									<span className={`w-1.5 h-1.5 rounded-full ${user.emailVerified ? 'bg-sage-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]'}`} />
									<span className="text-[8px] font-bold text-foreground/40 uppercase tracking-widest">
										{user.emailVerified ? 'Verified' : 'Pending'}
									</span>
								</div>
							</div>

							{changingRoleFor === user.id && (
								<div className="absolute inset-0 z-20 glass-morphism rounded-[40px] flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-300">
									<p className="text-[10px] font-bold text-terra-500 uppercase tracking-[0.2em] mb-6">Ascend or Descend Soul</p>
									<div className="flex flex-wrap justify-center gap-2">
										{ALL_ROLES.map((r) => (
											<button
												key={r}
												onClick={() => {
													startTransition(async () => {
														await onChangeRole(user.id, r);
														setChangingRoleFor(null);
													});
												}}
												className={`px-4 py-2 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all ${
													user.role === r 
														? 'bg-terra-500 text-white shadow-lg shadow-terra-500/20' 
														: 'bg-background/50 text-foreground/40 hover:text-foreground hover:bg-background'
												}`}
											>
												{ROLE_LABELS[r]}
											</button>
										))}
									</div>
									<button 
										onClick={() => setChangingRoleFor(null)}
										className="mt-8 text-[9px] font-bold text-foreground/20 hover:text-foreground uppercase tracking-widest transition-colors"
									>
										Cancel Transition
									</button>
								</div>
							)}
						</div>
					))
				)}
			</div>

			<div className="flex items-center justify-center py-8 text-[10px] font-bold text-foreground/20 uppercase tracking-[0.4em]">
				Sanctuary Integrity: Optimal
			</div>
		</div>
	);
}
