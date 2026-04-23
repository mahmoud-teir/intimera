import { useTranslations } from "next-intl";
import { Mail, MessageSquare } from "lucide-react";

export default function ContactPage() {
	const t = useTranslations("marketing.contactPage");

	return (
		<main className="min-h-screen bg-[--bg-base] pt-32 pb-20">
			<div className="max-w-5xl mx-auto px-6 lg:px-8">
				<div className="text-center mb-20">
					<h1 className="text-5xl md:text-7xl font-light text-[--text-base] tracking-tight mb-6">
						{t("title")}
					</h1>
					<p className="text-xl text-[--text-muted] font-light">
						{t("subtitle")}
					</p>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
					{/* Contact Form Placeholder */}
					<div className="bg-sand-100/50 dark:bg-white/5 p-10 rounded-[2.5rem] border border-sand-200 dark:border-white/5">
						<h2 className="text-2xl font-light text-[--text-base] mb-8">
							{t("formTitle")}
						</h2>
						<form className="space-y-6">
							<div>
								<label className="block text-sm font-medium text-[--text-muted] mb-2">
									{t("nameLabel")}
								</label>
								<input 
									type="text" 
									className="w-full bg-white dark:bg-obsidian-dim border border-sand-200 dark:border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-terra-500/20 transition-all"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-[--text-muted] mb-2">
									{t("emailLabel")}
								</label>
								<input 
									type="email" 
									className="w-full bg-white dark:bg-obsidian-dim border border-sand-200 dark:border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-terra-500/20 transition-all"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-[--text-muted] mb-2">
									{t("messageLabel")}
								</label>
								<textarea 
									rows={5}
									className="w-full bg-white dark:bg-obsidian-dim border border-sand-200 dark:border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-terra-500/20 transition-all resize-none"
								></textarea>
							</div>
							<button 
								type="button"
								className="w-full bg-gradient-to-br from-terra-500 to-terra-600 hover:to-terra-700 text-white font-semibold py-5 rounded-2xl shadow-lg shadow-terra-500/20 transition-all hover:-translate-y-1"
							>
								{t("sendButton")}
							</button>
						</form>
					</div>

					{/* Contact Info */}
					<div className="flex flex-col justify-center">
						<h2 className="text-3xl font-light text-[--text-base] mb-12">
							{t("infoTitle")}
						</h2>
						
						<div className="space-y-10">
							<div className="flex items-start gap-6">
								<div className="w-14 h-14 rounded-2xl bg-terra-50 dark:bg-terra-500/10 flex items-center justify-center shrink-0">
									<Mail className="w-6 h-6 text-terra-600 dark:text-terra-400" />
								</div>
								<div>
									<h3 className="text-lg font-medium text-[--text-base] mb-1">
										{t("emailLabel")}
									</h3>
									<p className="text-[--text-muted] font-light leading-relaxed">
										{t("emailInfo")}
									</p>
								</div>
							</div>

							<div className="flex items-start gap-6">
								<div className="w-14 h-14 rounded-2xl bg-sage-50 dark:bg-sage-500/10 flex items-center justify-center shrink-0">
									<MessageSquare className="w-6 h-6 text-sage-600 dark:text-sage-400" />
								</div>
								<div>
									<h3 className="text-lg font-medium text-[--text-base] mb-1">
										{t("pressLabel")}
									</h3>
									<p className="text-[--text-muted] font-light leading-relaxed">
										{t("pressInfo")}
									</p>
								</div>
							</div>
						</div>

						<div className="mt-16 p-8 bg-terra-500/5 rounded-3xl border border-terra-500/10">
							<p className="text-terra-700 dark:text-terra-300 text-sm italic font-light">
								"{t("supportQuote")}"
							</p>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}
