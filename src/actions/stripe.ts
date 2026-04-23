"use server";

import { stripe } from "@/lib/stripe";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";

const DOMAIN = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function createCheckoutSession(priceId: string) {
	try {
		const session = await auth.api.getSession({
			headers: await headers()
		});

		if (!session?.user) {
			return { success: false, error: "You must be logged in to subscribe." };
		}

		// Check if user already has a Stripe customer ID
		const user = await db.user.findUnique({
			where: { id: session.user.id },
			select: { stripeCustomerId: true }
		});

		let customerId = user?.stripeCustomerId;

		if (!customerId) {
			// Create a new customer in Stripe
			const customer = await stripe.customers.create({
				email: session.user.email,
				name: session.user.name,
				metadata: {
					userId: session.user.id,
				}
			});
			customerId = customer.id;

			// Save to database
			await db.user.update({
				where: { id: session.user.id },
				data: { stripeCustomerId: customerId }
			});
		}

		// Create checkout session
		const checkoutSession = await stripe.checkout.sessions.create({
			customer: customerId,
			payment_method_types: ["card"],
			line_items: [
				{
					price: priceId,
					quantity: 1,
				},
			],
			mode: "subscription",
			success_url: `${DOMAIN}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${DOMAIN}/pricing`,
			metadata: {
				userId: session.user.id,
			}
		});

		return { success: true, url: checkoutSession.url };
	} catch (error) {
		console.error("Error creating checkout session:", error);
		return { success: false, error: "Failed to create checkout session." };
	}
}

export async function createCustomerPortalSession() {
	try {
		const session = await auth.api.getSession({
			headers: await headers()
		});

		if (!session?.user) {
			return { success: false, error: "You must be logged in." };
		}

		const user = await db.user.findUnique({
			where: { id: session.user.id },
			select: { stripeCustomerId: true }
		});

		if (!user?.stripeCustomerId) {
			return { success: false, error: "No billing profile found." };
		}

		const portalSession = await stripe.billingPortal.sessions.create({
			customer: user.stripeCustomerId,
			return_url: `${DOMAIN}/dashboard/settings/billing`,
		});

		return { success: true, url: portalSession.url };
	} catch (error) {
		console.error("Error creating customer portal session:", error);
		return { success: false, error: "Failed to create customer portal session." };
	}
}
