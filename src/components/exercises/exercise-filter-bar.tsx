"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";
import { SlidersHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";

export function ExerciseFilterBar() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const t = useTranslations("exercises");
	const libraryT = useTranslations("library");

	const types = [
		{ id: "all", label: t("filterAll") },
		{ id: "COUPLE", label: t("coupleActivity") },
		{ id: "INDIVIDUAL", label: t("individual") },
		{ id: "QUIZ", label: t("quiz") },
	];

	const currentType = searchParams.get("type") || "all";
	const currentStage = searchParams.get("stage") || "ANY";

	const createQueryString = useCallback(
		(name: string, value: string) => {
			const params = new URLSearchParams(searchParams.toString());
			if (value && value !== "all" && value !== "ANY") {
				params.set(name, value);
			} else {
				params.delete(name);
			}
			return params.toString();
		},
		[searchParams]
	);

	const handleTypeChange = (typeId: string) => {
		router.push(`${pathname}?${createQueryString("type", typeId)}`);
	};

	const handleStageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		router.push(`${pathname}?${createQueryString("stage", e.target.value)}`);
	};

	return (
		<div className="space-y-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
			
			{/* Type Tabs */}
			<div className="flex overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:pb-0 scrollbar-hide">
				<div className="flex space-x-2 rtl:space-x-reverse">
					{types.map((type) => (
						<button
							key={type.id}
							onClick={() => handleTypeChange(type.id)}
							className={`
								px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors
								${currentType === type.id 
									? "bg-sage-600 text-white shadow-md shadow-sage-500/20" 
									: "bg-white/50 dark:bg-black/20 text-sand-600 dark:text-sand-400 hover:bg-sand-100 dark:hover:bg-sand-900 border border-sand-200 dark:border-sand-800"
								}
							`}
						>
							{type.label}
						</button>
					))}
				</div>
			</div>

			{/* Stage Filter */}
			<div className="flex items-center gap-3 shrink-0">
				<div className="relative w-full md:w-auto">
						<select 
							value={currentStage}
							onChange={handleStageChange}
							className="w-full md:w-48 appearance-none bg-white/50 dark:bg-black/20 border border-sand-200 dark:border-sand-800 rounded-xl ps-4 pe-10 py-2 text-sm text-sand-700 dark:text-sand-300 focus:outline-none focus:ring-2 focus:ring-sage-500"
						>
							<option value="ANY">{libraryT("stageAll")}</option>
							<option value="DATING">{libraryT("stageDating")}</option>
							<option value="ENGAGED">{libraryT("stageEngaged")}</option>
							<option value="NEWLYWED">{libraryT("stageNewlywed")}</option>
							<option value="ESTABLISHED">{libraryT("stageEstablished")}</option>
							<option value="RECONNECTING">{libraryT("stageReconnecting")}</option>
						</select>
					<SlidersHorizontal className="absolute inset-e-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sand-400 pointer-events-none" />
				</div>
			</div>

		</div>
	);
}
