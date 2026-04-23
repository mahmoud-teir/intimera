/**
 * JSON-LD structured data helpers for SEO.
 * Usage: <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema(...)) }} />
 */

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://intimera.app";

interface ArticleSchemaOptions {
	title: string;
	description: string;
	slug: string;
	publishedAt: Date | null;
	updatedAt?: Date | null;
	category?: string;
	readingTimeMin?: number;
}

/** Schema.org Article structured data for content library articles. */
export function articleSchema(opts: ArticleSchemaOptions, brand: string = process.env.NEXT_PUBLIC_APP_NAME || "Intimera") {
	return {
		"@context": "https://schema.org",
		"@type": "Article",
		headline: opts.title,
		description: opts.description,
		url: `${BASE_URL}/learn/${opts.slug}`,
		datePublished: opts.publishedAt?.toISOString(),
		dateModified: opts.updatedAt?.toISOString() ?? opts.publishedAt?.toISOString(),
		timeRequired: opts.readingTimeMin ? `PT${opts.readingTimeMin}M` : undefined,
		articleSection: opts.category,
		publisher: {
			"@type": "Organization",
			name: brand,
			url: BASE_URL,
			logo: {
				"@type": "ImageObject",
				url: `${BASE_URL}/logo.png`,
			},
		},
		author: {
			"@type": "Organization",
			name: `${brand} Editorial Team`,
		},
	};
}

/** Schema.org WebSite for the root/homepage. */
export function websiteSchema(brand: string = process.env.NEXT_PUBLIC_APP_NAME || "Intimera") {
	return {
		"@context": "https://schema.org",
		"@type": "WebSite",
		name: brand,
		url: BASE_URL,
		description: "A science-backed, AI-enhanced intimate wellness platform for couples.",
		potentialAction: {
			"@type": "SearchAction",
			target: {
				"@type": "EntryPoint",
				urlTemplate: `${BASE_URL}/library?q={search_term_string}`,
			},
			"query-input": "required name=search_term_string",
		},
	};
}

/** Schema.org FAQPage for FAQ sections. */
export function faqSchema(faqs: Array<{ question: string; answer: string }>) {
	return {
		"@context": "https://schema.org",
		"@type": "FAQPage",
		mainEntity: faqs.map((faq) => ({
			"@type": "Question",
			name: faq.question,
			acceptedAnswer: {
				"@type": "Answer",
				text: faq.answer,
			},
		})),
	};
}
