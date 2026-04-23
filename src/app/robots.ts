import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
	const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://intimera.app";

	return {
		rules: [
			{
				userAgent: "*",
				allow: ["/", "/pricing", "/learn/"],
				disallow: [
					"/dashboard",
					"/library",
					"/exercises",
					"/advisor",
					"/community",
					"/settings",
					"/couple",
					"/admin",
					"/api/",
					"/_next/",
				],
			},
		],
		sitemap: `${BASE_URL}/sitemap.xml`,
		host: BASE_URL,
	};
}
