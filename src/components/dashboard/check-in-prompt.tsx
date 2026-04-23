"use client";

import { useState } from "react";
import { Activity, ArrowRight } from "lucide-react";
import { CheckInModal } from "./check-in-modal";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export function CheckInPrompt({ lastCheckInDate }: { lastCheckInDate: Date | null }) {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const t = useTranslations("checkIn");

	// Check if a check-in was done in the last 24 hours
	const isCheckInDue = !lastCheckInDate || 
		(new Date().getTime() - new Date(lastCheckInDate).getTime()) > 24 * 60 * 60 * 1000;

	if (!isCheckInDue) return null;

	return (
		<>
			<div className="bg-gradient-to-r from-terra-500 to-terra-600 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden mb-8 shadow-xl shadow-terra-500/20">
				<div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/10 rounded-full blur-3xl pointer-events-none" />
				
				<div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
					<div className="flex items-start space-x-4">
						<div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
							<Activity className="w-6 h-6 text-white" />
						</div>
						<div>
							<h3 className="text-xl font-medium mb-1">{t("promptTitle")}</h3>
							<p className="text-terra-100 max-w-md">
								{t("promptDescription")}
							</p>
						</div>
					</div>
					
					<Button 
						onClick={() => setIsModalOpen(true)}
						className="bg-white text-terra-600 hover:bg-sand-50 rounded-xl h-12 px-6 shrink-0 font-semibold"
					>
						{t("promptButton")} <ArrowRight className="w-4 h-4 ml-2 rtl:rotate-180" />
					</Button>
				</div>
			</div>

			<CheckInModal 
				isOpen={isModalOpen} 
				onClose={() => setIsModalOpen(false)} 
			/>
		</>
	);
}
