import { Resend } from "resend";
import { render } from "react-email";
import * as React from "react";

import { WelcomeEmail } from "@/components/emails/welcome-email";
import { PartnerInviteEmail } from "@/components/emails/partner-invite-email";
import { PasswordResetEmail } from "@/components/emails/password-reset-email";
import { SubscriptionConfirmationEmail } from "@/components/emails/subscription-confirmation-email";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = "onboarding@resend.dev"; // Using Resend's default test sandboxed domain
const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Intimera";

export async function sendWelcomeEmail(to: string, userName: string) {
	try {
		const html = await render(
			React.createElement(WelcomeEmail, {
				userName,
				appName: APP_NAME,
				loginUrl: `${process.env.NEXT_PUBLIC_APP_URL}/login`,
			})
		);

		const { data, error } = await resend.emails.send({
			from: `${APP_NAME} <${FROM_EMAIL}>`,
			to,
			subject: `Welcome to ${APP_NAME}`,
			html,
		});

		if (error) return { success: false, error: error.message };
		return { success: true, data };
	} catch (error: any) {
		console.error("Error sending welcome email:", error);
		return { success: false, error: error.message || "Failed to send email" };
	}
}

export async function sendInviteEmail(partnerEmail: string, inviteUrl: string, inviterName: string) {
	try {
		const html = await render(
			React.createElement(PartnerInviteEmail, {
				inviterName,
				appName: APP_NAME,
				inviteUrl,
			})
		);

		const { data, error } = await resend.emails.send({
			from: `${APP_NAME} <${FROM_EMAIL}>`,
			to: partnerEmail,
			subject: `You have been invited to join an intimacy journey on ${APP_NAME}`,
			html,
		});

		if (error) return { success: false, error: error.message };
		return { success: true, data };
	} catch (error: any) {
		console.error("Error sending invite email:", error);
		return { success: false, error: error.message || "Failed to send email" };
	}
}

export async function sendPasswordResetEmail(to: string, resetUrl: string, userName?: string) {
	try {
		const html = await render(
			React.createElement(PasswordResetEmail, {
				userName,
				appName: APP_NAME,
				resetUrl,
			})
		);

		const { data, error } = await resend.emails.send({
			from: `${APP_NAME} <${FROM_EMAIL}>`,
			to,
			subject: `Reset your password for ${APP_NAME}`,
			html,
		});

		if (error) return { success: false, error: error.message };
		return { success: true, data };
	} catch (error: any) {
		console.error("Error sending password reset email:", error);
		return { success: false, error: error.message || "Failed to send email" };
	}
}

export async function sendSubscriptionConfirmationEmail(to: string, userName: string, planName: string) {
	try {
		const html = await render(
			React.createElement(SubscriptionConfirmationEmail, {
				userName,
				appName: APP_NAME,
				planName,
				dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
			})
		);

		const { data, error } = await resend.emails.send({
			from: `${APP_NAME} <${FROM_EMAIL}>`,
			to,
			subject: `Your ${APP_NAME} ${planName} subscription is active!`,
			html,
		});

		if (error) return { success: false, error: error.message };
		return { success: true, data };
	} catch (error: any) {
		console.error("Error sending subscription confirmation email:", error);
		return { success: false, error: error.message || "Failed to send email" };
	}
}
