import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const title = searchParams.get("title") || process.env.NEXT_PUBLIC_APP_NAME || "Intimera";
	const description = searchParams.get("description") || "Your Private Wellness Sanctuary";
	const category = searchParams.get("category") || "";

	return new ImageResponse(
		(
			<div
				style={{
					width: "100%",
					height: "100%",
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					background: "linear-gradient(135deg, #0a0a0a 0%, #1a1008 50%, #0a0a0a 100%)",
					padding: "64px",
					fontFamily: "system-ui, sans-serif",
					position: "relative",
					overflow: "hidden",
				}}
			>
				{/* Background glow */}
				<div
					style={{
						position: "absolute",
						top: "-100px",
						left: "-100px",
						width: "600px",
						height: "600px",
						borderRadius: "50%",
						background: "radial-gradient(circle, rgba(169,104,86,0.15) 0%, transparent 70%)",
					}}
				/>

				{/* Brand */}
				<div
					style={{
						display: "flex",
						alignItems: "center",
						gap: "12px",
						marginBottom: "40px",
					}}
				>
					<div
						style={{
							width: "44px",
							height: "44px",
							borderRadius: "12px",
							background: "linear-gradient(135deg, #c4866c, #a96856)",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							color: "white",
							fontSize: "24px",
						}}
					>
						✦
					</div>
					<span style={{ color: "#f5f5f4", fontSize: "24px", fontWeight: "600", letterSpacing: "-0.02em" }}>
						{process.env.NEXT_PUBLIC_APP_NAME || "Intimera"}
					</span>
					{category && (
						<span
							style={{
								background: "rgba(169,104,86,0.2)",
								border: "1px solid rgba(169,104,86,0.4)",
								color: "#c4866c",
								fontSize: "12px",
								fontWeight: "600",
								padding: "4px 10px",
								borderRadius: "20px",
								textTransform: "uppercase",
								letterSpacing: "0.08em",
								marginLeft: "8px",
							}}
						>
							{category}
						</span>
					)}
				</div>

				{/* Title */}
				<h1
					style={{
						color: "#fafaf9",
						fontSize: title.length > 50 ? "42px" : "54px",
						fontWeight: "700",
						lineHeight: "1.15",
						letterSpacing: "-0.03em",
						margin: "0 0 20px 0",
						maxWidth: "900px",
					}}
				>
					{title}
				</h1>

				{/* Description */}
				<p
					style={{
						color: "#a8a29e",
						fontSize: "22px",
						lineHeight: "1.5",
						margin: "0",
						maxWidth: "800px",
					}}
				>
					{description}
				</p>

				{/* Bottom bar */}
				<div
					style={{
						position: "absolute",
						bottom: "48px",
						left: "64px",
						right: "64px",
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
					}}
				>
					<span style={{ color: "#57534e", fontSize: "16px" }}>{process.env.NEXT_PUBLIC_APP_URL ? new URL(process.env.NEXT_PUBLIC_APP_URL).host : "intimera.app"}</span>
					<div
						style={{
							height: "2px",
							flex: 1,
							margin: "0 24px",
							background: "linear-gradient(90deg, transparent, rgba(169,104,86,0.5), transparent)",
						}}
					/>
					<span style={{ color: "#a96856", fontSize: "16px" }}>Science-backed wellness ✦</span>
				</div>
			</div>
		),
		{
			width: 1200,
			height: 630,
		}
	);
}
