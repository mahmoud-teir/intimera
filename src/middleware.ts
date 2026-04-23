import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { rateLimit, rateLimitResponse, getClientIp } from "@/lib/utils/rate-limit";

// ─── Route definitions ────────────────────────────────────────────────────────

const LOCALES = ["en", "ar", "es", "fr"] as const;
const DEFAULT_LOCALE = "en";

// Routes that require an active session
const protectedRoutes = [
	"/dashboard",
	"/learn",
	"/exercises",
	"/advisor",
	"/community",
	"/settings",
	"/couple",
	"/bookmarks",
	"/admin",
];

// Routes that redirect authenticated users away
const authOnlyRoutes = ["/login", "/register", "/forgot-password"];

// Auth API routes needing brute-force protection
const authApiRoutes = ["/api/auth/sign-in", "/api/auth/sign-up"];

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Strip the locale prefix from a pathname: /ar/dashboard → /dashboard */
function stripLocale(pathname: string): string {
	const localePattern = new RegExp(`^\\/(${LOCALES.filter(l => l !== DEFAULT_LOCALE).join("|")})(?=\\/|$)`);
	return pathname.replace(localePattern, "") || "/";
}

/** Detect the current locale from the URL prefix or cookie */
function detectLocale(request: NextRequest): string {
	const { pathname } = request.nextUrl;
	for (const locale of LOCALES) {
		if (locale === DEFAULT_LOCALE) continue;
		if (pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)) {
			return locale;
		}
	}
	return request.cookies.get("NEXT_LOCALE")?.value ?? DEFAULT_LOCALE;
}

// ─── Main proxy function ──────────────────────────────────────────────────────

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// ── 1. Auth API Rate Limiting ─────────────────────────────────────────────
	const isAuthApi = authApiRoutes.some((r) => pathname.startsWith(r));
	if (isAuthApi && request.method === "POST") {
		const ip = getClientIp(request);
		const { success, reset } = await rateLimit(`auth:${ip}`, { limit: 5, window: 15 * 60 });
		if (!success) {
			return new NextResponse(
				JSON.stringify({ error: "Too many attempts. Please wait 15 minutes." }),
				{
					status: 429,
					headers: {
						"Content-Type": "application/json",
						"Retry-After": String(Math.max(0, reset - Math.ceil(Date.now() / 1000))),
					},
				}
			);
		}
	}

	// ── 2. Skip middleware for Next.js internals and static assets ────────────
	const isInternal = pathname.startsWith("/_next/") || pathname.startsWith("/api/");
	const isStatic = /\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?|ttf|otf|js|css|map|txt|xml)$/.test(pathname);
	if (isInternal || isStatic) {
		return NextResponse.next();
	}

	// ── 3. Locale detection ───────────────────────────────────────────────────
	const locale = detectLocale(request);
	const isRTL = locale === "ar";

	// ── 4. Strip locale prefix for auth logic ─────────────────────────────────
	const cleanPath = stripLocale(pathname);

	// ── 5. Session detection (cookie-based, no DB hit) ────────────────────────
	const sessionToken =
		request.cookies.get("better-auth.session_token")?.value ||
		request.cookies.get("__Secure-better-auth.session_token")?.value;
	const isAuthenticated = !!sessionToken;

	// ── 6. Protected route guard ──────────────────────────────────────────────
	const isProtected = protectedRoutes.some((r) => cleanPath === r || cleanPath.startsWith(r + "/"));
	if (isProtected && !isAuthenticated) {
		const loginUrl = new URL("/login", request.url);
		loginUrl.searchParams.set("returnTo", cleanPath);
		return NextResponse.redirect(loginUrl);
	}

	// ── 7. Auth-only route guard ──────────────────────────────────────────────
	const isAuthOnly = authOnlyRoutes.some((r) => cleanPath.startsWith(r));
	if (isAuthOnly && isAuthenticated) {
		return NextResponse.redirect(new URL("/dashboard", request.url));
	}

	// ── 8. Pass through or Rewrite ───────────────────────────────────────────
	// Always inject x-locale into the request headers so server components
	// can read the locale reliably (next-intl's requestLocale can't detect
	// it after we rewrite away the prefix).
	const requestHeaders = new Headers(request.headers);
	requestHeaders.set("x-locale", locale);

	const response = pathname !== cleanPath 
		? NextResponse.rewrite(new URL(cleanPath, request.url), {
			request: { headers: requestHeaders },
		})
		: NextResponse.next({
			request: { headers: requestHeaders },
		});

	response.cookies.set("NEXT_LOCALE", locale, {
		path: "/",
		sameSite: "lax",
		maxAge: 365 * 24 * 60 * 60,
	});

	if (isRTL) {
		response.headers.set("x-locale-dir", "rtl");
	}
	
	// Also set x-locale on the response so the layout can read it from headers if needed
	response.headers.set("x-locale", locale);

	return response;
}

// ─── Matcher ──────────────────────────────────────────────────────────────────
export const config = {
	matcher: [
		"/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
	],
};
