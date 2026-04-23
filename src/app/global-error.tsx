"use client";

import { useEffect } from "react";
import { AlertOctagon, RefreshCw } from "lucide-react";

interface GlobalErrorProps {
	error: Error & { digest?: string };
	reset: () => void;
}

/**
 * global-error.tsx — catches errors in the root layout itself.
 * Must include its own <html> and <body> tags.
 */
export default function GlobalError({ error, reset }: GlobalErrorProps) {
	useEffect(() => {
		console.error("Global layout error:", error);
	}, [error]);

	return (
		<html lang="en">
			<body
				style={{
					margin: 0,
					minHeight: "100dvh",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					backgroundColor: "#0a0a0a",
					fontFamily: "system-ui, sans-serif",
					color: "#f5f5f4",
					padding: "1rem",
				}}
			>
				<div style={{ maxWidth: "400px", textAlign: "center" }}>
					<div
						style={{
							width: "64px",
							height: "64px",
							borderRadius: "16px",
							background: "rgba(239,68,68,0.1)",
							border: "1px solid rgba(239,68,68,0.2)",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							margin: "0 auto 24px",
						}}
					>
						<AlertOctagon
							style={{ width: "32px", height: "32px", color: "#f87171" }}
							aria-hidden="true"
						/>
					</div>

					<h1 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "8px" }}>
						Critical Error
					</h1>
					<p style={{ color: "#a8a29e", marginBottom: "32px", lineHeight: 1.6 }}>
						A critical error occurred. Please refresh to continue.
					</p>

					{error.digest && (
						<p
							style={{
								fontSize: "12px",
								fontFamily: "monospace",
								color: "#57534e",
								marginBottom: "24px",
								padding: "8px 16px",
								background: "rgba(0,0,0,0.3)",
								borderRadius: "8px",
							}}
						>
							Error ID: {error.digest}
						</p>
					)}

					<button
						type="button"
						onClick={reset}
						style={{
							padding: "10px 24px",
							borderRadius: "10px",
							border: "none",
							background: "linear-gradient(135deg, #c4866c, #a96856)",
							color: "white",
							fontWeight: 600,
							cursor: "pointer",
							fontSize: "14px",
						}}
					>
						Refresh page
					</button>
				</div>
			</body>
		</html>
	);
}
