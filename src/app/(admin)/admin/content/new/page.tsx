import { db } from "@/lib/db";
import { ContentForm } from "@/components/admin/content-form";
import { createContent } from "../actions";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
	const t = await getTranslations("admin.contentForm.newAsset");
	return { title: t("vaultNewAsset") };
}

export default async function NewContentPage() {
	const t = await getTranslations("admin.contentForm.newAsset");
	const categories = await db.category.findMany({
		select: {
			id: true,
			name: true,
			slug: true,
		},
		orderBy: {
			name: "asc",
		},
	});

	return (
		<div className="max-w-[1600px] mx-auto px-12 py-16 space-y-16">
			{/* Editorial Header */}
			<header className="space-y-6 max-w-3xl">
				<div className="flex items-center gap-4 text-terra-500 font-bold uppercase tracking-[0.4em] text-xs">
					<div className="w-12 h-px bg-terra-500/30" />
					{t("assetCreation")}
				</div>
				<h1 className="text-6xl font-medium tracking-tighter text-foreground leading-[1.1]">
					{t("vaultNewAsset")}
				</h1>
				<p className="text-lg text-foreground/60 font-semibold leading-relaxed">
					{t("description")}
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
