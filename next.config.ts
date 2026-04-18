import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	// Enable Turbopack for dev server
	turbopack: {},

	// Security headers
	headers: async () => [
		{
			source: "/(.*)",
			headers: [
				{ key: "X-Frame-Options", value: "DENY" },
				{ key: "X-Content-Type-Options", value: "nosniff" },
				{ key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
				{
					key: "Permissions-Policy",
					value: "camera=(), microphone=(), geolocation=()",
				},
			],
		},
	],

	// Image optimization
	images: {
		formats: ["image/avif", "image/webp"],
	},
};

export default nextConfig;
