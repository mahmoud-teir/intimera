"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Mail, ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/routing";

const forgotPasswordSchema = z.object({
	email: z.string().email(),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordCard() {
	const t = useTranslations("auth.forgotPassword");
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ForgotPasswordValues>({
		resolver: zodResolver(forgotPasswordSchema),
		defaultValues: {
			email: "",
		},
	});

	async function onSubmit(data: ForgotPasswordValues) {
		setIsLoading(true);
		setError(null);

		// @ts-expect-error - Better Auth type inference issue
		const { error } = await authClient.forgetPassword({
			email: data.email,
			redirectTo: "/reset-password",
		});

		if (error) {
			setError(error.message || t("error"));
			setIsLoading(false);
			return;
		}

		setIsSubmitted(true);
		setIsLoading(false);
	}

	return (
		<Card className="w-full max-w-md bg-white/90 dark:bg-black/20 backdrop-blur-xl border border-sand-200 dark:border-white/5 shadow-2xl relative overflow-hidden group rounded-3xl">
			{/* Decorative accent gradients */}
			<div className="absolute inset-0 bg-gradient-to-br from-terra-500/10 via-transparent to-sage-500/10 opacity-50 pointer-events-none group-hover:opacity-80 transition-opacity duration-1000" />
			<div className="absolute -top-24 -right-24 w-48 h-48 bg-terra-500/20 blur-[80px] rounded-full pointer-events-none" />
			<div className="absolute -bottom-24 -left-24 w-48 h-48 bg-sage-500/20 blur-[80px] rounded-full pointer-events-none" />

			<CardHeader className="space-y-3 relative z-10 pt-10 px-8">
				<CardTitle className="text-3xl font-light tracking-tight text-center bg-gradient-to-br from-sand-900 to-sand-600 dark:from-sand-100 dark:to-sand-400 bg-clip-text text-transparent">
					{t("title")}
				</CardTitle>
				<CardDescription className="text-center text-sand-600 dark:text-sand-400">
					{isSubmitted
						? t("successDescription")
						: t("description")}
				</CardDescription>
			</CardHeader>
			<CardContent className="relative z-10 px-8 pb-8">
				{!isSubmitted ? (
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
						{error && (
							<div className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl text-center">
								{error}
							</div>
						)}
						<div className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="email" className="text-sand-700 dark:text-sand-300 ml-1">{t("email")}</Label>
								<div className="relative">
									<Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sand-500" />
									<Input
										id="email"
										type="email"
										placeholder={t("emailPlaceholder")}
										className={`pl-10 bg-white dark:bg-black/50 border-sand-200 dark:border-white/10 focus-visible:ring-terra-500/50 rounded-xl h-11 ${
											errors.email ? "border-red-500 focus-visible:ring-red-500" : ""
										}`}
										{...register("email")}
										disabled={isLoading}
									/>
								</div>
								{errors.email && (
									<p className="text-sm text-red-500 ml-1">{errors.email.message}</p>
								)}
							</div>
						</div>

						<Button
							type="submit"
							className="w-full h-11 bg-sand-900 hover:bg-sand-800 dark:bg-sand-100 dark:hover:bg-sand-200 text-sand-50 dark:text-sand-950 rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.1)] dark:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all duration-300"
							disabled={isLoading}
						>
							{isLoading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									{t("sending")}
								</>
							) : (
								t("sendLink")
							)}
						</Button>
					</form>
				) : (
					<div className="flex flex-col items-center justify-center space-y-6 py-4">
						<div className="w-16 h-16 bg-sage-500/20 rounded-full flex items-center justify-center">
							<Mail className="w-8 h-8 text-sage-600 dark:text-sage-400" />
						</div>
						<Button
							type="button"
							variant="outline"
							className="w-full h-11 bg-sand-50 dark:bg-black/10 border-sand-200 dark:border-white/10 hover:bg-sand-100 dark:hover:bg-white/5 text-sand-800 dark:text-sand-200 rounded-xl transition-all"
							onClick={() => setIsSubmitted(false)}
						>
							{t("tryAnother")}
						</Button>
					</div>
				)}
			</CardContent>
			<CardFooter className="relative z-10 flex flex-col justify-center pb-8 p-0">
				<Link href="/login" className="flex items-center text-sm font-medium text-sand-600 dark:text-sand-400 hover:text-terra-600 dark:hover:text-terra-400 transition-colors">
					<ArrowLeft className="w-4 h-4 mr-2" />
					{t("backToLogin")}
				</Link>
			</CardFooter>
		</Card>
	);
}
