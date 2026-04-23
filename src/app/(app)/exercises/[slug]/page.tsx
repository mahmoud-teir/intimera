import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { SubscriptionTier } from "@/generated/prisma/client";
import { ExerciseWizard } from "@/components/exercises/exercise-wizard";
import { Button } from "@/components/ui/button";
import { Lock, ArrowLeft } from "lucide-react";
import Link from "next/link";

import { getTranslations, getLocale } from "next-intl/server";

export const dynamic = 'force-dynamic';

export default async function ExerciseWizardPage({
	params,
}: {
	params: Promise<{ slug: string }>
}) {
	const resolvedParams = await params;
	const t = await getTranslations("exercises");
	const locale = await getLocale();
	
	const session = await auth.api.getSession({
		headers: await headers()
	});

	if (!session?.user) {
		redirect("/login");
	}

	const exercise = await db.exercise.findUnique({
		where: { slug: resolvedParams.slug },
		include: {
			steps: {
				orderBy: { stepNumber: 'asc' }
			}
		}
	});

	if (!exercise) {
		notFound();
	}

	// Filter steps by current locale, or fallback to 'en' if no steps exist for current locale
	let steps = exercise.steps.filter(s => s.locale === locale);
	if (steps.length === 0 && locale !== 'en') {
		steps = exercise.steps.filter(s => s.locale === 'en');
	}

	const userTier = session.user.role === "ADMIN" ? SubscriptionTier.PREMIUM : SubscriptionTier.FREE;
	const isLocked = exercise.tier === SubscriptionTier.PREMIUM && userTier === SubscriptionTier.FREE;

	if (isLocked) {
		return (
			<div className="max-w-2xl mx-auto py-20 text-center px-4">
				<div className="w-20 h-20 bg-terra-100 dark:bg-terra-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
					<Lock className="w-10 h-10 text-terra-500" strokeWidth={1.5} />
				</div>
				<h1 className="text-3xl font-light text-sand-900 dark:text-sand-100 mb-4">
					{t("premiumTitle")}
				</h1>
				<p className="text-sand-600 dark:text-sand-400 mb-8 leading-relaxed max-w-md mx-auto">
					{t("premiumDescription")}
				</p>
				<div className="flex flex-col sm:flex-row items-center justify-center gap-4">
					<Link href="/exercises">
						<Button variant="ghost" className="text-sand-600 dark:text-sand-400 h-12 px-6">
							<ArrowLeft className="w-4 h-4 mr-2 rtl:rotate-180" /> {t("backToCatalog")}
						</Button>
					</Link>
					<Link href="/settings/subscription">
						<Button className="bg-terra-500 hover:bg-terra-600 text-white rounded-xl h-12 px-8 shadow-lg shadow-terra-500/20">
							{t("upgradeToPremium")}
						</Button>
					</Link>
				</div>
			</div>
		);
	}

	if (steps.length === 0) {
		return (
			<div className="max-w-2xl mx-auto py-20 text-center px-4">
				<h1 className="text-2xl font-medium text-sand-900 dark:text-sand-100 mb-4">
					{t("constructionTitle")}
				</h1>
				<p className="text-sand-600 dark:text-sand-400 mb-8">
					{t("constructionDescription")}
				</p>
				<Link href="/exercises">
					<Button className="bg-sand-900 dark:bg-sand-800 hover:bg-sand-800 dark:hover:bg-sand-700 text-white rounded-xl">
						{t("backToCatalog")}
					</Button>
				</Link>
			</div>
		);
	}

	return (
		<div className="w-full px-4 sm:px-6">
			{/* We don't render the header here because the wizard should be full focus */}
			<ExerciseWizard exercise={exercise as any} steps={steps as any} />
		</div>
	);
}
