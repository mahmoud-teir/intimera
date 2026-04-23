import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";
import createNextIntlPlugin from "next-intl/plugin";

// Build the Content Security Policy string
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com https://cdn.vercel-insights.com https://va.vercel-scripts.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' blob: data: https://*.stripe.com https://*.googleusercontent.com https://utfs.io https://*.ufs.sh;
  frame-src https://js.stripe.com https://hooks.stripe.com;
  connect-src 'self' https://api.stripe.com https://api.openai.com https://vitals.vercel-insights.com https://sea1.ingest.uploadthing.com wss:;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`
	.replace(/\s{2,}/g, " ")
	.trim();

const securityHeaders = [
	// Prevent clickjacking
	{ key: "X-Frame-Options", value: "DENY" },
	// Prevent MIME-type sniffing
	{ key: "X-Content-Type-Options", value: "nosniff" },
	// Control referrer information
	{ key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
	// Disable browser features we don't use
	{
		key: "Permissions-Policy",
		value: "camera=(), microphone=(), geolocation=(), payment=(self https://js.stripe.com)",
	},
	// Force HTTPS for 1 year
	{
		key: "Strict-Transport-Security",
		value: "max-age=31536000; includeSubDomains; preload",
	},
	// Content Security Policy
	{
		key: "Content-Security-Policy",
		value: ContentSecurityPolicy,
	},
];

const nextConfig: NextConfig = {
	// Enable Turbopack for dev server
	turbopack: {},

	// Security headers applied to all routes
	headers: async () => [
		{
			source: "/(.*)",
			headers: securityHeaders,
		},
	],

	// Image optimization
	images: {
		// Serve modern formats first (AVIF ~50% smaller than JPEG; WebP as fallback)
		formats: ["image/avif", "image/webp"],
		// Device pixel ratio breakpoints for srcset
		deviceSizes: [640, 750, 828, 1080, 1200, 1920],
		imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
		remotePatterns: [
			{
				protocol: "https",
				hostname: "**.googleusercontent.com",
			},
			{
				protocol: "https",
				hostname: "**.stripe.com",
			},
			{
				protocol: "https",
				hostname: "utfs.io",
			},
			{
				protocol: "https",
				hostname: "**.ufs.sh",
			},
		],
	},

	// Compiler optimizations
	compiler: {
		// Remove console.log in production (keep console.error/warn)
		removeConsole: process.env.NODE_ENV === "production"
			? { exclude: ["error", "warn"] }
			: false,
	},

	// Experimental performance features
	experimental: {
		// Pre-render pages with cached data at build time
		ppr: false, // Enable when ready for production PPR
		// Optimize package imports to reduce bundle size
		optimizePackageImports: [
			"lucide-react",
			"@radix-ui/react-dialog",
			"@radix-ui/react-dropdown-menu",
			"@radix-ui/react-select",
			"@radix-ui/react-tabs",
			"@radix-ui/react-tooltip",
			"framer-motion",
		],
	},
};

// Bundle analyzer — run: ANALYZE=true npm run build
const withAnalyzer = withBundleAnalyzer({
	enabled: process.env.ANALYZE === "true",
	openAnalyzer: true,
});

// next-intl plugin — reads src/i18n/request.ts automatically
const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

export default withAnalyzer(withNextIntl(nextConfig));
