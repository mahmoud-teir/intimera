import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { Role, SubStatus } from "@/generated/prisma/client";
import Stripe from "stripe";

function getTierRole(priceId: string): Role {
	if (priceId === process.env.STRIPE_COUPLES_PRICE_ID) return Role.COUPLES;
	return Role.PREMIUM;
}

function toSubStatus(stripeStatus: Stripe.Subscription.Status): SubStatus {
	const map: Partial<Record<Stripe.Subscription.Status, SubStatus>> = {
		active: SubStatus.ACTIVE,
		past_due: SubStatus.PAST_DUE,
		canceled: SubStatus.CANCELED,
		unpaid: SubStatus.UNPAID,
	};
	return map[stripeStatus] ?? SubStatus.CANCELED;
}

export async function POST(req: Request) {
	const body = await req.text();
	const signature = req.headers.get("Stripe-Signature") as string;

	let event: Stripe.Event;

	try {
		event = stripe.webhooks.constructEvent(
			body,
			signature,
			process.env.STRIPE_WEBHOOK_SECRET || ""
		);
	} catch (error: any) {
		console.error("Webhook signature verification failed.", error.message);
		return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
	}

	switch (event.type) {
		case "checkout.session.completed": {
			const session = event.data.object as Stripe.Checkout.Session;
			if (session.mode !== "subscription") break;

			const subscriptionId = session.subscription as string;
			const customerId = session.customer as string;
			const userId = session.metadata?.userId;

			if (!userId) {
				console.error("No userId found in session metadata.");
				break;
			}

			const subscription = await stripe.subscriptions.retrieve(subscriptionId);
			const priceId = subscription.items.data[0].price.id;
			const role = getTierRole(priceId);

			await db.subscription.create({
				data: {
					userId,
					stripeSubscriptionId: subscription.id,
					stripeCustomerId: customerId,
					stripePriceId: priceId,
					status: toSubStatus(subscription.status),
					// @ts-ignore - Stripe v2 uses snake_case but types may differ
					currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
					// @ts-ignore
					currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
					tier: role === Role.COUPLES ? "COUPLES" : "PREMIUM",
				},
			});

			await db.user.update({
				where: { id: userId },
				data: { role },
			});
			break;
		}

		case "customer.subscription.updated": {
			const subscription = event.data.object as Stripe.Subscription;
			const priceId = subscription.items.data[0].price.id;
			const role = getTierRole(priceId);
			const isActive = subscription.status === "active" || subscription.status === "trialing";

			await db.subscription.update({
				where: { stripeSubscriptionId: subscription.id },
				data: {
					status: toSubStatus(subscription.status),
					// @ts-ignore
					currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
					tier: role === Role.COUPLES ? "COUPLES" : "PREMIUM",
				},
			});

			const sub = await db.subscription.findUnique({
				where: { stripeSubscriptionId: subscription.id },
				select: { userId: true },
			});

			if (sub) {
				await db.user.update({
					where: { id: sub.userId },
					data: { role: isActive ? role : Role.USER },
				});
			}
			break;
		}

		case "customer.subscription.deleted": {
			const subscription = event.data.object as Stripe.Subscription;

			await db.subscription.update({
				where: { stripeSubscriptionId: subscription.id },
				data: { status: SubStatus.CANCELED },
			});

			const sub = await db.subscription.findUnique({
				where: { stripeSubscriptionId: subscription.id },
				select: { userId: true },
			});

			if (sub) {
				await db.user.update({
					where: { id: sub.userId },
					data: { role: Role.USER },
				});
			}
			break;
		}

		default:
			console.log(`Unhandled event type: ${event.type}`);
	}

	return new NextResponse(null, { status: 200 });
}
