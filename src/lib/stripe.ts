import Stripe from "stripe";

let _stripe: Stripe | null = null;

/**
 * Returns the Stripe instance, initializing it lazily on first access.
 * This prevents build-time failures when STRIPE_SECRET_KEY is not set
 * in the build environment.
 */
export function getStripe(): Stripe {
	if (_stripe) return _stripe;

	const key = process.env.STRIPE_SECRET_KEY;
	if (!key) {
		throw new Error(
			"STRIPE_SECRET_KEY is not configured. Set it in your environment variables."
		);
	}

	_stripe = new Stripe(key, {
		apiVersion: "2026-03-25.dahlia",
		appInfo: {
			name: "Intimera",
			url: "https://intimera.app",
		},
	});

	return _stripe;
}

/**
 * @deprecated Use getStripe() instead — avoids build-time initialization errors.
 */
export const stripe = new Proxy({} as Stripe, {
	get(_target, prop) {
		return (getStripe() as any)[prop];
	},
});
