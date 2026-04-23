import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { ContentForm } from "@/components/admin/content-form";
import { updateContent } from "../../actions";

interface EditContentPageProps {
	params: Promise<{ id: string }>;
}

export default async function EditContentPage({ params }: EditContentPageProps) {
	const { id } = await params;

	const content = await db.content.findUnique({
		where: { id },
		include: {
			translations: true,
		},
	});

	if (!content) {
		notFound();
	}

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
				<div className="flex items-center gap-4 text-amber-500 font-bold uppercase tracking-[0.4em] text-[11px]">
					<div className="w-12 h-px bg-amber-500/30" />
					Asset Refinement
				</div>
				<h1 className="text-6xl font-light tracking-tighter text-foreground leading-[1.1]">
					Edit <span className="text-terra-500 italic">Asset</span>
				</h1>
				<p className="text-lg text-foreground/40 font-medium leading-relaxed">
					Refine the wisdom stored in the archive. Update visuals, content, and metadata.
				</p>
			</header>

			<ContentForm 
				initialData={content}
				categories={categories} 
				onSave={async (data) => {
					"use server";
					await updateContent(id, data);
				}} 
			/>
		</div>
	);
}
