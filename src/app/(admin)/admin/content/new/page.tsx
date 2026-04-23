import { db } from "@/lib/db";
import { ContentForm } from "@/components/admin/content-form";
import { createContent } from "../actions";

export const metadata = { title: "Vault New Asset" };

export default async function NewContentPage() {
	const categories = await db.category.findMany({
		select: {
			id: true,
			name: true,
		},
		orderBy: {
			name: "asc",
		},
	});

	return (
		<div className="max-w-[1600px] mx-auto px-12 py-16 space-y-16">
			{/* Editorial Header */}
			<header className="space-y-6 max-w-3xl">
				<div className="flex items-center gap-4 text-terra-500 font-bold uppercase tracking-[0.4em] text-[11px]">
					<div className="w-12 h-px bg-terra-500/30" />
					Asset Creation
				</div>
				<h1 className="text-6xl font-light tracking-tighter text-foreground leading-[1.1]">
					Vault New <span className="text-terra-500 italic">Asset</span>
				</h1>
				<p className="text-lg text-foreground/40 font-medium leading-relaxed">
					Add a new educational masterpiece to the archive. Upload visuals, localize content, and configure access tiers.
				</p>
			</header>

			<ContentForm 
				categories={categories} 
				onSave={async (data) => {
					"use server";
					await createContent(data);
				}} 
			/>
		</div>
	);
}
