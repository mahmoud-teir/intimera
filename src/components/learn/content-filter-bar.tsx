"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";

export function ContentFilterBar() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const t = useTranslations("library");

	const categories = [
		{ id: "all", label: t("catAll") },
		{ id: "articles", label: t("catArticles") },
		{ id: "audio", label: t("catAudio") },
		{ id: "exercises", label: t("catExercises") },
	];

	const currentCategory = searchParams.get("category") || "all";
	const currentQuery = searchParams.get("q") || "";
	const currentStage = searchParams.get("stage") || "ANY";

	const [searchTerm, setSearchTerm] = useState(currentQuery);

	// Create a stable query string builder
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

	// Handle search submission
	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		router.push(`${pathname}?${createQueryString("q", searchTerm)}`);
	};

	// Debounce typing
	useEffect(() => {
		const timeoutId = setTimeout(() => {
			if (searchTerm !== currentQuery) {
				router.push(`${pathname}?${createQueryString("q", searchTerm)}`);
			}
		}, 500);
		return () => clearTimeout(timeoutId);
	}, [searchTerm, currentQuery, pathname, createQueryString, router]);

	const handleCategoryChange = (catId: string) => {
		router.push(`${pathname}?${createQueryString("category", catId)}`);
	};

	const handleStageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		router.push(`${pathname}?${createQueryString("stage", e.target.value)}`);
	};

	return (
		<div className="space-y-6 mb-8">
			{/* Search and Filters */}
			<div className="flex flex-col md:flex-row gap-4 items-center justify-between">
				<form onSubmit={handleSearch} className="relative w-full md:w-96">
					<Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sand-400" />
					<Input 
						type="text" 
						placeholder={t("searchPlaceholder")} 
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="w-full ps-9 bg-white/50 dark:bg-black/20 border-sand-200 dark:border-sand-800 rounded-xl"
					/>
				</form>

				<div className="flex items-center gap-3 w-full md:w-auto">
					<div className="relative w-full md:w-auto">
						<select 
							value={currentStage}
							onChange={handleStageChange}
							className="w-full md:w-48 appearance-none bg-white/50 dark:bg-black/20 border border-sand-200 dark:border-sand-800 rounded-xl ps-4 pe-10 py-2 text-sm text-sand-700 dark:text-sand-300 focus:outline-none focus:ring-2 focus:ring-terra-500"
						>
							<option value="ANY">{t("stageAll")}</option>
							<option value="DATING">{t("stageDating")}</option>
							<option value="ENGAGED">{t("stageEngaged")}</option>
							<option value="NEWLYWED">{t("stageNewlywed")}</option>
							<option value="ESTABLISHED">{t("stageEstablished")}</option>
							<option value="RECONNECTING">{t("stageReconnecting")}</option>
						</select>
						<SlidersHorizontal className="absolute end-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sand-400 pointer-events-none" />
					</div>
				</div>
			</div>

			{/* Category Tabs */}
			<div className="flex overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
				<div className="flex gap-2">
					{categories.map((cat) => (
						<button
							key={cat.id}
							onClick={() => handleCategoryChange(cat.id)}
							className={`
								px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors
								${currentCategory === cat.id 
									? "bg-terra-500 text-white shadow-md shadow-terra-500/20" 
									: "bg-white/50 dark:bg-black/20 text-sand-600 dark:text-sand-400 hover:bg-sand-100 dark:hover:bg-sand-900 border border-sand-200 dark:border-sand-800"
								}
							`}
						>
							{cat.label}
						</button>
					))}
				</div>
			</div>
		</div>
	);
}
