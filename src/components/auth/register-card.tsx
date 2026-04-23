"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { authClient } from "@/lib/auth-client";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { Loader2, ArrowRight } from "lucide-react";

const registerSchema = z.object({
	name: z.string().min(2),
	email: z.string().email(),
	password: z.string().min(8),
	confirmPassword: z.string().min(1),
	terms: z.boolean().refine((v) => v === true),
}).refine((data) => data.password === data.confirmPassword, {
	path: ["confirmPassword"],
});

type RegisterValues = z.infer<typeof registerSchema>;

export function RegisterCard() {
	const t = useTranslations("auth.register");
	const router = useRouter();
	const searchParams = useSearchParams();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<RegisterValues>({
		resolver: zodResolver(registerSchema),
		defaultValues: { name: "", email: "", password: "", confirmPassword: "", terms: false },
	});

	async function onSubmit(data: RegisterValues) {
		setIsLoading(true);
		setError(null);

		const { error } = await authClient.signUp.email({
			name: data.name,
			email: data.email,
			password: data.password,
		});

		if (error) {
			setError(error.message || t("error"));
			setIsLoading(false);
			return;
		}

		const plan = searchParams.get("plan");
		router.push(plan ? `/dashboard?welcome=true&plan=${plan}` : "/dashboard?welcome=true");
		router.refresh();
	}

	const inputClass = (hasError: boolean) =>
		`w-full bg-sand-50 border-none rounded-xl px-5 py-3.5 text-[--text-base] placeholder:text-[--text-faint] focus:outline-none focus:ring-2 focus:ring-terra-400/30 focus:bg-white transition-all ${hasError ? "ring-2 ring-red-400/50" : ""}`;

	return (
		<div className="relative w-full max-w-xl">
			{/* Ambient glow */}
			<div className="absolute -bottom-24 -right-24 w-64 h-64 bg-terra-100 rounded-full blur-[80px] opacity-40 pointer-events-none z-0" />

			{/* Card */}
			<div className="relative z-10 bg-white/90 backdrop-blur-xl rounded-[2rem] p-8 md:p-12 shadow-[0_20px_48px_rgba(28,20,16,0.07)] ring-1 ring-sand-200/60 overflow-hidden">

				{/* Header */}
				<header className="mb-10 text-center">
					<p className="text-2xl font-light tracking-widest text-[--text-base] mb-6">
						Intimera<span className="text-terra-500">.</span>
					</p>
					<h1 className="text-4xl font-light text-[--text-base] mb-3 leading-tight">
						{t("title")}
					</h1>
					<p className="text-[--text-muted] text-base font-light max-w-sm mx-auto">
						{t("subtitle")}
					</p>
				</header>

				{/* Error */}
				{error && (
					<div role="alert" className="mb-6 p-3 text-sm text-red-600 bg-red-50 border border-red-200/60 rounded-xl text-center">
						{error}
					</div>
				)}

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
					{/* Name row */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
						<div className="space-y-1.5">
							<label htmlFor="firstName" className="block text-sm font-medium text-[--text-muted] tracking-wide pl-1">{t("firstName")}</label>
							<input
								id="firstName"
								type="text"
								placeholder={t("firstNamePlaceholder")}
								className={inputClass(!!errors.name)}
								disabled={isLoading}
								{...register("name")}
							/>
							{errors.name && <p className="text-sm text-red-500 ml-1">{errors.name.message}</p>}
						</div>
						<div className="space-y-1.5">
							<label htmlFor="lastName" className="block text-sm font-medium text-[--text-muted] tracking-wide pl-1">{t("lastName")}</label>
							<input
								id="lastName"
								type="text"
								placeholder={t("lastNamePlaceholder")}
								className={inputClass(false)}
								disabled={isLoading}
							/>
						</div>
					</div>

					{/* Email */}
					<div className="space-y-1.5">
						<label htmlFor="email" className="block text-sm font-medium text-[--text-muted] tracking-wide pl-1">{t("email")}</label>
						<input
							id="email"
							type="email"
							placeholder={t("emailPlaceholder")}
							className={inputClass(!!errors.email)}
							disabled={isLoading}
							{...register("email")}
						/>
						{errors.email && <p className="text-sm text-red-500 ml-1">{errors.email.message}</p>}
					</div>

					{/* Password */}
					<div className="space-y-1.5">
						<label htmlFor="password" className="block text-sm font-medium text-[--text-muted] tracking-wide pl-1">{t("password")}</label>
						<input
							id="password"
							type="password"
							placeholder={t("passwordPlaceholder")}
							className={inputClass(!!errors.password)}
							disabled={isLoading}
							{...register("password")}
						/>
						{errors.password && <p className="text-sm text-red-500 ml-1">{errors.password.message}</p>}
					</div>

					{/* Confirm Password */}
					<div className="space-y-1.5">
						<label htmlFor="confirmPassword" className="block text-sm font-medium text-[--text-muted] tracking-wide pl-1">{t("confirmPassword")}</label>
						<input
							id="confirmPassword"
							type="password"
							placeholder="••••••••"
							className={inputClass(!!errors.confirmPassword)}
							disabled={isLoading}
							{...register("confirmPassword")}
						/>
						{errors.confirmPassword && <p className="text-sm text-red-500 ml-1">{errors.confirmPassword.message}</p>}
					</div>

					{/* Terms */}
					<div className="flex items-start py-2">
						<div className="flex items-center h-5 mt-0.5">
							<input
								id="terms"
								type="checkbox"
								className="h-4 w-4 rounded border-sand-300 text-terra-500 focus:ring-terra-400 bg-sand-50"
								{...register("terms")}
							/>
						</div>
						<div className="ml-3 text-sm">
							<label htmlFor="terms" className="text-[--text-muted] leading-relaxed">
								{t.rich("terms", {
									terms: (chunks) => <Link href="/terms" className="text-terra-600 hover:text-terra-700 transition-colors">{chunks}</Link>,
									privacy: (chunks) => <Link href="/privacy" className="text-terra-600 hover:text-terra-700 transition-colors">{chunks}</Link>
								})}
							</label>
							{errors.terms && <p className="text-red-500 mt-1">{errors.terms.message}</p>}
						</div>
					</div>

					{/* Submit */}
					<div className="pt-2">
						<button
							type="submit"
							disabled={isLoading}
							className="w-full bg-terra-500 hover:bg-terra-600 text-white rounded-full py-4 px-8 font-semibold text-base hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex justify-center items-center gap-2 disabled:opacity-60"
						>
							{isLoading ? (
								<><Loader2 className="w-4 h-4 animate-spin" />{t("creatingAccount")}</>
							) : (
								t("createAccount")
							)}
						</button>
					</div>
				</form>

				{/* Divider */}
				<div className="mt-8 relative">
					<div className="absolute inset-0 flex items-center">
						<div className="w-full border-t border-sand-200/60" />
					</div>
					<div className="relative flex justify-center text-sm">
						<span className="px-4 bg-white/90 text-[--text-faint] font-medium uppercase">{t("or")}</span>
					</div>
				</div>

				{/* Google */}
				<button
					type="button"
					onClick={() => authClient.signIn.social({ provider: "google" })}
					className="mt-6 w-full flex justify-center items-center gap-3 bg-white border border-sand-200/80 text-[--text-base] rounded-full py-3.5 px-8 font-medium hover:bg-sand-50 transition-colors"
				>
					<svg className="w-5 h-5" viewBox="0 0 24 24">
						<path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
						<path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
						<path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
						<path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
					</svg>
					{t("continueWithGoogle")}
				</button>

				{/* Footer */}
				<p className="mt-10 text-center text-[--text-muted]">
					{t("alreadyHaveAccount")}{" "}
					<Link href="/login" className="font-semibold text-terra-600 hover:text-terra-700 transition-colors ml-1">
						{t("signIn")}
					</Link>
				</p>
			</div>
		</div>
	);
}
