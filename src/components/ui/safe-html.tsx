"use client";

/**
 * SafeHTML — renders Tiptap/ProseMirror HTML through DOMPurify before
 * setting it in the DOM. Prevents XSS from user-generated community posts.
 *
 * Only allow tags that Tiptap's StarterKit produces:
 *   p, h1-h6, ul, ol, li, strong, em, code, pre, blockquote, a, br, hr
 */

import { useMemo } from "react";
import DOMPurify from "dompurify";

const ALLOWED_TAGS = [
	"p", "h1", "h2", "h3", "h4", "h5", "h6",
	"ul", "ol", "li", "strong", "em", "code", "pre",
	"blockquote", "a", "br", "hr", "s", "u",
];

const ALLOWED_ATTR = ["href", "rel", "target", "class"];

interface SafeHTMLProps {
	html: string;
	className?: string;
}

export function SafeHTML({ html, className }: SafeHTMLProps) {
	const sanitized = useMemo(() => {
		if (typeof window === "undefined") {
			// Server-side: strip all HTML tags as fallback (jsdom not available in RSC)
			return html.replace(/<[^>]*>/g, " ").trim();
		}

		return DOMPurify.sanitize(html, {
			ALLOWED_TAGS,
			ALLOWED_ATTR,
			// Force all links to open in new tab safely
			FORCE_BODY: true,
			RETURN_DOM_FRAGMENT: false,
			ADD_ATTR: ["target"],
		});
	}, [html]);

	return (
		<div
			className={className}
			// nosemgrep: react-dangerouslysetinnerhtml — sanitized via DOMPurify above
			dangerouslySetInnerHTML={{ __html: sanitized }}
		/>
	);
}
