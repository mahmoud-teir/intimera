"use client";

import { useTheme } from "next-themes";
import dynamic from "next/dynamic";

// Dynamically import Recharts — saves ~120KB from the initial JS bundle.
// The chart only renders on the Couple Dashboard, so this is a safe split point.
const {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	ReferenceLine,
} = {
	LineChart: dynamic(() => import("recharts").then((m) => m.LineChart), { ssr: false }),
	Line: dynamic(() => import("recharts").then((m) => m.Line), { ssr: false }),
	XAxis: dynamic(() => import("recharts").then((m) => m.XAxis), { ssr: false }),
	YAxis: dynamic(() => import("recharts").then((m) => m.YAxis), { ssr: false }),
	CartesianGrid: dynamic(() => import("recharts").then((m) => m.CartesianGrid), { ssr: false }),
	Tooltip: dynamic(() => import("recharts").then((m) => m.Tooltip), { ssr: false }),
	ResponsiveContainer: dynamic(() => import("recharts").then((m) => m.ResponsiveContainer), { ssr: false }),
	ReferenceLine: dynamic(() => import("recharts").then((m) => m.ReferenceLine), { ssr: false }),
};

interface CheckInPoint {
	date: string;
	score: number;
}

interface ConnectionHealthChartProps {
	data: CheckInPoint[];
}

export function ConnectionHealthChart({ data }: ConnectionHealthChartProps) {
	const { resolvedTheme } = useTheme();
	const isDark = resolvedTheme === "dark";

	// Brand Colors
	const terraColor = "#A96856";
	const sageColor = "#7F9487";
	const gridColor = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)";
	const textColor = isDark ? "#A3A3A3" : "#737373";

	// If no data, show empty state
	if (!data || data.length === 0) {
		return (
			<div
				className="h-64 flex items-center justify-center bg-white/30 dark:bg-black/10 rounded-2xl border border-sand-200 dark:border-sand-800"
				role="img"
				aria-label="No check-in data to display"
			>
				<p className="text-sand-500 font-medium">Not enough check-in data to display.</p>
			</div>
		);
	}

	return (
		<div className="h-64 w-full" role="img" aria-label="Connection health trend chart">
			<ResponsiveContainer width="100%" height="100%">
				<LineChart
					data={data}
					margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
				>
					<defs>
						<linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
							<stop offset="5%" stopColor={terraColor} stopOpacity={0.3} />
							<stop offset="95%" stopColor={terraColor} stopOpacity={0} />
						</linearGradient>
					</defs>
					
					<CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
					
					<XAxis 
						dataKey="date" 
						axisLine={false} 
						tickLine={false} 
						tick={{ fill: textColor, fontSize: 12 }} 
						dy={10}
					/>
					
					<YAxis 
						domain={[0, 10]} 
						axisLine={false} 
						tickLine={false} 
						tick={{ fill: textColor, fontSize: 12 }} 
						ticks={[0, 2, 4, 6, 8, 10]}
					/>
					
					<Tooltip
						contentStyle={{ 
							backgroundColor: isDark ? "#171717" : "#FFFFFF",
							border: `1px solid ${isDark ? "#262626" : "#E5E5E5"}`,
							borderRadius: "12px",
							boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
							color: isDark ? "#F5F5F5" : "#171717",
						}}
						itemStyle={{ color: terraColor, fontWeight: 500 }}
					/>
					
					<ReferenceLine y={5} stroke={sageColor} strokeDasharray="3 3" opacity={0.5} />
					
					<Line
						type="monotone"
						dataKey="score"
						name="Health Score"
						stroke={terraColor}
						strokeWidth={3}
						dot={{ r: 4, fill: terraColor, strokeWidth: 2, stroke: isDark ? "#000" : "#fff" }}
						activeDot={{ r: 6, strokeWidth: 0 }}
						animationDuration={1500}
					/>
				</LineChart>
			</ResponsiveContainer>
		</div>
	);
}
